"use client";

import React, { useState } from 'react';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { TokenInput } from './TokenInput';
import Icon from './ui/Icon';

export const SwapCard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Simulate network fetch
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg rounded-3xl bg-white p-4 shadow-xl border border-gray-100 relative">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Refresh data"
        disabled={isRefreshing}
      >
        <Icon 
          icon={RefreshCw}
          className={isRefreshing ? "animate-spin text-blue-600" : ""} 
        />
      </button>

      <div className="flex flex-col gap-1 mt-6">
        <TokenInput label="From" value="" tokenSymbol="XLM" onSelectClick={() => {}} />
...
        <div className="relative h-2 flex items-center justify-center z-10">
          {/* Swap Arrow Button - Increased padding to p-3 for mobile tap targets (#103) */}
          <button 
            className="rounded-xl border-4 border-white bg-gray-50 p-3 text-blue-600 hover:bg-blue-50 transition-all active:scale-90 shadow-sm"
            aria-label="Swap directions"
          >
            <Icon icon={ArrowDown} />
          </button>
        </div>

        <TokenInput label="To (estimated)" value="" tokenSymbol="Select token" onSelectClick={() => {}} />
      </div>
      
      <button className="mt-4 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white hover:bg-blue-700 transition-colors">
        Connect Wallet
      </button>
    </div>
  );
};
// Inconsequential change for repo health
