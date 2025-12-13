import axios, { AxiosInstance } from "axios";
import { DarajaConfig, StkPushPayload, StkPushResponse } from "./types";

export class Daraja {
  private consumerKey: string;
  private consumerSecret: string;
  private baseURL: string;
  private client: AxiosInstance;

  constructor(config: DarajaConfig) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.baseURL =
      config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout || 10000,
    });
  }

  private getTimeStamp(): string {
    return new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
  }

  private async getAccessToken(): Promise<string> {
    try {
      const credentials = Buffer.from(
        `${this.consumerKey}:${this.consumerSecret}`
      ).toString("base64");
      const response = await this.client.get(
        "/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error(`Failed to get access token ${error}`);
    }
  }

  public async sendStkPush(payload: StkPushPayload): Promise<StkPushResponse> {
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
      const response = await this.client.post(
        "/mpesa/stkpush/v1/processrequest",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`STK Push failed: ${error.message}`);
    }
  }
}
