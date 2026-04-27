"use client";

import React from 'react';
import { X, Crown, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import Button from './ui/Button';
import { TF_TOKEN_INFO, PRO_MODE_THRESHOLD_AMOUNT } from '../stores/tokenStore';
import Icon from './ui/Icon';

interface PremiumUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export default function PremiumUnlockModal({ isOpen, onClose, currentBalance }: PremiumUnlockModalProps) {
  if (!isOpen) return null;

  const tokensNeeded = PRO_MODE_THRESHOLD_AMOUNT - currentBalance;
  const buyUrl = `/swap?input=USDC&output=${TF_TOKEN_INFO.code}:${TF_TOKEN_INFO.issuer}&amount=${tokensNeeded}`;

  const handleBuyTokens = () => {
    // In a real app, this would navigate to the swap interface
    // For now, we'll simulate opening the swap page
    window.location.href = buyUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-yellow-500/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors z-10"
        >
          <Icon icon={X} className="w-4 h-4 text-slate-400" />
        </button>

        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <Icon icon={Crown} className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Upgrade to Pro Mode
            </h2>
            
            <p className="text-slate-300 text-sm">
              Hold {PRO_MODE_THRESHOLD_AMOUNT}+ TF tokens to unlock advanced trading features
            </p>
          </div>

          {/* Current status */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Your TF Balance</span>
              <span className="text-white font-semibold">
                {currentBalance.toLocaleString()} TF
              </span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentBalance / PRO_MODE_THRESHOLD_AMOUNT) * 100, 100)}%` }}
              />
            </div>
            
            <p className="text-slate-400 text-xs">
              {tokensNeeded > 0 
                ? `${tokensNeeded.toLocaleString()} more TF tokens needed`
                : 'You have access to Pro Mode!'
              }
            </p>
          </div>

          {/* Pro features list */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon={Sparkles} className="w-4 h-4 text-yellow-400" />
              Pro Tier Features
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon icon={TrendingUp} className="w-3 h-3 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Live TradingView Charts</p>
                  <p className="text-slate-400 text-xs">Advanced charting with real-time data and technical indicators</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon icon={Zap} className="w-3 h-3 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Zero Routing Fees</p>
                  <p className="text-slate-400 text-xs">Enjoy fee-free trading on all swaps and transactions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon icon={Shield} className="w-3 h-3 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Priority Support</p>
                  <p className="text-slate-400 text-xs">Get exclusive access to premium customer support</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBuyTokens}
              variant="primary"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
            >
              <Icon icon={Crown} className="w-4 h-4 mr-2" />
              Buy TF Tokens
            </Button>
            
            <button
              onClick={onClose}
              className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-slate-500 text-xs text-center">
              TF tokens provide governance rights and platform utilities. 
              <br />
              Not a financial investment vehicle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
