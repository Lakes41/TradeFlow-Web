"use client";

import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import { 
  getNetworkOverride, 
  setNetworkOverride, 
  clearNetworkOverride,
  getEffectiveNetwork,
  getNetworkConfig,
  isDevelopment,
  NETWORK_CONFIGS 
} from "../lib/networkConfig";
import { getSorobanConfig } from "../soroban/config";
import { getSorobanClient } from "../soroban/client";

export default function NetworkToggleTest() {
  const [currentOverride, setCurrentOverride] = useState(getNetworkOverride());
  const [effectiveNetwork, setEffectiveNetwork] = useState(getEffectiveNetwork());
  const [sorobanConfig, setSorobanConfig] = useState<any>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshState = () => {
    setCurrentOverride(getNetworkOverride());
    setEffectiveNetwork(getEffectiveNetwork());
    
    try {
      const config = getSorobanConfig();
      setSorobanConfig(config);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const testClientConnection = async () => {
    try {
      setError(null);
      const client = getSorobanClient();
      // Test basic connectivity
      await client.getLatestLedger();
      setIsClientReady(true);
    } catch (err: any) {
      setError(`Client connection failed: ${err.message}`);
      setIsClientReady(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleSetNetwork = (network: 'Testnet' | 'Mainnet') => {
    setNetworkOverride(network);
    setTimeout(() => {
      refreshState();
      testClientConnection();
    }, 100);
  };

  const handleClearOverride = () => {
    clearNetworkOverride();
    setTimeout(() => {
      refreshState();
      testClientConnection();
    }, 100);
  };

  const config = sorobanConfig ? getNetworkConfig(effectiveNetwork) : null;

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Network Toggle Test</h2>
      
      {/* Environment Info */}
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Environment</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Is Development:</span>
            <span className={`ml-2 font-medium ${isDevelopment() ? 'text-green-400' : 'text-red-400'}`}>
              {isDevelopment() ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Current Override:</span>
            <span className={`ml-2 font-medium ${currentOverride ? 'text-blue-400' : 'text-slate-400'}`}>
              {currentOverride || 'None'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Effective Network:</span>
            <span className={`ml-2 font-medium ${
              effectiveNetwork === 'Testnet' ? 'text-blue-400' : 'text-green-400'
            }`}>
              {effectiveNetwork}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Client Ready:</span>
            <span className={`ml-2 font-medium ${isClientReady ? 'text-green-400' : 'text-red-400'}`}>
              {isClientReady ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      {config && (
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Current Network Configuration</h3>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div><span className="text-slate-400">Network Name:</span> <span className="text-white ml-2">{config.name}</span></div>
            <div><span className="text-slate-400">RPC URL:</span> <span className="text-blue-400 font-mono ml-2">{config.rpcUrl}</span></div>
            <div><span className="text-slate-400">Horizon URL:</span> <span className="text-green-400 font-mono ml-2">{config.horizonUrl}</span></div>
            <div><span className="text-slate-400">Network Passphrase:</span> <span className="text-yellow-400 font-mono ml-2 text-xs">{config.networkPassphrase}</span></div>
            <div><span className="text-slate-400">Invoice Contract:</span> <span className="text-purple-400 font-mono ml-2 text-xs">{config.contractIds.invoice || 'Not configured'}</span></div>
          </div>
        </div>
      )}

      {/* Soroban Config */}
      {sorobanConfig && (
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Soroban Configuration</h3>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div><span className="text-slate-400">RPC URL:</span> <span className="text-blue-400 font-mono ml-2">{sorobanConfig.rpcUrl}</span></div>
            <div><span className="text-slate-400">Network Passphrase:</span> <span className="text-yellow-400 font-mono ml-2 text-xs">{sorobanConfig.networkPassphrase}</span></div>
            <div><span className="text-slate-400">Invoice Contract:</span> <span className="text-purple-400 font-mono ml-2 text-xs">{sorobanConfig.contractIds.invoice}</span></div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Test Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Test Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleSetNetwork('Testnet')} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={currentOverride === 'Testnet'}
          >
            Set Testnet Override
          </Button>
          
          <Button 
            onClick={() => handleSetNetwork('Mainnet')} 
            className="bg-green-600 hover:bg-green-700"
            disabled={currentOverride === 'Mainnet'}
          >
            Set Mainnet Override
          </Button>
          
          <Button 
            onClick={handleClearOverride} 
            className="bg-red-600 hover:bg-red-700"
            disabled={!currentOverride}
          >
            Clear Override
          </Button>
          
          <Button 
            onClick={refreshState} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Refresh State
          </Button>
          
          <Button 
            onClick={testClientConnection} 
            className="bg-orange-600 hover:bg-orange-700"
          >
            Test Client Connection
          </Button>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Instructions</h3>
        <ol className="text-slate-300 space-y-2 list-decimal list-inside">
          <li>Click "Set Testnet Override" to force Testnet network</li>
          <li>Click "Set Mainnet Override" to force Mainnet network</li>
          <li>Click "Clear Override" to use default network</li>
          <li>Click "Test Client Connection" to verify API connectivity</li>
          <li>Click "Refresh State" to update displayed information</li>
          <li>Check that RPC URLs and configurations update correctly</li>
          <li>Verify client connection works for both networks</li>
        </ol>
        
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Expected Behavior:</strong> Network override should persist across page refreshes, 
            update all API endpoints dynamically, and only be visible in development builds.
          </p>
        </div>
      </div>
    </div>
  );
}
