"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Card from "./Card";
import Button from "./ui/Button";
import { signTransaction } from "../lib/stellar";

interface TransactionSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signedXDR: string) => void;
  transactionXDR: string;
  networkFee: string;
  contractAddress: string;
}

type SignatureState = "waiting" | "broadcasting" | "success" | "error";

export default function TransactionSignatureModal({
  isOpen,
  onClose,
  onSuccess,
  transactionXDR,
  networkFee,
  contractAddress,
}: TransactionSignatureModalProps) {
  const [signatureState, setSignatureState] = useState<SignatureState>("waiting");
  const [error, setError] = useState<string>("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSignatureState("waiting");
      setError("");
      // Auto-start the signing process
      handleSignTransaction();
    }
  }, [isOpen, transactionXDR]);

  const handleSignTransaction = async () => {
    try {
      setSignatureState("waiting");
      
      // Use the unified signTransaction function that works with all wallets
      const signedXDR = await signTransaction(transactionXDR);
      
      if (!signedXDR) {
        throw new Error("Failed to get signature from wallet");
      }

      setSignatureState("broadcasting");
      
      // Simulate broadcasting to network
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSignatureState("success");
      onSuccess(signedXDR);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error("Transaction signing error:", err);
      
      // Handle specific user rejection
      if (err.message?.includes("User rejected") || err.message?.includes("declined") || err.message?.includes("cancelled")) {
        setError("Transaction cancelled by user");
      } else if (err.message?.includes("wallet")) {
        setError("Wallet error: " + err.message);
      } else {
        setError("Transaction failed: " + (err.message || "Unknown error"));
      }
      
      setSignatureState("error");
    }
  };

  const handleRetry = () => {
    setError("");
    handleSignTransaction();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 relative">
        {/* Close button - only show in error state */}
        {signatureState === "error" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {signatureState === "waiting" && (
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            )}
            {signatureState === "broadcasting" && (
              <div className="relative">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 bg-green-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            )}
            {signatureState === "success" && (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
            {signatureState === "error" && (
              <AlertCircle className="w-12 h-12 text-red-500" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-2">
            {signatureState === "waiting" && "Waiting for Wallet Signature..."}
            {signatureState === "broadcasting" && "Broadcasting to Network"}
            {signatureState === "success" && "Transaction Successful!"}
            {signatureState === "error" && "Transaction Failed"}
          </h3>

          {/* Description */}
          <p className="text-slate-400 mb-6">
            {signatureState === "waiting" && 
              "Please approve the transaction in your wallet."
            }
            {signatureState === "broadcasting" && 
              "Your signed transaction is being broadcast to the Stellar network."
            }
            {signatureState === "success" && 
              "Your transaction has been successfully processed on the network."
            }
            {signatureState === "error" && 
              error
            }
          </p>

          {/* Transaction Details */}
          {signatureState !== "error" && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Fee:</span>
                  <span className="text-white font-medium">{networkFee} XLM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract:</span>
                  <span className="text-white font-mono text-xs">
                    {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {signatureState === "error" && (
              <>
                <Button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Close
                </Button>
              </>
            )}
            
            {signatureState === "waiting" && (
              <Button
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                disabled
              >
                Waiting for Signature...
              </Button>
            )}
            
            {signatureState === "broadcasting" && (
              <Button
                className="w-full bg-green-600 text-white"
                disabled
              >
                Broadcasting...
              </Button>
            )}
            
            {signatureState === "success" && (
              <Button
                className="w-full bg-green-600 text-white"
                disabled
              >
                ✓ Complete
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

