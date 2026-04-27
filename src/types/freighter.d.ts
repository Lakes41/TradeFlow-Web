declare global {
  interface Window {
    freighter?: {
      isConnected(): Promise<boolean>;
      getAddress(): Promise<{ address: string }>;
      signTransaction(xdr: string, options?: any): Promise<{ signedTxXdr: string }>;
      getNetwork(): Promise<{ network: string }>;
      disconnect(): Promise<void>;
    };
  }
}

export {};
