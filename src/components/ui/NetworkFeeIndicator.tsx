"use client";

import React, { useState, useEffect } from 'react';
import { Fuel } from 'lucide-react';
import Icon from './Icon';

interface FeeData {
  baseFee: number;
  lastUpdated: string;
}

export default function NetworkFeeIndicator() {
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkFee = async () => {
    try {
      setError(null);
      const res = await fetch('/api/v1/network/fees');

      if (!res.ok) {
        throw new Error('Failed to fetch network fees');
      }

      const data = await res.json();
      setFeeData(data);
    } catch (err) {
      console.error('Error fetching network fee:', err);
      setError('Failed to load fee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkFee();

    // Poll every 15 seconds
    const interval = setInterval(fetchNetworkFee, 15000);

    return () => clearInterval(interval);
  }, []);

  // Determine color based on fee level (in stroops)
  const getFeeColor = (baseFee: number) => {
    if (baseFee < 150) return 'text-green-400';      // Cheap
    if (baseFee < 300) return 'text-yellow-400';     // Moderate
    return 'text-red-500';                           // Expensive
  };

  const getFeeLabel = (baseFee: number) => {
    if (baseFee < 150) return 'Cheap';
    if (baseFee < 300) return 'Moderate';
    return 'Expensive';
  };

  if (loading && !feeData) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon icon={Fuel} dense />
        <span>Loading fee...</span>
      </div>
    );
  }

  if (error || !feeData) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-400">
        <Icon icon={Fuel} dense />
        <span>Fee unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group">
      <Icon 
        icon={Fuel}
        dense
        className={`transition-colors ${getFeeColor(feeData.baseFee)}`} 
      />
      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-sm font-medium transition-colors ${getFeeColor(feeData.baseFee)}`}>
          {feeData.baseFee}
        </span>
        <span className="text-[10px] text-slate-500">stroops</span>
      </div>
      
      <div className="text-[10px] text-slate-500 hidden group-hover:inline">
        {getFeeLabel(feeData.baseFee)}
      </div>
    </div>
  );
}
// Inconsequential change for repo health
