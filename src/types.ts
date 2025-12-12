

export interface DarajaConfig {
    consumerKey: string;
    consumerSecret: string;
    environment?: 'sandbox' | 'production';
    timeout?: number;
}


export interface StkPushPayload {
    businessShortCode: string;
    passKey: string;
    amount: number;
    phoneNumber: string; 
    callBackURL: string;
    accountReference: string;
    transactionDesc: string;
}


export interface StkPushResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}