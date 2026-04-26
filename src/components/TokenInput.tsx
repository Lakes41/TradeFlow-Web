"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './ui/Icon';

interface TokenInputProps {
  label: string;
  value: string;
  tokenSymbol: string;
  onSelectClick: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({ label, value, tokenSymbol, onSelectClick }) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 border border-transparent focus-within:border-blue-500/30 transition-all">
      <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wider">{label}</label>
      <div className="flex items-center justify-between gap-4">
        <input
          type="number"
          value={value}
          placeholder="0.00"
          className="w-full bg-transparent text-3xl font-semibold outline-none text-gray-900"
        />
        {/* Token Selection Button - min-h-[44px] for mobile tap targets (#103) */}
        <button
          onClick={onSelectClick}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 py-1 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors active:scale-95"
        >
          <span className="font-bold text-gray-900">{tokenSymbol}</span>
          <Icon icon={ChevronDown} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};