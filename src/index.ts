import { DarajaClient } from "./client";
import { DarajaConfig } from "./types";

/**
 * Main Daraja SDK class providing environment-specific clients
 *
 * @example
 * ```typescript
 * const daraja = new Daraja({
 *   consumerKey: 'your-key',
 *   consumerSecret: 'your-secret'
 * });
 *
 * // Use sandbox environment
 * const response = await daraja.sandbox.stkPush({
 *   businessShortCode: '174379',
 *   passKey: 'your-passkey',
 *   amount: 100,
 *   phoneNumber: '254712345678',
 *   callBackURL: 'https://example.com/callback',
 *   accountReference: 'Test123',
 *   transactionDesc: 'Payment for goods'
 * });
 *
 * // Use production environment
 * const prodResponse = await daraja.production.stkPush({...});
 * ```
 */
export class Daraja {
  private config: DarajaConfig;
  private _sandbox: DarajaClient | null = null;
  private _production: DarajaClient | null = null;

  constructor(config: DarajaConfig) {
    this.config = config;
  }

  /**
   * Get sandbox environment client
   */
  public get sandbox(): DarajaClient {
    if (!this._sandbox) {
      this._sandbox = new DarajaClient(this.config, "sandbox");
    }
    return this._sandbox;
  }

  /**
   * Get production environment client
   */
  public get production(): DarajaClient {
    if (!this._production) {
      this._production = new DarajaClient(this.config, "production");
    }
    return this._production;
  }
}

// Export types for consumer use
export { DarajaClient } from "./client";
export * from "./types";

// Default export
export default Daraja;
