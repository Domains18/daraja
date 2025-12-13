# Daraja SDK

A modern, type-safe Node.js SDK for Safaricom's Daraja API with excellent developer experience.

## Features

✨ **Type-Safe** - Full TypeScript support with comprehensive type definitions  
🔄 **Environment Switching** - Easy switching between sandbox and production environments  
🚀 **Modern API** - Clean, fluent API design (`daraja.sandbox.stkPush()`)  
⚡ **Performance** - Automatic access token caching  
🛡️ **Error Handling** - Detailed error messages and proper error handling  
📦 **Zero Config** - Sensible defaults with easy configuration

## Installation

```bash
npm install @safaricom/daraja-sdk
```

or

```bash
yarn add @safaricom/daraja-sdk
```

## Quick Start

```typescript
import { Daraja } from '@safaricom/daraja-sdk';

// Initialize the SDK with your credentials
const daraja = new Daraja({
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-consumer-secret',
  timeout: 30000 // optional, defaults to 30000ms
});

// Use sandbox environment for testing
const response = await daraja.sandbox.stkPush({
  businessShortCode: '174379',
  passKey: 'your-passkey',
  amount: 100,
  phoneNumber: '254712345678',
  callBackURL: 'https://yourdomain.com/callback',
  accountReference: 'Order-123',
  transactionDesc: 'Payment for goods'
});

console.log(response);
// {
//   MerchantRequestID: '...',
//   CheckoutRequestID: '...',
//   ResponseCode: '0',
//   ResponseDescription: 'Success. Request accepted for processing',
//   CustomerMessage: 'Success. Request accepted for processing'
// }
```

## Usage

### Initialize the SDK

```typescript
import { Daraja } from '@safaricom/daraja-sdk';

const daraja = new Daraja({
  consumerKey: process.env.DARAJA_CONSUMER_KEY!,
  consumerSecret: process.env.DARAJA_CONSUMER_SECRET!,
  timeout: 30000 // optional
});
```

### STK Push (Lipa Na M-Pesa Online)

Initiate an STK Push request to prompt a customer to pay:

```typescript
// Sandbox environment
const response = await daraja.sandbox.stkPush({
  businessShortCode: '174379',
  passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  amount: 1,
  phoneNumber: '254708374149', // Customer phone number
  callBackURL: 'https://yourdomain.com/api/mpesa/callback',
  accountReference: 'CompanyXLTD',
  transactionDesc: 'Payment for goods'
});

// Production environment
const prodResponse = await daraja.production.stkPush({
  businessShortCode: 'your-shortcode',
  passKey: 'your-production-passkey',
  amount: 1000,
  phoneNumber: '254712345678',
  callBackURL: 'https://yourdomain.com/api/mpesa/callback',
  accountReference: 'Invoice-456',
  transactionDesc: 'Payment for services'
});
```

### Query STK Push Transaction Status

Check the status of an STK Push transaction:

```typescript
const queryResponse = await daraja.sandbox.stkPushQuery({
  businessShortCode: '174379',
  passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  checkoutRequestID: 'ws_CO_191220191020363925'
});

console.log(queryResponse);
// {
//   ResponseCode: '0',
//   ResponseDescription: 'The service request has been accepted successfully',
//   MerchantRequestID: '...',
//   CheckoutRequestID: '...',
//   ResultCode: '0',
//   ResultDesc: 'The service request is processed successfully.'
// }
```

### Environment Methods

Both `sandbox` and `production` clients provide the same methods:

- `stkPush(payload)` - Initiate STK Push
- `stkPushQuery(payload)` - Query STK Push status
- `getEnvironment()` - Get current environment name

```typescript
// Check which environment you're using
console.log(daraja.sandbox.getEnvironment()); // 'sandbox'
console.log(daraja.production.getEnvironment()); // 'production'
```

## API Reference

### Configuration

```typescript
interface DarajaConfig {
  consumerKey: string;      // Your Daraja API consumer key
  consumerSecret: string;   // Your Daraja API consumer secret
  timeout?: number;         // Request timeout in milliseconds (default: 30000)
}
```

### STK Push Payload

```typescript
interface StkPushPayload {
  businessShortCode: string;  // Your M-Pesa paybill/till number
  passKey: string;            // Your Lipa Na M-Pesa passkey
  amount: number;             // Amount to charge
  phoneNumber: string;        // Customer phone number (format: 254XXXXXXXXX)
  callBackURL: string;        // Your callback URL for transaction results
  accountReference: string;   // Account reference (up to 12 characters)
  transactionDesc: string;    // Transaction description
}
```

### STK Push Response

```typescript
interface StkPushResponse {
  MerchantRequestID: string;      // Unique request ID
  CheckoutRequestID: string;      // Checkout request ID for querying
  ResponseCode: string;           // '0' for success
  ResponseDescription: string;    // Response description
  CustomerMessage: string;        // Message to display to customer
}
```

### STK Push Query Payload

```typescript
interface StkPushQueryPayload {
  businessShortCode: string;   // Your M-Pesa paybill/till number
  passKey: string;             // Your Lipa Na M-Pesa passkey
  checkoutRequestID: string;   // CheckoutRequestID from STK Push response
}
```

## Error Handling

The SDK provides detailed error messages:

```typescript
try {
  const response = await daraja.sandbox.stkPush({
    // ... payload
  });
} catch (error) {
  console.error('STK Push failed:', error.message);
  // Handle error appropriately
}
```

## Best Practices

1. **Use Environment Variables**: Store credentials securely in environment variables
   ```typescript
   const daraja = new Daraja({
     consumerKey: process.env.DARAJA_CONSUMER_KEY!,
     consumerSecret: process.env.DARAJA_CONSUMER_SECRET!
   });
   ```

2. **Test in Sandbox First**: Always test your integration in sandbox before going to production

3. **Handle Callbacks**: Implement a robust callback handler for transaction results

4. **Query Transaction Status**: Use `stkPushQuery` to check pending transactions

5. **Phone Number Format**: Always use the format `254XXXXXXXXX` (Kenya country code + number)

## Roadmap

Future features planned:

- [ ] B2C (Business to Customer) transactions
- [ ] B2B (Business to Business) transactions  
- [ ] C2B (Customer to Business) transactions
- [ ] Account Balance query
- [ ] Transaction Status query
- [ ] Reversal API
- [ ] QR Code generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [https://github.com/Domains18/daraja/issues](https://github.com/Domains18/daraja/issues)
- Safaricom Daraja API Documentation: [https://developer.safaricom.co.ke](https://developer.safaricom.co.ke)

## Acknowledgments

This SDK is not officially affiliated with Safaricom. It's a community-driven project to make integrating with Daraja API easier for Node.js developers.
