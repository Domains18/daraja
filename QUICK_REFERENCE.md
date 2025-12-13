# Quick Reference Guide

## Installation

```bash
npm install @safaricom/daraja-sdk
```

## Basic Usage

```typescript
import { Daraja } from '@safaricom/daraja-sdk';

const daraja = new Daraja({
  consumerKey: 'your-key',
  consumerSecret: 'your-secret'
});

// Sandbox
const response = await daraja.sandbox.stkPush({...});

// Production
const response = await daraja.production.stkPush({...});
```

## API Methods

### STK Push
```typescript
await daraja.sandbox.stkPush({
  businessShortCode: '174379',
  passKey: 'your-passkey',
  amount: 100,
  phoneNumber: '254712345678',
  callBackURL: 'https://example.com/callback',
  accountReference: 'Order-123',
  transactionDesc: 'Payment for goods'
});
```

### STK Push Query
```typescript
await daraja.sandbox.stkPushQuery({
  businessShortCode: '174379',
  passKey: 'your-passkey',
  checkoutRequestID: 'ws_CO_...'
});
```

### Get Environment
```typescript
daraja.sandbox.getEnvironment();    // 'sandbox'
daraja.production.getEnvironment(); // 'production'
```

## Environment Variables

Create a `.env` file:
```bash
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey
```

## Type Imports

```typescript
import {
  Daraja,
  DarajaClient,
  DarajaConfig,
  StkPushPayload,
  StkPushResponse,
  StkPushQueryPayload,
  StkPushQueryResponse,
  Environment
} from '@safaricom/daraja-sdk';
```

## Error Handling

```typescript
try {
  const response = await daraja.sandbox.stkPush({...});
} catch (error) {
  console.error('Error:', error.message);
}
```

## Common Patterns

### Environment-based Client
```typescript
const client = process.env.NODE_ENV === 'production'
  ? daraja.production
  : daraja.sandbox;

await client.stkPush({...});
```

### With Retry Logic
```typescript
async function retryablePayment(payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await daraja.sandbox.stkPush(payload);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## Phone Number Format
Always use: `254XXXXXXXXX` (Kenya country code + 9 digits)

## Response Codes
- `'0'` = Success
- Other codes indicate errors (check ResponseDescription)

## Callback Handling

```typescript
app.post('/api/mpesa/callback', (req, res) => {
  const { Body } = req.body;
  const { ResultCode, ResultDesc } = Body.stkCallback;
  
  if (ResultCode === 0) {
    // Payment successful
    const metadata = Body.stkCallback.CallbackMetadata.Item;
    // Process metadata
  }
  
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});
```

## Testing

Sandbox credentials (for testing):
- Short Code: `174379`
- Passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- Test Phone: `254708374149`

## Links

- [README](README.md) - Full documentation
- [Examples](examples/) - Code examples
- [Architecture](ARCHITECTURE.md) - How to extend
- [Contributing](CONTRIBUTING.md) - How to contribute
