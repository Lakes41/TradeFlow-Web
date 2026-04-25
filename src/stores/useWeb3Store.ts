import { create } from 'zustand';
import { Server, Asset } from 'soroban-client';
import { FREIGHTER_ID, WalletType } from '../lib/stellar';
import { createWalletConnector, getWalletDisplayName } from '../lib/walletConnector';
import { getEffectiveNetwork, getNetworkConfig } from '../lib/networkConfig';

// Network configuration
export const NETWORKS = {
  TESTNET: 'Testnet',
  MAINNET: 'Mainnet'
} as const;

export type NetworkType = typeof NETWORKS[keyof typeof NETWORKS];

// Stellar network endpoints
const NETWORK_ENDPOINTS = {
  [NETWORKS.TESTNET]: 'https://soroban-testnet.stellar.org',
  [NETWORKS.MAINNET]: 'https://horizon.stellar.org'
};

interface Web3State {
  // Wallet connection state
  walletAddress: string | null;
  walletType: WalletType | null;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Network state
  network: NetworkType;
  
  // Token balances
  balances: Record<string, number>;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

interface Web3Actions {
  // Wallet actions
  connectWallet: (walletType?: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  
  // Network actions
  switchNetwork: (network: NetworkType) => Promise<void>;
  
  // Balance actions
  updateBalances: () => Promise<void>;
  updateTokenBalance: (tokenCode: string, balance: number) => void;
  
  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type Web3Store = Web3State & Web3Actions;

export const useWeb3Store = create<Web3Store>((set, get) => ({
  // Initial state
  walletAddress: null,
  walletType: null,
  isConnected: false,
  isConnecting: false,
  network: getEffectiveNetwork('Testnet'),
  balances: {},
  isLoading: false,
  error: null,

  // Connect wallet using unified wallet connector
  connectWallet: async (walletType: WalletType = FREIGHTER_ID) => {
    const { isConnected } = get();
    
    if (isConnected) {
      set({ error: 'Wallet is already connected' });
      return;
    }

    set({ isConnecting: true, error: null });

    try {
      const walletConnector = createWalletConnector(walletType);
      
      // Connect to wallet
      const walletInfo = await walletConnector.connect();
      
      if (!walletInfo.publicKey) {
        throw new Error('Unable to retrieve public key.');
      }

      // Verify correct network (Testnet)
      const network = await walletConnector.getNetwork();
      if (network !== "TESTNET" && !network.includes("Test SDF Network")) {
        const walletName = getWalletDisplayName(walletType);
        throw new Error(`Invalid network: ${network}. Please switch to TESTNET in ${walletName} settings.`);
      }

      // Update state with connected wallet
      set({
        walletAddress: walletInfo.publicKey,
        walletType: walletInfo.walletType,
        isConnected: true,
        isConnecting: false,
        error: null
      });

      // Fetch initial balances
      await get().updateBalances();

    } catch (error) {
      console.error('Wallet connection error:', error);
      set({
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      });
    }
  },

  // Disconnect wallet
  disconnectWallet: async () => {
    const { walletType } = get();
    
    try {
      if (walletType) {
        const walletConnector = createWalletConnector(walletType);
        await walletConnector.disconnect();
      }
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
    
    set({
      walletAddress: null,
      walletType: null,
      isConnected: false,
      isConnecting: false,
      balances: {},
      error: null
    });
  },

  // Switch network
  switchNetwork: async (network: NetworkType) => {
    const { isConnected, network: currentNetwork } = get();
    
    if (currentNetwork === network) {
      return; // Already on this network
    }

    set({ isLoading: true, error: null });

    try {
      // In a real implementation, you might need to disconnect and reconnect
      // or prompt the user to switch networks in their wallet
      set({ 
        network, 
        isLoading: false,
        balances: {} // Clear balances when switching networks
      });

      // If wallet is connected, fetch balances for new network
      if (isConnected) {
        await get().updateBalances();
      }

    } catch (error) {
      console.error('Network switch error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to switch network'
      });
    }
  },

  // Update all token balances
  updateBalances: async () => {
    const { walletAddress } = get();
    
    if (!walletAddress) {
      set({ error: 'No wallet connected' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Use effective network configuration
      const network = getEffectiveNetwork('Testnet');
      const config = getNetworkConfig(network);
      const server = new Server(config.horizonUrl);
      const account = await server.getAccount(walletAddress);
      
      const newBalances: Record<string, number> = {};
      
      // Process native XLM balance
      const xlmBalance = account.balances.find((balance: any) => balance.asset_type === 'native');
      if (xlmBalance) {
        newBalances['XLM'] = parseFloat(xlmBalance.balance);
      }

      // Define TradeFlow ecosystem tokens
      const ecosystemTokens = {
        'TF': 'GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KFGH', // TradeFlow Token
        'USDC': 'GBBD47F6ZKZLMN3QHAIBUKFRXKMOQAPQGZ6TL2JXH5MYJ4RPYBEQXBW6', // USDC on Stellar
        'EURC': 'GAK5GA2PQG4XQR4ERHQLQKX2SBRMJ2S5BJEXQYUOA6R5B7P7M7L4M4Q', // EURC on Stellar
      };

      // Process token balances with ecosystem token prioritization
      account.balances.forEach((balance: any) => {
        if (balance.asset_type !== 'native' && balance.asset_code) {
          const tokenCode = balance.asset_code.toUpperCase();
          const balanceValue = parseFloat(balance.balance);
          
          // Only include tokens with positive balance
          if (balanceValue > 0) {
            // Check if it's an ecosystem token and verify issuer
            if (ecosystemTokens[tokenCode as keyof typeof ecosystemTokens]) {
              const expectedIssuer = ecosystemTokens[tokenCode as keyof typeof ecosystemTokens];
              if (balance.asset_issuer === expectedIssuer) {
                newBalances[tokenCode] = balanceValue;
              }
            } else {
              // Include other tokens as well
              newBalances[tokenCode] = balanceValue;
            }
          }
        }
      });

      set({
        balances: newBalances,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Balance update error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update balances'
      });
    }
  },

  // Update specific token balance
  updateTokenBalance: (tokenCode: string, balance: number) => {
    set(state => ({
      balances: {
        ...state.balances,
        [tokenCode]: balance
      }
    }));
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));


// Selectors for common use cases
export const useWalletConnection = () => {
  const { isConnected, walletAddress, walletType, isConnecting, connectWallet, disconnectWallet, error } = useWeb3Store();
  return { isConnected, walletAddress, walletType, isConnecting, connectWallet, disconnectWallet, error };
};

export const useNetwork = () => {
  const { network, switchNetwork } = useWeb3Store();
  return { network, switchNetwork };
};

export const useBalances = () => {
  const { balances, updateBalances, isLoading, error } = useWeb3Store();
  return { balances, updateBalances, isLoading, error };
};

// Helper function to get balance for a specific token
export const useTokenBalance = (tokenCode: string) => {
  const balances = useWeb3Store(state => state.balances);
  return balances[tokenCode] || 0;
};
