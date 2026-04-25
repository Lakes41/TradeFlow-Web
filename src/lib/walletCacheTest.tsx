"use client";

import React, { useState } from "react";
import Button from "../components/ui/Button";
import { 
  getCachedWalletConnection, 
  setWalletConnectionCache, 
  clearWalletCache, 
  needsRevalidation,
  getCacheAge 
} from "../lib/walletCache";

export default function WalletCacheTest() {
  const [cacheInfo, setCacheInfo] = useState(getCachedWalletConnection());
  const [cacheAge, setCacheAge] = useState(getCacheAge());

  const refreshCacheInfo = () => {
    setCacheInfo(getCachedWalletConnection());
    setCacheAge(getCacheAge());
  };

  const testSetCache = () => {
    setWalletConnectionCache(
      "GBBMNK5DC3K5M6S5HXUC7N4JUSMZJZFNQZU6LXNNYARF4B5KE5ZG4L6U",
      "freighter",
      true,
      "Testnet"
    );
    refreshCacheInfo();
  };

  const testClearCache = () => {
    clearWalletCache();
    refreshCacheInfo();
  };

  const testExpiredCache = () => {
    // Set a cache with old timestamp to test expiration
    const oldCache = {
      walletAddress: "GBBMNK5DC3K5M6S5HXUC7N4JUSMZJZFNQZU6LXNNYARF4B5KE5ZG4L6U",
      walletType: "freighter",
      isConnected: true,
      network: "Testnet",
      timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      version: 1,
    };
    localStorage.setItem('tradeflow_wallet_connection', JSON.stringify(oldCache));
    refreshCacheInfo();
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Wallet Cache Test</h2>
      
      {/* Current Cache Status */}
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Current Cache Status</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Is Cached:</span>
            <span className={`ml-2 font-medium ${cacheInfo.isCached ? 'text-green-400' : 'text-red-400'}`}>
              {cacheInfo.isCached ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Is Connected:</span>
            <span className={`ml-2 font-medium ${cacheInfo.isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {cacheInfo.isConnected ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Needs Revalidation:</span>
            <span className={`ml-2 font-medium ${needsRevalidation() ? 'text-yellow-400' : 'text-green-400'}`}>
              {needsRevalidation() ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div>
            <span className="text-slate-400">Cache Age:</span>
            <span className="ml-2 font-medium text-blue-400">
              {Math.round(cacheAge / 1000)}s
            </span>
          </div>
        </div>

        {cacheInfo.isCached && (
          <div className="mt-4 p-4 bg-slate-700 rounded text-sm">
            <div className="space-y-2">
              <div><span className="text-slate-400">Address:</span> <span className="text-white font-mono ml-2">{cacheInfo.walletAddress}</span></div>
              <div><span className="text-slate-400">Wallet Type:</span> <span className="text-white ml-2">{cacheInfo.walletType}</span></div>
              <div><span className="text-slate-400">Network:</span> <span className="text-white ml-2">{cacheInfo.network}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Test Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Test Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={testSetCache} className="bg-blue-600 hover:bg-blue-700">
            Set Valid Cache
          </Button>
          
          <Button onClick={testExpiredCache} className="bg-yellow-600 hover:bg-yellow-700">
            Set Expired Cache
          </Button>
          
          <Button onClick={testClearCache} className="bg-red-600 hover:bg-red-700">
            Clear Cache
          </Button>
          
          <Button onClick={refreshCacheInfo} className="bg-green-600 hover:bg-green-700">
            Refresh Info
          </Button>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Instructions</h3>
        <ol className="text-slate-300 space-y-2 list-decimal list-inside">
          <li>Click "Set Valid Cache" to create a fresh cache entry</li>
          <li>Click "Set Expired Cache" to create an expired cache (tests expiration logic)</li>
          <li>Click "Clear Cache" to remove all cached data</li>
          <li>Click "Refresh Info" to update the displayed cache information</li>
          <li>Refresh the page to test synchronous cache reading</li>
          <li>Check that cache age updates and revalidation status changes</li>
        </ol>
        
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Expected Behavior:</strong> Cache should persist across page refreshes, 
            expire after 5 minutes, and need revalidation after 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
