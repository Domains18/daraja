/**
 * Environment types
 */
export type Environment = "sandbox" | "production";

/**
 * Base configuration for Daraja SDK
 */
export interface DarajaConfig {
  consumerKey: string;
  consumerSecret: string;
  timeout?: number;
}

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig extends DarajaConfig {
  environment: Environment;
}

/**
 * M-Pesa STK Push request payload
 */
export interface StkPushPayload {
  businessShortCode: string;
  passKey: string;
  amount: number;
  phoneNumber: string;
  callBackURL: string;
  accountReference: string;
  transactionDesc: string;
}

/**
 * M-Pesa STK Push API response
 */
export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/**
 * M-Pesa Access Token response
 */
export interface AccessTokenResponse {
  access_token: string;
  expires_in: string;
}

/**
 * Error response from Daraja API
 */
export interface DarajaErrorResponse {
  requestId?: string;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * STK Push query request
 */
export interface StkPushQueryPayload {
  businessShortCode: string;
  passKey: string;
  checkoutRequestID: string;
}

/**
 * STK Push query response
 */
export interface StkPushQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}
