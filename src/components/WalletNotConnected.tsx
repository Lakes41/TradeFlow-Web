"use client";

import React from "react";
import { WalletIcon } from "./icons";

interface WalletNotConnectedProps {
  onConnect?: () => void;
}

export default function WalletNotConnected({
  onConnect,
}: WalletNotConnectedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Wallet SVG Icon with glow */}
      <div className="relative mb-8">
        {/* Glow layer */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-blue-500 scale-125"
          aria-hidden="true"
        />
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
          <WalletIcon className="w-14 h-14" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
        Connect your wallet to start trading
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-white/50 max-w-xs mb-8 leading-relaxed">
        Your portfolio and swap data will appear here once your wallet is
        connected.
      </p>

      {/* Primary Connect Button */}
      <button
        onClick={onConnect}
        className="
          inline-flex items-center gap-2.5
          px-6 py-3
          rounded-xl
          bg-blue-600 hover:bg-blue-500
          text-white font-semibold text-sm
          shadow-lg shadow-blue-500/20
          transition-all duration-200
          hover:shadow-blue-500/40 hover:scale-[1.03]
          active:scale-[0.98]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400
        "
        type="button"
        aria-label="Connect wallet"
      >
        {/* Plug icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.5 1a.75.75 0 0 1 .75.75V4h.25a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.25v.25a4.75 4.75 0 0 1-4.462 4.733l-.038.003V17h1a.75.75 0 0 1 0 1.5H8.25a.75.75 0 0 1 0-1.5h1v-2.014a4.75 4.75 0 0 1-4.5-4.736V10h-.25a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h.25V1.75a.75.75 0 0 1 1.5 0V4h5.5V1.75A.75.75 0 0 1 14.5 1ZM6 5.5h8A.5.5 0 0 1 14.5 6v4a3.25 3.25 0 0 1-6.5 0V6A.5.5 0 0 1 6 5.5Z"
            clipRule="evenodd"
          />
        </svg>
        Connect Wallet
      </button>
    </div>
  );
}