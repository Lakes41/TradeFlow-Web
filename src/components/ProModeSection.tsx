"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Toggle from "../app/Toggle";
import { useTokenStore } from "../stores/tokenStore";
import PremiumUnlockModal from "./PremiumUnlockModal";

// Dynamically import the heavy chart component with loading fallback
const LivePriceChart = dynamic(() => import("../components/LivePriceChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-slate-400 text-sm">Loading Pro Chart...</p>
      </div>
    </div>
  ),
});

export default function ProModeSection() {
  const [isProMode, setIsProMode] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const { tfTokenBalance, isConnected, hasProModeAccess } = useTokenStore();

  const handleProModeToggle = () => {
    // If trying to enable pro mode
    if (!isProMode) {
      if (!isConnected) {
        // User is not connected to wallet
        alert('Please connect your wallet to enable Pro Mode');
        return;
      }
      
      if (!hasProModeAccess()) {
        // User doesn't have enough TF tokens - show paywall
        setShowPaywall(true);
        return;
      }
    }
    
    // Allow toggle (either disabling pro mode or user has access)
    setIsProMode(!isProMode);
  };

  return (
    <>
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Pro Mode Charts</h3>
            <p className="text-sm text-slate-400">
              Enable advanced TradingView-style charts with live data.
              {!isConnected && " (Connect wallet to enable)"}
              {isConnected && !hasProModeAccess() && " (Requires 1,000+ TF tokens)"}
            </p>
          </div>
          <Toggle 
            isOn={isProMode} 
            onToggle={handleProModeToggle}
            disabled={!isConnected || (!hasProModeAccess() && !isProMode)}
          />
        </div>

        {isProMode && (
          <div className="mt-6">
            <LivePriceChart />
          </div>
        )}
      </div>

      <PremiumUnlockModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        currentBalance={tfTokenBalance}
      />
    </>
  );
}
