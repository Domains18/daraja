import { Daraja } from '../src/index';

/**
 * Example usage of the Daraja SDK
 */

async function main() {
  // Initialize the SDK
  const daraja = new Daraja({
    consumerKey: process.env.DARAJA_CONSUMER_KEY || 'your-consumer-key',
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET || 'your-consumer-secret',
  });

  try {
    // Example 1: STK Push in sandbox
    console.log('Initiating STK Push in sandbox...');
    const stkResponse = await daraja.sandbox.stkPush({
      businessShortCode: '174379',
      passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
      amount: 1,
      phoneNumber: '254708374149',
      callBackURL: 'https://mydomain.com/path',
      accountReference: 'CompanyXLTD',
      transactionDesc: 'Payment of X',
    });

    console.log('STK Push Response:', stkResponse);

    // Example 2: Query STK Push status
    if (stkResponse.ResponseCode === '0') {
      console.log('\nQuerying transaction status...');
      
      // Wait a few seconds before querying
      await new Promise(resolve => setTimeout(resolve, 5000));

      const queryResponse = await daraja.sandbox.stkPushQuery({
        businessShortCode: '174379',
        passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
        checkoutRequestID: stkResponse.CheckoutRequestID,
      });

      console.log('Query Response:', queryResponse);
    }

    // Example 3: Check environment
    console.log('\nCurrent environment:', daraja.sandbox.getEnvironment());

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example
main();
