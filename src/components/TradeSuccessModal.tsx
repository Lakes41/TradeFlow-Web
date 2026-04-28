"use client";

import React from "react";
import { CheckCircle2, X, Twitter } from "lucide-react";
import Icon from "./ui/Icon";

interface TradeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
}

export default function TradeSuccessModal({ isOpen, onClose, txHash }: TradeSuccessModalProps) {
  if (!isOpen) return null;

  const shareText = encodeURIComponent(
    "Just swapped on @TradeFlowRWA! 🚀 The smoothest RWA experience on #Stellar. Check it out: https://tradeflow.finance"
  );

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <Icon icon={X} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <Icon icon={CheckCircle2} className="text-green-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Swap Successful!</h2>
        <p className="text-slate-400 mb-8">
          Your transaction has been confirmed on the Stellar network.
        </p>

        <div className="flex flex-col gap-3">
          {/* Share on X Button */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Icon icon={Twitter} fill="black" />
            Share on X
          </a>

          {/* Close/Done Button */}
          <button
            onClick={onClose}
            className="py-3 text-slate-400 hover:text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
// Inconsequential change for repo health
