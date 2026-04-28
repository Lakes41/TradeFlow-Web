"use client";

import React from "react";
import { Droplets, TrendingUp, TrendingDown } from "lucide-react";

interface LiquidityPosition {
  poolName: string;
  token1: {
    symbol: string;
    icon: string;
  };
  token2: {
    symbol: string;
    icon: string;
  };
  share: string;
  value: string;
  apr: number;
  fees24h: string;
}

const dummyLiquidityPositions: LiquidityPosition[] = [
  {
    poolName: "USDC/ETH",
    token1: { symbol: "USDC", icon: "💵" },
    token2: { symbol: "ETH", icon: "🔷" },
    share: "15.2%",
    value: "$8,450.00",
    apr: 12.5,
    fees24h: "$12.50"
  },
  {
    poolName: "SOL/USDC",
    token1: { symbol: "SOL", icon: "🟣" },
    token2: { symbol: "USDC", icon: "💵" },
    share: "8.7%",
    value: "$6,200.00",
    apr: 18.3,
    fees24h: "$8.75"
  },
  {
    poolName: "BTC/ETH",
    token1: { symbol: "BTC", icon: "🟠" },
    token2: { symbol: "ETH", icon: "🔷" },
    share: "3.4%",
    value: "$4,125.00",
    apr: 8.9,
    fees24h: "$5.20"
  },
  {
    poolName: "XLM/USDC",
    token1: { symbol: "XLM", icon: "⭐" },
    token2: { symbol: "USDC", icon: "💵" },
    share: "22.1%",
    value: "$2,850.00",
    apr: 15.7,
    fees24h: "$3.15"
  }
];

export default function LiquidityList() {
  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          Your Liquidity
        </h2>
        <span className="text-sm text-tradeflow-muted">4 positions</span>
      </div>
      
      <div className="space-y-4">
        {dummyLiquidityPositions.map((position, index) => (
          <div
            key={index}
            className="p-4 bg-tradeflow-dark rounded-xl border border-tradeflow-muted/50 hover:border-tradeflow-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{position.token1.icon}</span>
                <span className="text-lg">{position.token2.icon}</span>
                <span className="font-semibold text-white">{position.poolName}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">{position.value}</div>
                <div className="text-sm text-tradeflow-muted">{position.share} share</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-tradeflow-muted">APR</span>
                <span className="text-sm font-medium text-green-400">{position.apr}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tradeflow-muted">24h Fees</span>
                <span className="text-sm font-medium text-blue-400">{position.fees24h}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-tradeflow-muted">
        <div className="flex items-center justify-between mb-2">
          <span className="text-tradeflow-muted">Total Liquidity Value</span>
          <span className="text-xl font-bold text-white">$21,625.00</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-tradeflow-muted">Average APR</span>
          <span className="text-sm font-medium text-green-400">13.9%</span>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
