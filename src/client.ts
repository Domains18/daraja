import axios, { AxiosInstance } from "axios";
import {
    AccessTokenResponse,
    DarajaConfig,
    Environment,
    StkPushPayload,
    StkPushQueryPayload,
    StkPushQueryResponse,
    StkPushResponse,
} from "./types";

/**
 * Base Daraja client for making API requests
 */
export class DarajaClient {
  private consumerKey: string;
  private consumerSecret: string;
  private baseURL: string;
  private client: AxiosInstance;
  private environment: Environment;
  private cachedToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  constructor(config: DarajaConfig, environment: Environment) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.environment = environment;
    this.baseURL =
      environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout || 30000,
    });
  }

  /**
   * Get current timestamp in the format required by M-Pesa
   */
  private getTimeStamp(): string {
    return new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
  }

  /**
   *@description Get access token from M-Pesa API with caching
  * @return {Promise<string>} Access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.cachedToken && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime) {
      return this.cachedToken;
    }

    try {
      const credentials = Buffer.from(
        `${this.consumerKey}:${this.consumerSecret}`
      ).toString("base64");
      
      const response = await this.client.get<AccessTokenResponse>(
        "/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      this.cachedToken = response.data.access_token;
      // Set expiry time (typically 3599 seconds, we'll use 3500 to be safe)
      this.tokenExpiryTime = Date.now() + 3500 * 1000;

      return this.cachedToken;
    } catch (error: any) {
      throw new Error(
        `Failed to get access token: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Initiate STK Push request
   */
  public async stkPush(payload: StkPushPayload): Promise<StkPushResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimeStamp();

    // Auto-generate the password base64(ShortCode + Passkey + Timestamp)
    const password = Buffer.from(
      `${payload.businessShortCode}${payload.passKey}${timestamp}`
    ).toString("base64");

    const requestBody = {
      BusinessShortCode: payload.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: payload.amount,
      PartyA: payload.phoneNumber,
      PartyB: payload.businessShortCode,
      PhoneNumber: payload.phoneNumber,
      CallBackURL: payload.callBackURL,
      AccountReference: payload.accountReference,
      TransactionDesc: payload.transactionDesc,
    };

    try {
      const response = await this.client.post<StkPushResponse>(
        "/mpesa/stkpush/v1/processrequest",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `STK Push failed: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Query STK Push transaction status
   */
  public async stkPushQuery(
    payload: StkPushQueryPayload
  ): Promise<StkPushQueryResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimeStamp();

    const password = Buffer.from(
      `${payload.businessShortCode}${payload.passKey}${timestamp}`
    ).toString("base64");

    const requestBody = {
      BusinessShortCode: payload.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: payload.checkoutRequestID,
    };

    try {
      const response = await this.client.post<StkPushQueryResponse>(
        "/mpesa/stkpushquery/v1/query",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `STK Push query failed: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }

  /**
   * Get the current environment
   */
  public getEnvironment(): Environment {
    return this.environment;
  }
}
