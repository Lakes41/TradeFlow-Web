"use client";

import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { useNetworkDetection } from "../hooks/useNetworkDetection";

export function NetworkMismatchWarning() {
  const {
    isMismatched,
    expectedNetwork,
    currentWalletNetwork,
    walletType,
    showWarning,
    dismissWarning,
    recheckNetwork,
  } = useNetworkDetection();

  if (!showWarning || !isMismatched) {
    return null;
  }

  const getWalletName = (type: string) => {
    switch (type) {
      case "freighter":
        return "Freighter";
      case "xbull":
        return "xBull";
      case "albedo":
        return "Albedo";
      default:
        return "Wallet";
    }
  };

  const getNetworkInstructions = (walletType: string, targetNetwork: string) => {
    const walletName = getWalletName(walletType);
    
    if (walletType === "freighter") {
      return `1. Click on the ${walletName} extension icon\n2. Go to Settings\n3. Switch to ${targetNetwork} network\n4. Refresh this page`;
    } else {
      return `Please switch to ${targetNetwork} network in your ${walletName} wallet settings`;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <span className="font-semibold">Network Mismatch Detected!</span>
              <div className="mt-1">
                Your {getWalletName(walletType || "")} wallet is on{" "}
                <span className="font-mono bg-red-100 px-1 rounded">
                  {currentWalletNetwork}
                </span>{" "}
                but TradeFlow is configured for{" "}
                <span className="font-mono bg-green-100 px-1 rounded">
                  {expectedNetwork}
                </span>
                .
              </div>
              <div className="mt-2 text-xs text-red-700 whitespace-pre-line">
                {getNetworkInstructions(walletType || "", expectedNetwork)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={recheckNetwork}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Recheck
            </button>
            <button
              onClick={dismissWarning}
              className="inline-flex items-center p-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
