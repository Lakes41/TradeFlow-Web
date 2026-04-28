"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Card from "./Card";
import Button from "./ui/Button";
import { signTransaction } from "../lib/stellar";
import { useSigningActions, useIsSigning } from "../stores/signatureStore";
import Icon from "./ui/Icon";

interface TransactionSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signedXDR: string) => void;
  transactionXDR: string;
  networkFee: string;
  contractAddress: string;
}

type SignatureState = "broadcasting" | "success" | "error";

export default function TransactionSignatureModal({
  isOpen,
  onClose,
  onSuccess,
  transactionXDR,
  networkFee,
  contractAddress,
}: TransactionSignatureModalProps) {
  const [signatureState, setSignatureState] = useState<SignatureState>("broadcasting");
  const [error, setError] = useState<string>("");
  const isSigning = useIsSigning();
  const { startSigning, stopSigning, setTransactionDetails } = useSigningActions();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSignatureState("broadcasting");
      setError("");
      
      // Set transaction details for the global overlay
      setTransactionDetails({
        networkFee,
        contractAddress,
      });
      
      // Auto-start the signing process
      handleSignTransaction();
    }
  }, [isOpen, transactionXDR, networkFee, contractAddress, setTransactionDetails]);

  const handleSignTransaction = async () => {
    try {
      // Start global signing state (this will show the overlay)
      startSigning('Please sign the transaction in your wallet.', {
        networkFee,
        contractAddress,
      });
      
      // Use the unified signTransaction function that works with all wallets
      const signedXDR = await signTransaction(transactionXDR);
      
      if (!signedXDR) {
        throw new Error("Failed to get signature from wallet");
      }

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

  // Don't show modal while global overlay is active
  if (!isOpen || isSigning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 relative">
        {/* Close button - only show in error state */}
        {signatureState === "error" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <Icon icon={X} />
          </button>
        )}

        <div className="text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
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
            {signatureState === "broadcasting" && "Broadcasting to Network"}
            {signatureState === "success" && "Transaction Successful!"}
            {signatureState === "error" && "Transaction Failed"}
          </h3>

          {/* Description */}
          <p className="text-slate-400 mb-6">
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


// Inconsequential change for repo health
