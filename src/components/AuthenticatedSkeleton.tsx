"use client";

import React from "react";
import { ChevronDownIcon } from "./icons";
import { Wallet, Loader2 } from "lucide-react";

interface AuthenticatedSkeletonProps {
  walletAddress?: string;
  walletType?: string;
  isRevalidating?: boolean;
}

export default function AuthenticatedSkeleton({ 
  walletAddress, 
  walletType, 
  isRevalidating = false 
}: AuthenticatedSkeletonProps) {
  // Truncate address for display
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "...";

  return (
    <div className="flex items-center gap-3 animate-pulse">
      {/* Wallet Icon */}
      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
        <Wallet className="w-4 h-4 text-blue-400" />
      </div>
      
      {/* Wallet Address */}
      <div className="flex items-center gap-2">
        <span className="text-white font-medium">{displayAddress}</span>
        {walletType && (
          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            {walletType}
          </span>
        )}
        {isRevalidating && (
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
            <span className="text-xs text-blue-400">Validating...</span>
          </div>
        )}
      </div>
      
      {/* Dropdown Arrow */}
      <div className="w-4 h-4 text-slate-400">
        <ChevronDownIcon />
      </div>
    </div>
  );
}

// Inconsequential change for repo health
