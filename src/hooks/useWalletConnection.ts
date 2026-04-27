"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3Store } from "../stores/useWeb3Store";
import { useTokenStore } from "../stores/tokenStore";
import { 
  getCachedWalletConnection, 
  setWalletConnectionCache, 
  clearWalletCache, 
  needsRevalidation,
  updateCacheTimestamp 
} from "../lib/walletCache";
import { createWalletConnector } from "../lib/walletConnector";

export function useWalletConnection() {
  const web3Store = useWeb3Store();
  const tokenStore = useTokenStore();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationError, setRevalidationError] = useState<string | null>(null);

  // Initialize with cached state synchronously
  const initializeFromCache = useCallback(() => {
    if (isInitialized) return;

    const cached = getCachedWalletConnection();
    
    if (cached.isCached && cached.isConnected) {
      // For now, we'll update the token store and let the Web3Store initialize normally
      // The cache will be used by components that check it directly
      tokenStore.setConnected(true, cached.walletAddress || undefined);
      
      // We could potentially use a Zustand persist middleware or similar
      // but for now, this approach prevents the major UI flicker
    }

    setIsInitialized(true);
  }, [isInitialized, tokenStore]);

  // Background revalidation
  const revalidateConnection = useCallback(async () => {
    if (!needsRevalidation()) return;

    setIsRevalidating(true);
    setRevalidationError(null);

    try {
      const { walletAddress, walletType } = web3Store;
      
      if (!walletAddress || !walletType) {
        // No cached connection to validate
        clearWalletCache();
        return;
      }

      // Create wallet connector and check if still connected
      const connector = createWalletConnector(walletType);
      const isConnected = await connector.isConnected();

      if (isConnected) {
        // Connection is still valid, update cache timestamp
        updateCacheTimestamp();
        
        // Optionally refresh balances
        try {
          await web3Store.updateBalances();
        } catch (balanceError) {
          console.warn('Failed to refresh balances during revalidation:', balanceError);
        }
      } else {
        // Connection is no longer valid, clear cache and disconnect
        clearWalletCache();
        web3Store.disconnectWallet();
        tokenStore.setConnected(false, undefined);
      }
    } catch (error) {
      console.error('Revalidation failed:', error);
      setRevalidationError(error instanceof Error ? error.message : 'Revalidation failed');
      
      // If revalidation fails, clear cache and disconnect to be safe
      clearWalletCache();
      web3Store.disconnectWallet();
      tokenStore.setConnected(false, undefined);
    } finally {
      setIsRevalidating(false);
    }
  }, [web3Store, tokenStore]);

  // Enhanced connect wallet that updates cache
  const enhancedConnectWallet = useCallback(async (walletType?: string) => {
    try {
      await web3Store.connectWallet(walletType as any);
      
      // Update cache after successful connection
      setWalletConnectionCache(
        web3Store.walletAddress,
        web3Store.walletType,
        web3Store.isConnected,
        web3Store.network
      );
      
      tokenStore.setConnected(true, web3Store.walletAddress || undefined);
    } catch (error) {
      // Clear cache on connection failure
      clearWalletCache();
      throw error;
    }
  }, [web3Store, tokenStore]);

  // Enhanced disconnect wallet that clears cache
  const enhancedDisconnectWallet = useCallback(() => {
    web3Store.disconnectWallet();
    tokenStore.setConnected(false, undefined);
    clearWalletCache();
  }, [web3Store, tokenStore]);

  // Initialize on mount
  useEffect(() => {
    initializeFromCache();
  }, [initializeFromCache]);

  // Revalidate after initialization if needed
  useEffect(() => {
    if (isInitialized && needsRevalidation()) {
      revalidateConnection();
    }
  }, [isInitialized, revalidateConnection]);

  // Automatic reconnection on app load
  useEffect(() => {
    if (!isInitialized) return;

    const attemptAutoReconnect = async () => {
      const cached = getCachedWalletConnection();
      
      if (cached.isCached && cached.isConnected && cached.walletAddress && cached.walletType) {
        try {
          // Create wallet connector and check if still connected
          const connector = createWalletConnector(cached.walletType);
          const isConnected = await connector.isConnected();
          
          if (isConnected) {
            // Get current public key to verify it matches cached one
            const currentPublicKey = await connector.getPublicKey();
            
            if (currentPublicKey === cached.walletAddress) {
              // Auto-reconnect successful - update store state
              web3Store.walletAddress = cached.walletAddress;
              web3Store.walletType = cached.walletType;
              web3Store.isConnected = true;
              tokenStore.setConnected(true, cached.walletAddress);
              
              // Update cache timestamp
              updateCacheTimestamp();
              
              // Refresh balances
              try {
                await web3Store.updateBalances();
              } catch (balanceError) {
                console.warn('Failed to refresh balances during auto-reconnect:', balanceError);
              }
              
              console.log('Auto-reconnected to wallet:', cached.walletAddress);
            } else {
              // Public key changed, clear cache
              clearWalletCache();
              console.log('Wallet public key changed, clearing cache');
            }
          } else {
            // Not connected anymore, clear cache
            clearWalletCache();
            console.log('Wallet no longer connected, clearing cache');
          }
        } catch (error) {
          console.error('Auto-reconnection failed:', error);
          // Clear cache on failure
          clearWalletCache();
        }
      }
    };

    attemptAutoReconnect();
  }, [isInitialized, web3Store, tokenStore]);

  // Periodic revalidation (every 2 minutes)
  useEffect(() => {
    if (!web3Store.isConnected) return;

    const interval = setInterval(() => {
      revalidateConnection();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [web3Store.isConnected, revalidateConnection]);

  return {
    // Enhanced connection methods
    connectWallet: enhancedConnectWallet,
    disconnectWallet: enhancedDisconnectWallet,
    
    // State information
    isInitialized,
    isRevalidating,
    revalidationError,
    
    // Revalidation control
    revalidateConnection,
    
    // Original store properties (pass through)
    walletAddress: web3Store.walletAddress,
    walletType: web3Store.walletType,
    isConnected: web3Store.isConnected,
    isConnecting: web3Store.isConnecting,
    network: web3Store.network,
    balances: web3Store.balances,
    isLoading: web3Store.isLoading,
    error: web3Store.error,
    
    // Original store methods (pass through)
    switchNetwork: web3Store.switchNetwork,
    updateBalances: web3Store.updateBalances,
    updateTokenBalance: web3Store.updateTokenBalance,
    clearError: web3Store.clearError,
    setLoading: web3Store.setLoading,
  };
}
