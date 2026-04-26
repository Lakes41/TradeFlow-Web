"use client";

import React from 'react';
import { Wallet } from 'lucide-react';
import { WalletType } from '../lib/stellar';
import Icon from './ui/Icon';

interface EmptyStateProps {
  onConnectWallet: () => void;
}

export default function EmptyState({ onConnectWallet }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Large Wallet Icon */}
      <div className="mb-8 p-6 bg-blue-600/10 rounded-full border-2 border-blue-500/30">
        <Icon icon={Wallet} size={64} className="text-blue-400" />
      </div>

      {/* Main Text */}
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
        Connect Your Wallet
      </h2>
      
      <p className="text-slate-400 text-lg max-w-md mb-8 leading-relaxed">
        Please connect your wallet to view your invoices and access the TradeFlow RWA platform. 
        We support Freighter, Albedo, and xBull wallets.
      </p>

      {/* Connect Wallet Button */}
      <button
        onClick={onConnectWallet}
        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <Icon icon={Wallet} />
        Connect Wallet
      </button>

      {/* Additional Info */}
      <div className="mt-8 text-sm text-slate-500">
        <p>Supporting multiple Stellar wallets for your convenience</p>
      </div>
    </div>
  );
}
