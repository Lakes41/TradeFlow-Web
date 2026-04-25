import { NetworkType } from "../stores/useWeb3Store";

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  contractIds: {
    invoice: string;
  };
}

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  Testnet: {
    name: 'Testnet',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractIds: {
      invoice: process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID_TESTNET || '',
    },
  },
  Mainnet: {
    name: 'Mainnet',
    rpcUrl: 'https://soroban.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    contractIds: {
      invoice: process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID_MAINNET || '',
    },
  },
};

export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return NETWORK_CONFIGS[network];
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

// Local storage key for network override
const NETWORK_OVERRIDE_KEY = 'tradeflow_network_override';

export function getNetworkOverride(): NetworkType | null {
  if (typeof window === 'undefined' || !isDevelopment()) return null;
  
  try {
    const override = localStorage.getItem(NETWORK_OVERRIDE_KEY);
    return override as NetworkType || null;
  } catch (error) {
    console.warn('Failed to read network override:', error);
    return null;
  }
}

export function setNetworkOverride(network: NetworkType): void {
  if (typeof window === 'undefined' || !isDevelopment()) return;
  
  try {
    localStorage.setItem(NETWORK_OVERRIDE_KEY, network);
  } catch (error) {
    console.warn('Failed to save network override:', error);
  }
}

export function clearNetworkOverride(): void {
  if (typeof window === 'undefined' || !isDevelopment()) return;
  
  try {
    localStorage.removeItem(NETWORK_OVERRIDE_KEY);
  } catch (error) {
    console.warn('Failed to clear network override:', error);
  }
}

export function getEffectiveNetwork(defaultNetwork: NetworkType = 'Testnet'): NetworkType {
  return getNetworkOverride() || defaultNetwork;
}
