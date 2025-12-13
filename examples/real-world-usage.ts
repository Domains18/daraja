import { Daraja, StkPushResponse } from '../src/index';

/**
 * Complete working example with Express.js
 * This shows how to integrate the Daraja SDK into a real application
 */

// Example with Express.js
async function expressExample() {
  // Initialize SDK once
  const daraja = new Daraja({
    consumerKey: process.env.DARAJA_CONSUMER_KEY!,
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET!,
  });

  // Use environment based on NODE_ENV
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const client = isDevelopment ? daraja.sandbox : daraja.production;

  console.log(`Using ${client.getEnvironment()} environment`);

  // Example: Initiate payment
  try {
    const paymentResponse = await client.stkPush({
      businessShortCode: process.env.MPESA_SHORT_CODE!,
      passKey: process.env.MPESA_PASSKEY!,
      amount: 100,
      phoneNumber: '254712345678',
      callBackURL: `${process.env.APP_URL}/api/mpesa/callback`,
      accountReference: 'ORDER-123',
      transactionDesc: 'Payment for order #123',
    });

    console.log('Payment initiated:', paymentResponse);

    // Store CheckoutRequestID for later querying
    return paymentResponse;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
}

// Example: Check payment status
async function checkPaymentStatus(checkoutRequestID: string) {
  const daraja = new Daraja({
    consumerKey: process.env.DARAJA_CONSUMER_KEY!,
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET!,
  });

  const isDevelopment = process.env.NODE_ENV !== 'production';
  const client = isDevelopment ? daraja.sandbox : daraja.production;

  try {
    const status = await client.stkPushQuery({
      businessShortCode: process.env.MPESA_SHORT_CODE!,
      passKey: process.env.MPESA_PASSKEY!,
      checkoutRequestID,
    });

    if (status.ResultCode === '0') {
      console.log('Payment successful:', status.ResultDesc);
    } else {
      console.log('Payment failed:', status.ResultDesc);
    }

    return status;
  } catch (error) {
    console.error('Status check failed:', error);
    throw error;
  }
}

// Example: Process callback
interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

function processCallback(callback: MpesaCallback) {
  const { stkCallback } = callback.Body;

  if (stkCallback.ResultCode === 0) {
    // Payment successful
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    const amount = metadata.find(item => item.Name === 'Amount')?.Value;
    const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

    console.log('Payment Successful!');
    console.log('Amount:', amount);
    console.log('Receipt:', mpesaReceiptNumber);
    console.log('Phone:', phoneNumber);
    
    // Update your database here
    // await updateOrderStatus(stkCallback.CheckoutRequestID, 'paid');
  } else {
    // Payment failed
    console.log('Payment Failed:', stkCallback.ResultDesc);
    
    // Update your database here
    // await updateOrderStatus(stkCallback.CheckoutRequestID, 'failed');
  }
}

// Example: With retry logic
async function initiatePaymentWithRetry(
  phoneNumber: string,
  amount: number,
  reference: string,
  maxRetries = 3
): Promise<StkPushResponse> {
  const daraja = new Daraja({
    consumerKey: process.env.DARAJA_CONSUMER_KEY!,
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET!,
  });

  const client = process.env.NODE_ENV === 'production' 
    ? daraja.production 
    : daraja.sandbox;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.stkPush({
        businessShortCode: process.env.MPESA_SHORT_CODE!,
        passKey: process.env.MPESA_PASSKEY!,
        amount,
        phoneNumber,
        callBackURL: `${process.env.APP_URL}/api/mpesa/callback`,
        accountReference: reference,
        transactionDesc: `Payment for ${reference}`,
      });

      console.log(`Payment initiated successfully on attempt ${attempt}`);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Payment failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Export examples
export {
    checkPaymentStatus, expressExample, initiatePaymentWithRetry, processCallback
};
