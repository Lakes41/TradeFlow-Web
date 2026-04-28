"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change24h: number;
  icon: string;
}

const dummyAssets: Asset[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "12,450.00",
    value: "$12,450.00",
    change24h: 0.1,
    icon: "💵"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "2.85",
    value: "$8,550.00",
    change24h: 3.2,
    icon: "🔷"
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: "0.125",
    value: "$5,375.00",
    change24h: -1.8,
    icon: "🟠"
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: "150.00",
    value: "$13,500.00",
    change24h: 5.7,
    icon: "🟣"
  },
  {
    symbol: "XLM",
    name: "Stellar",
    balance: "5,000.00",
    value: "$1,250.00",
    change24h: 2.1,
    icon: "⭐"
  }
];

export default function AssetsList() {
  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Assets</h2>
        <span className="text-sm text-tradeflow-muted">5 tokens</span>
      </div>
      
      <div className="space-y-4">
        {dummyAssets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between p-4 bg-tradeflow-dark rounded-xl border border-tradeflow-muted/50 hover:border-tradeflow-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{asset.icon}</div>
              <div>
                <div className="font-semibold text-white">{asset.symbol}</div>
                <div className="text-sm text-tradeflow-muted">{asset.name}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-white">{asset.balance}</div>
              <div className="text-sm text-tradeflow-muted">{asset.value}</div>
            </div>
            
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              asset.change24h >= 0 
                ? 'bg-green-400/20 text-green-400' 
                : 'bg-red-400/20 text-red-400'
            }`}>
              {asset.change24h >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(asset.change24h)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-tradeflow-muted">
        <div className="flex items-center justify-between">
          <span className="text-tradeflow-muted">Total Value</span>
          <span className="text-xl font-bold text-white">$41,125.00</span>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
