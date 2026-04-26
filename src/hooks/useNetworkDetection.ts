"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3Store } from "../stores/useWeb3Store";
import { getNetworkConfig } from "../lib/networkConfig";
import { createWalletConnector } from "../lib/walletConnector";

export interface NetworkMismatchState {
  isMismatched: boolean;
  expectedNetwork: string;
  currentWalletNetwork: string | null;
  walletType: string | null;
  showWarning: boolean;
}

export function useNetworkDetection() {
  const [networkState, setNetworkState] = useState<NetworkMismatchState>({
    isMismatched: false,
    expectedNetwork: "",
    currentWalletNetwork: null,
    walletType: null,
    showWarning: false,
  });

  const [isListening, setIsListening] = useState(false);
  
  const {
    isConnected,
    walletType,
    network: appNetwork,
    switchNetwork
  } = useWeb3Store();

  // Get the expected network from environment variable
  const getExpectedNetwork = useCallback(() => {
    const envNetwork = process.env.NEXT_PUBLIC_STELLAR_NETWORK?.toUpperCase();
    return envNetwork === "PUBLIC" ? "Mainnet" : "Testnet";
  }, []);

  // Check if current wallet network matches expected network
  const checkNetworkMismatch = useCallback(async () => {
    if (!isConnected || !walletType) {
      setNetworkState(prev => ({
        ...prev,
        isMismatched: false,
        currentWalletNetwork: null,
        showWarning: false,
      }));
      return;
    }

    try {
      const connector = createWalletConnector(walletType);
      const walletNetwork = await connector.getNetwork();
      const expectedNetwork = getExpectedNetwork();
      
      // Normalize network names for comparison
      const normalizeNetwork = (network: string) => {
        if (network.includes("TESTNET") || network.includes("Test SDF Network")) {
          return "Testnet";
        }
        if (network.includes("PUBLIC") || network.includes("Public Global Stellar Network")) {
          return "Mainnet";
        }
        return network;
      };

      const normalizedWalletNetwork = normalizeNetwork(walletNetwork);
      const isMismatched = normalizedWalletNetwork !== expectedNetwork;

      setNetworkState({
        isMismatched,
        expectedNetwork,
        currentWalletNetwork: walletNetwork,
        walletType,
        showWarning: isMismatched,
      });

    } catch (error) {
      console.error("Failed to check network mismatch:", error);
      setNetworkState(prev => ({
        ...prev,
        isMismatched: false,
        currentWalletNetwork: null,
        showWarning: false,
      }));
    }
  }, [isConnected, walletType, getExpectedNetwork]);

  // Set up network change listener for Freighter
  const setupNetworkListener = useCallback(() => {
    if (!isConnected || !walletType || walletType !== "freighter") {
      return;
    }

    // Check if Freighter API is available
    if (typeof window === "undefined" || !window.freighter) {
      return;
    }

    setIsListening(true);

    // Set up network change listener
    const handleNetworkChange = () => {
      checkNetworkMismatch();
    };

    // Add event listener for network changes
    window.freighter.on("networkChange", handleNetworkChange);

    // Cleanup function
    return () => {
      if (window.freighter && window.freighter.off) {
        window.freighter.off("networkChange", handleNetworkChange);
      }
      setIsListening(false);
    };
  }, [isConnected, walletType, checkNetworkMismatch]);

  // Dismiss warning
  const dismissWarning = useCallback(() => {
    setNetworkState(prev => ({ ...prev, showWarning: false }));
  }, []);

  // Force recheck network
  const recheckNetwork = useCallback(() => {
    checkNetworkMismatch();
  }, [checkNetworkMismatch]);

  // Check network on connection state changes
  useEffect(() => {
    checkNetworkMismatch();
  }, [checkNetworkMismatch]);

  // Set up network listener when connected to Freighter
  useEffect(() => {
    const cleanup = setupNetworkListener();
    return cleanup;
  }, [setupNetworkListener]);

  return {
    ...networkState,
    isListening,
    recheckNetwork,
    dismissWarning,
  };
}

// Type declaration for Freighter API
declare global {
  interface Window {
    freighter?: {
      on: (event: string, callback: () => void) => void;
      off: (event: string, callback: () => void) => void;
      getNetwork: () => Promise<{ network: string }>;
    };
  }
}
