"use client";

import React from "react";
import { Loader2, Wallet, X } from "lucide-react";
import { useIsSigning, useSigningMessage, useTransactionDetails, useSigningActions } from "../stores/signatureStore";
import Icon from "./ui/Icon";

export default function SignatureOverlay() {
  const isSigning = useIsSigning();
  const signingMessage = useSigningMessage();
  const transactionDetails = useTransactionDetails();
  const { stopSigning } = useSigningActions();

  // Don't render if not signing
  if (!isSigning) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button for emergency cancel */}
        <button
          onClick={stopSigning}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
          title="Cancel signing"
        >
          <Icon icon={X} />
        </button>

        <div className="text-center space-y-6">
          {/* Animated Wallet Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-blue-500/30 rounded-full animate-ping" />
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-spin" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              Waiting for Signature
            </h2>
            <p className="text-slate-300 text-lg">
              {signingMessage}
            </p>
          </div>

          {/* Transaction Details */}
          {transactionDetails && (
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700/50">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Transaction Details</h3>
              
              {transactionDetails.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-white font-medium">
                    {transactionDetails.amount} {transactionDetails.fromToken || ''}
                  </span>
                </div>
              )}
              
              {transactionDetails.fromToken && transactionDetails.toToken && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Swap:</span>
                  <span className="text-white font-medium">
                    {transactionDetails.fromToken} → {transactionDetails.toToken}
                  </span>
                </div>
              )}
              
              {transactionDetails.networkFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network Fee:</span>
                  <span className="text-white font-medium">{transactionDetails.networkFee} XLM</span>
                </div>
              )}
              
              {transactionDetails.contractAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Contract:</span>
                  <span className="text-white font-mono text-xs">
                    {transactionDetails.contractAddress.slice(0, 8)}...{transactionDetails.contractAddress.slice(-8)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
              </div>
              <div className="text-left">
                <p className="text-sm text-blue-300 font-medium mb-1">
                  Check Your Wallet
                </p>
                <p className="text-xs text-blue-200/80">
                  Open your wallet extension or app to review and sign the transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Prevent interaction notice */}
          <div className="text-xs text-slate-500">
            Please wait... The UI is temporarily disabled to prevent duplicate transactions.
          </div>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
