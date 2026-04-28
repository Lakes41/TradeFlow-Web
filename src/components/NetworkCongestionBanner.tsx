"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { useNetworkCongestion } from "../contexts/NetworkCongestionContext";

export default function NetworkCongestionBanner() {
  const { isNetworkCongested, isDismissed, dismiss } = useNetworkCongestion();

  if (!isNetworkCongested || isDismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center py-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-sm text-yellow-200">
              <span className="font-medium">Stellar Network is currently congested.</span>{" "}
              Transactions may take longer than usual.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="ml-4 flex-shrink-0 p-1 rounded-md text-yellow-400 hover:text-yellow-200 hover:bg-yellow-500/20 transition-colors"
            aria-label="Dismiss congestion warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
