"use client";

import React from "react";
import { FREIGHTER_ID, XBULL_ID, ALBEDO_ID, WalletType } from "../lib/stellar";
import { getWalletDisplayName, getWalletDescription, getWalletIcon, getWalletBgColor } from "../lib/walletConnector";
import { CloseIcon } from "./icons";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (walletType: WalletType) => void;
}

interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
}

const walletOptions: WalletOption[] = [
  {
    id: FREIGHTER_ID,
    name: getWalletDisplayName(FREIGHTER_ID),
    description: getWalletDescription(FREIGHTER_ID),
    icon: getWalletIcon(FREIGHTER_ID),
    bgColor: getWalletBgColor(FREIGHTER_ID)
  },
  {
    id: XBULL_ID,
    name: getWalletDisplayName(XBULL_ID),
    description: getWalletDescription(XBULL_ID),
    icon: getWalletIcon(XBULL_ID),
    bgColor: getWalletBgColor(XBULL_ID)
  },
  {
    id: ALBEDO_ID,
    name: getWalletDisplayName(ALBEDO_ID),
    description: getWalletDescription(ALBEDO_ID),
    icon: getWalletIcon(ALBEDO_ID),
    bgColor: getWalletBgColor(ALBEDO_ID)
  }
];

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null;

  const handleWalletSelect = (walletType: WalletType) => {
    if (onConnect) onConnect(walletType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 flex items-center gap-3 transition-colors"
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <div className={`w-10 h-10 ${wallet.bgColor} rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d={wallet.icon}/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-white">{wallet.name}</div>
                <div className="text-sm text-slate-400">{wallet.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
          <p className="text-sm text-slate-400">
            By connecting a wallet, you agree to the Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
