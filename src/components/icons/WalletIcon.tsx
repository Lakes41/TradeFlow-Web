import React from "react";

interface WalletIconProps {
  className?: string;
}

export default function WalletIcon({ className = "" }: WalletIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Wallet body */}
      <rect
        x="4"
        y="16"
        width="56"
        height="36"
        rx="6"
        stroke="#60a5fa"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Wallet flap */}
      <path
        d="M4 26h56"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Card slot */}
      <path
        d="M8 16v-3a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v3"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Coin pocket */}
      <rect
        x="40"
        y="31"
        width="14"
        height="10"
        rx="5"
        fill="#60a5fa"
        fillOpacity="0.15"
        stroke="#60a5fa"
        strokeWidth="2"
      />
      {/* Coin dot */}
      <circle cx="47" cy="36" r="2" fill="#93c5fd" />
    </svg>
  );
}
