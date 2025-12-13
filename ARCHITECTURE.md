/**
 * ARCHITECTURE GUIDE
 * 
 * This document explains the architecture and how to extend the SDK
 * with additional Safaricom Daraja features (B2C, B2B, C2B, etc.)
 */

/**
 * Current Structure:
 * 
 * src/
 *   ├── index.ts          - Main Daraja class with environment accessors
 *   ├── client.ts         - DarajaClient with API methods
 *   └── types.ts          - All TypeScript type definitions
 * 
 * Usage Pattern:
 *   const daraja = new Daraja(config);
 *   daraja.sandbox.stkPush(...)
 *   daraja.production.stkPush(...)
 */

/**
 * How to Add New Features (e.g., B2C, B2B, C2B):
 * 
 * 1. Add types to src/types.ts:
 */

// Example: Adding B2C types
export interface B2CPayload {
  initiatorName: string;
  securityCredential: string;
  commandID: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment';
  amount: number;
  partyA: string;
  partyB: string;
  remarks: string;
  queueTimeOutURL: string;
  resultURL: string;
  occasion?: string;
}

export interface B2CResponse {
  ConversationID: string;
  OriginatorConversationID: string;
  ResponseCode: string;
  ResponseDescription: string;
}

/**
 * 2. Add methods to src/client.ts (DarajaClient class):
 */

// Example: Adding B2C method to DarajaClient
class DarajaClientExample {
  public async b2c(payload: B2CPayload): Promise<B2CResponse> {
    const token = await this.getAccessToken();
    
    const requestBody = {
      InitiatorName: payload.initiatorName,
      SecurityCredential: payload.securityCredential,
      CommandID: payload.commandID,
      Amount: payload.amount,
      PartyA: payload.partyA,
      PartyB: payload.partyB,
      Remarks: payload.remarks,
      QueueTimeOutURL: payload.queueTimeOutURL,
      ResultURL: payload.resultURL,
      Occasion: payload.occasion || '',
    };

    try {
      const response = await this.client.post<B2CResponse>(
        '/mpesa/b2c/v1/paymentrequest',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `B2C request failed: ${error.response?.data?.errorMessage || error.message}`
      );
    }
  }
}

/**
 * 3. Usage remains consistent:
 */

// Sandbox B2C
// const response = await daraja.sandbox.b2c({...});

// Production B2C
// const response = await daraja.production.b2c({...});

/**
 * Benefits of This Architecture:
 * 
 * 1. ✅ Environment Separation: Clear distinction between sandbox and production
 * 2. ✅ Type Safety: Full TypeScript support for all methods and responses
 * 3. ✅ Lazy Loading: Clients are only created when accessed
 * 4. ✅ Single Configuration: One config object for both environments
 * 5. ✅ Extensibility: Easy to add new features while maintaining consistency
 * 6. ✅ Developer Experience: Fluent API with IntelliSense support
 * 7. ✅ Token Caching: Automatic token management per client
 * 8. ✅ Error Handling: Consistent error patterns across all methods
 */

/**
 * Future Features Roadmap:
 * 
 * Following the same pattern, you can add:
 * 
 * - B2C (Business to Customer):
 *   daraja.sandbox.b2c(...)
 *   daraja.production.b2c(...)
 * 
 * - B2B (Business to Business):
 *   daraja.sandbox.b2b(...)
 *   daraja.production.b2b(...)
 * 
 * - C2B (Customer to Business):
 *   daraja.sandbox.c2bRegister(...)
 *   daraja.sandbox.c2bSimulate(...)
 * 
 * - Account Balance:
 *   daraja.sandbox.accountBalance(...)
 * 
 * - Transaction Status:
 *   daraja.sandbox.transactionStatus(...)
 * 
 * - Reversal:
 *   daraja.sandbox.reversal(...)
 * 
 * - Dynamic QR:
 *   daraja.sandbox.generateQR(...)
 */

/**
 * Testing Strategy:
 * 
 * 1. Unit Tests:
 *    - Test type definitions
 *    - Test client methods with mocked axios
 *    - Test error handling
 * 
 * 2. Integration Tests:
 *    - Test against sandbox environment
 *    - Verify response shapes
 *    - Test error scenarios
 * 
 * 3. Type Tests:
 *    - Ensure TypeScript compilation
 *    - Verify type exports
 *    - Check IntelliSense functionality
 */

export {};
