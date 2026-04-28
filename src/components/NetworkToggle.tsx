"use client";

import React, { useState, useEffect } from "react";
import { NetworkType } from "../stores/useWeb3Store";
import { 
  getNetworkOverride, 
  setNetworkOverride, 
  getEffectiveNetwork,
  isDevelopment,
  NETWORK_CONFIGS 
} from "../lib/networkConfig";

interface NetworkToggleProps {
  currentNetwork?: NetworkType;
  onNetworkChange?: (network: NetworkType) => void;
  className?: string;
}

export default function NetworkToggle({ 
  currentNetwork, 
  onNetworkChange, 
  className = "" 
}: NetworkToggleProps) {
  // Hide in production builds
  if (!isDevelopment()) {
    return null;
  }

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(() => {
    return getNetworkOverride() || currentNetwork || 'Testnet';
  });

  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const override = getNetworkOverride();
    if (override) {
      setSelectedNetwork(override);
    }
  }, []);

  const handleNetworkChange = async (network: NetworkType) => {
    if (network === selectedNetwork || isSwitching) return;

    setIsSwitching(true);
    
    try {
      // Save to localStorage
      setNetworkOverride(network);
      setSelectedNetwork(network);
      
      // Notify parent component
      if (onNetworkChange) {
        onNetworkChange(network);
      }
      
      // Reload the page to apply network changes
      // This ensures all API clients are re-initialized with new endpoints
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const networkConfig = NETWORK_CONFIGS[selectedNetwork];
  const isTestnet = selectedNetwork === 'Testnet';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Network:</span>
        <div className="relative">
          {/* Network Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isTestnet 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isTestnet ? 'bg-blue-400' : 'bg-green-400'
            } ${isSwitching ? 'animate-pulse' : ''}`} />
            {networkConfig.name}
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={() => handleNetworkChange(isTestnet ? 'Mainnet' : 'Testnet')}
            disabled={isSwitching}
            className={`ml-2 relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isTestnet ? 'bg-blue-600' : 'bg-green-600'
            } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
            title={`Switch to ${isTestnet ? 'Mainnet' : 'Testnet'}`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                isTestnet ? 'translate-x-1' : 'translate-x-5'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Dev indicator */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        <span className="text-xs text-orange-400 font-medium">DEV</span>
      </div>
      
      {/* Switching indicator */}
      {isSwitching && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-spin" />
          <span className="text-xs text-yellow-400">Switching...</span>
        </div>
      )}
    </div>
  );
}

// Hook to get current effective network
export function useEffectiveNetwork(defaultNetwork: NetworkType = 'Testnet'): NetworkType {
  const [network, setNetwork] = useState<NetworkType>(() => getEffectiveNetwork(defaultNetwork));
  
  useEffect(() => {
    const checkOverride = () => {
      const effective = getEffectiveNetwork(defaultNetwork);
      if (effective !== network) {
        setNetwork(effective);
      }
    };
    
    // Check immediately
    checkOverride();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradeflow_network_override') {
        checkOverride();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [network, defaultNetwork]);
  
  return network;
}

// Inconsequential change for repo health
