import { create } from 'zustand';
import { Server, Asset } from 'soroban-client';

// TF Token configuration (would be actual token details in production)
const TF_TOKEN_CODE = 'TF';
const TF_TOKEN_ISSUER = 'GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KFGH'; // Example issuer
const PRO_MODE_THRESHOLD = 1000;

interface TokenBalance {
  code: string;
  issuer: string;
  balance: string;
}

interface TokenStore {
  tfTokenBalance: number;
  isConnected: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
  fetchTokenBalance: (publicKey: string) => Promise<void>;
  setConnected: (connected: boolean, publicKey?: string) => void;
  hasProModeAccess: () => boolean;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tfTokenBalance: 0,
  isConnected: false,
  publicKey: null,
  isLoading: false,
  error: null,

  fetchTokenBalance: async (publicKey: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In production, this would fetch from Stellar network
      // For now, we'll simulate with a mock balance
      const server = new Server('https://soroban-testnet.stellar.org');
      
      try {
        const account = await server.getAccount(publicKey);
        const tfAsset = new Asset(TF_TOKEN_CODE, TF_TOKEN_ISSUER);
        
        // Look for TF token balance in account balances
        const tfBalance = account.balances.find((balance: any) => 
          balance.asset_code === TF_TOKEN_CODE && 
          balance.asset_issuer === TF_TOKEN_ISSUER
        );
        
        const balance = tfBalance ? parseFloat(tfBalance.balance) : 0;
        
        set({ 
          tfTokenBalance: balance,
          isLoading: false 
        });
      } catch (error) {
        // Account not found or other error - set balance to 0
        set({ 
          tfTokenBalance: 0,
          isLoading: false,
          error: 'Unable to fetch token balance'
        });
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      set({ 
        tfTokenBalance: 0,
        isLoading: false,
        error: 'Failed to fetch token balance'
      });
    }
  },

  setConnected: (connected: boolean, publicKey?: string) => {
    set({ 
      isConnected: connected,
      publicKey: publicKey || null,
      error: null
    });
    
    if (connected && publicKey) {
      get().fetchTokenBalance(publicKey);
    } else {
      set({ tfTokenBalance: 0 });
    }
  },

  hasProModeAccess: () => {
    const { tfTokenBalance, isConnected } = get();
    return isConnected && tfTokenBalance >= PRO_MODE_THRESHOLD;
  }
}));

// Helper constants for components
export const PRO_MODE_THRESHOLD_AMOUNT = PRO_MODE_THRESHOLD;
export const TF_TOKEN_INFO = {
  code: TF_TOKEN_CODE,
  issuer: TF_TOKEN_ISSUER,
  name: 'TradeFlow Token',
  symbol: 'TF'
};
