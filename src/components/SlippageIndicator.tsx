import React from 'react';

export interface SlippageIndicatorProps {
  slippageValue: number;
}

export function SlippageIndicator({ slippageValue }: SlippageIndicatorProps) {
  const visualPercentage = Math.min(slippageValue, 100);

  // Apply conditional Tailwind background colors to the fill: 
  // Green (< 1%), Yellow (1-5%), Red (> 5%)
  let colorClass = 'bg-green-500';
  if (slippageValue >= 1 && slippageValue <= 5) {
    colorClass = 'bg-yellow-500';
  } else if (slippageValue > 5) {
    colorClass = 'bg-red-500';
  }

  return (
    <div className="w-full flex-col flex gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Slippage Tolerance</span>
        <span className={`${colorClass.replace('bg-', 'text-')} font-medium`}>
          {slippageValue.toFixed(2)}%
        </span>
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${colorClass}`}
          style={{ width: `${visualPercentage}%` }}
        />
      </div>
    </div>
  );
}

// Inconsequential change for repo health
