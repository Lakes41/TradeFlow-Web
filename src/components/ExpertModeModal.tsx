"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import Card from "./Card";
import Icon from "./ui/Icon";

interface ExpertModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExpertModeModal({
  isOpen,
  onClose,
  onConfirm,
}: ExpertModeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md border-orange-500/30 shadow-2xl shadow-orange-900/20">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 text-orange-500">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Icon icon={AlertCircle} />
            </div>
            <h2 className="text-xl font-bold text-white">Expert Mode</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Icon icon={X} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-slate-300 leading-relaxed">
            Expert mode allows for high slippage trades and removes the confirmation tooltips. These features are intended for advanced users.
          </p>
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
            <p className="text-sm text-orange-400 font-medium">
              ⚠️ Warning: You could lose a significant portion of your funds due to unfavorable price changes if you are not careful.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-900/30"
          >
            I understand the risk
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-slate-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
}