import { 
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  XBULL_ID,
  ALBEDO_ID
} from "@creit.tech/stellar-wallets-kit";
import {
  Server,
  TransactionBuilder,
  Asset,
  Operation,
  Networks,
} from "soroban-client";

export type WalletType = string;

export interface WalletInfo {
  publicKey: string;
  walletType: WalletType;
}

export interface WalletConnector {
  /**
   * Connect to the wallet and return wallet info
   */
  connect(): Promise<WalletInfo>;
  
  /**
   * Disconnect from the wallet
   */
  disconnect(): Promise<void>;
  
  /**
   * Get the current public key
   */
  getPublicKey(): Promise<string>;
  
  /**
   * Sign a transaction
   */
  signTransaction(xdr: string, options?: any): Promise<string>;
  
  /**
   * Get the current network
   */
  getNetwork(): Promise<string>;
  
  /**
   * Check if wallet is connected
   */
  isConnected(): Promise<boolean>;
  
  /**
   * Get the wallet type
   */
  getWalletType(): WalletType;
}

// Default to Testnet for development
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

// Initialize wallet kit instance (only in browser)
const walletKit = typeof window !== "undefined" 
  ? new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      modules: allowAllModules(),
    })
  : null as unknown as StellarWalletsKit;

export class StellarWalletConnector implements WalletConnector {
  constructor(private walletType: WalletType) {}

  async connect(): Promise<WalletInfo> {
    if (!walletKit) throw new Error("Wallet kit is not available in this environment.");
    
    try {
      // Set the wallet type
      walletKit.setWallet(this.walletType);
      
      // Get public key / address
      const { address } = await walletKit.getAddress();
      
      if (!address) {
        throw new Error("Unable to retrieve public key.");
      }

      // Verify correct network (Testnet)
      const { network } = await walletKit.getNetwork();
      // The kit might return "TESTNET" or the passphrase
      if (network !== "TESTNET" && network !== WalletNetwork.TESTNET) {
        const walletName = this.getWalletName();
        throw new Error(
          `Invalid network. Please switch to TESTNET in ${walletName} settings.`,
        );
      }

      return { publicKey: address, walletType: this.walletType };
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!walletKit) return;
    
    try {
      if (walletKit.disconnect) {
        await walletKit.disconnect();
      }
    } catch (error) {
      console.error("Wallet disconnection error:", error);
    }
  }

  async getPublicKey(): Promise<string> {
    if (!walletKit) throw new Error("Wallet kit is not available in this environment.");
    
    const { address } = await walletKit.getAddress();
    if (!address) {
      throw new Error("Unable to retrieve public key.");
    }
    return address;
  }

  async signTransaction(xdr: string, options?: any): Promise<string> {
    if (!walletKit) throw new Error("Wallet kit is not available in this environment.");
    
    const { address: publicKey } = await walletKit.getAddress();
    const { signedTxXdr } = await walletKit.signTransaction(xdr, {
      address: publicKey,
      networkPassphrase: NETWORK_PASSPHRASE,
      ...options,
    });
    return signedTxXdr;
  }

  async getNetwork(): Promise<string> {
    if (!walletKit) throw new Error("Wallet kit is not available in this environment.");

    const { network } = await walletKit.getNetwork();
    return network;
  }

  async isConnected(): Promise<boolean> {
    if (!walletKit) return false;

    try {
      const { address } = await walletKit.getAddress({ skipRequestAccess: true });
      return !!address;
    } catch {
      return false;
    }
  }

  getWalletType(): WalletType {
    return this.walletType;
  }

  private getWalletName(): string {
    switch (this.walletType) {
      case FREIGHTER_ID:
        return "Freighter";
      case XBULL_ID:
        return "xBull";
      case ALBEDO_ID:
        return "Albedo";
      default:
        return "Wallet";
    }
  }
}

/**
 * Factory function to create a wallet connector for the specified wallet type
 */
export function createWalletConnector(walletType: WalletType): WalletConnector {
  return new StellarWalletConnector(walletType);
}

/**
 * Get wallet display name
 */
export function getWalletDisplayName(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "Freighter";
    case XBULL_ID:
      return "xBull";
    case ALBEDO_ID:
      return "Albedo";
    default:
      return "Unknown Wallet";
  }
}

/**
 * Get wallet description
 */
export function getWalletDescription(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "Popular browser extension wallet";
    case XBULL_ID:
      return "Mobile-first Stellar wallet";
    case ALBEDO_ID:
      return "Web-based Stellar wallet";
    default:
      return "Stellar wallet";
  }
}

/**
 * Get wallet icon SVG path
 */
export function getWalletIcon(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z";
    case XBULL_ID:
      return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
    case ALBEDO_ID:
      return "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
    default:
      return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z";
  }
}

/**
 * Get wallet background color class
 */
export function getWalletBgColor(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "bg-blue-500";
    case XBULL_ID:
      return "bg-orange-500";
    case ALBEDO_ID:
      return "bg-purple-500";
    default:
      return "bg-slate-500";
  }
}

export { FREIGHTER_ID, XBULL_ID, ALBEDO_ID };
