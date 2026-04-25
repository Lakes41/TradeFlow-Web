"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Icon from './ui/Icon';

export default function NewsBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="text-sm font-medium">
            TradeFlow Mainnet Beta is now live! 🚀
          </span>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Close banner"
      >
        <Icon icon={X} dense />
      </button>
    </div>
  );
}
