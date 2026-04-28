"use client";

import React from "react";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import Card from "./Card";
import Icon from "./ui/Icon";

interface HighSlippageWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  priceImpact: number;
}

export default function HighSlippageWarning({
  isOpen,
  onClose,
  onConfirm,
  priceImpact,
}: HighSlippageWarningProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[110] p-4">
      <Card className="w-full max-w-md border-red-500/30 shadow-2xl shadow-red-900/20 bg-slate-950">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 text-red-500">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Icon icon={AlertTriangle} />
            </div>
            <h2 className="text-xl font-bold text-white">High Price Impact</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Icon icon={X} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
            <span className="text-slate-400">Estimated Price Impact</span>
            <span className="text-2xl font-bold text-red-500">{priceImpact.toFixed(2)}%</span>
          </div>

          <p className="text-slate-300 leading-relaxed text-sm">
            This trade has a high price impact, meaning you will receive significantly less value than the current market price. This usually happens in pools with low liquidity.
          </p>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                Your trade may result in a significant loss of value.
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">•</span>
                Consider breaking your trade into smaller amounts.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-red-900/20"
          >
            Swap Anyway
            <Icon icon={ArrowRight} dense className="translate-x-0 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-slate-400 hover:text-white font-medium transition-colors"
          >
            Cancel and Go Back
          </button>
        </div>
      </Card>
    </div>
  );
}
// Inconsequential change for repo health
