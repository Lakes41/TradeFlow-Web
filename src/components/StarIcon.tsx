"use client";

import React from 'react';
import { Star } from 'lucide-react';
import Icon from './ui/Icon';

interface StarIconProps {
  isStarred: boolean;
  onClick: () => void;
  size?: number;
  className?: string;
}

export default function StarIcon({ isStarred, onClick, size = 16, className = '' }: StarIconProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-full transition-all duration-200 hover:bg-tradeflow-muted/30 ${className}`}
      aria-label={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Icon
        icon={Star}
        size={size}
        className={`transition-colors duration-200 ${
          isStarred
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-tradeflow-muted hover:text-yellow-400/70'
        }`}
      />
    </button>
  );
}
