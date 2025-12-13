/**
 * Example demonstrating type safety and IntelliSense support
 * 
 * This file shows how the refactored SDK provides excellent DX
 */

import { Daraja, StkPushPayload, StkPushResponse } from '../src/index';

// ✅ Type-safe configuration
const daraja = new Daraja({
  consumerKey: 'your-key',
  consumerSecret: 'your-secret',
  timeout: 30000, // Optional with type checking
});

// ✅ Environment-specific clients with full type inference
async function exampleSandbox() {
  // All parameters are type-checked and have IntelliSense support
  const payload: StkPushPayload = {
    businessShortCode: '174379',
    passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    amount: 100, // Type: number
    phoneNumber: '254708374149', // Type: string
    callBackURL: 'https://example.com/callback',
    accountReference: 'ORDER-123',
    transactionDesc: 'Payment for goods',
  };

  // ✅ Fluent API: daraja.sandbox.stkPush()
  const response: StkPushResponse = await daraja.sandbox.stkPush(payload);
  
  // ✅ Response is fully typed with IntelliSense
  console.log(response.MerchantRequestID);
  console.log(response.CheckoutRequestID);
  console.log(response.ResponseCode);
  console.log(response.ResponseDescription);
  console.log(response.CustomerMessage);
}

// ✅ Easy environment switching
async function exampleProduction() {
  // Same API, different environment - just change sandbox to production
  const response = await daraja.production.stkPush({
    businessShortCode: 'your-production-shortcode',
    passKey: 'your-production-passkey',
    amount: 1000,
    phoneNumber: '254712345678',
    callBackURL: 'https://example.com/callback',
    accountReference: 'PROD-ORDER-456',
    transactionDesc: 'Production payment',
  });

  return response;
}

// ✅ Query transaction status with type safety
async function exampleQuery() {
  const checkoutRequestID = 'ws_CO_191220191020363925';
  
  const queryResponse = await daraja.sandbox.stkPushQuery({
    businessShortCode: '174379',
    passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    checkoutRequestID,
  });

  // ✅ Fully typed response
  if (queryResponse.ResultCode === '0') {
    console.log('Transaction successful!');
  } else {
    console.log('Transaction failed:', queryResponse.ResultDesc);
  }
}

// ✅ Check environment
function checkEnvironment() {
  const sandboxEnv = daraja.sandbox.getEnvironment(); // Type: 'sandbox' | 'production'
  const prodEnv = daraja.production.getEnvironment(); // Type: 'sandbox' | 'production'
  
  console.log(`Sandbox environment: ${sandboxEnv}`); // 'sandbox'
  console.log(`Production environment: ${prodEnv}`); // 'production'
}

// ✅ Error handling with proper types
async function exampleErrorHandling() {
  try {
    const response = await daraja.sandbox.stkPush({
      businessShortCode: '174379',
      passKey: 'wrong-passkey', // This will fail
      amount: 1,
      phoneNumber: '254708374149',
      callBackURL: 'https://example.com/callback',
      accountReference: 'TEST',
      transactionDesc: 'Test',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('STK Push failed:', error.message);
      // Detailed error message from the SDK
    }
  }
}

// Export for demonstration
export {
    checkEnvironment,
    exampleErrorHandling, exampleProduction,
    exampleQuery, exampleSandbox
};
