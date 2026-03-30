"use client";

import React from "react";
import { Plus, TrendingUp, DollarSign, Percent } from "lucide-react";
import Navbar from "../../../Navbar";
import { useWatchlist } from "../../hooks/useWatchlist";
import StarIcon from "../../components/StarIcon";
import AnimatedCounter from "../../components/AnimatedCounter";

interface LiquidityPool {
  id: string;
  pair: string;
  token1: string;
  token2: string;
  tvl: string;
  volume24h: string;
  apy: string;
}

const dummyPools: LiquidityPool[] = [
  {
    id: "1",
    pair: "XLM/USDC",
    token1: "XLM",
    token2: "USDC",
    tvl: "$2,450,000",
    volume24h: "$185,000",
    apy: "12.5%"
  },
  {
    id: "2", 
    pair: "yXLM/XLM",
    token1: "yXLM",
    token2: "XLM",
    tvl: "$1,875,000",
    volume24h: "$142,000",
    apy: "8.3%"
  },
  {
    id: "3",
    pair: "USDC/EURC",
    token1: "USDC", 
    token2: "EURC",
    tvl: "$3,200,000",
    volume24h: "$298,000",
    apy: "15.7%"
  },
  {
    id: "4",
    pair: "XLM/ETH",
    token1: "XLM",
    token2: "ETH", 
    tvl: "$980,000",
    volume24h: "$76,000",
    apy: "10.2%"
  }
];

export default function PoolsPage() {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
  const handleAddLiquidity = (pool: LiquidityPool) => {
    alert(`Add Liquidity functionality for ${pool.pair} would be implemented here. This is a mock message.`);
  };

  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      {/* Header */}
      <Navbar
        address=""
        onConnect={() => {}}
      />

      {/* Main Content */}
      <div className="flex-1 px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
          <p className="text-tradeflow-muted">
            Browse available trading pairs and provide liquidity to earn rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tradeflow-muted text-sm mb-1">Total TVL</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter end={8505000} duration={1.5} prefix="$" />
                </p>
              </div>
              <DollarSign className="text-tradeflow-accent" size={24} />
            </div>
          </div>
          
          <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tradeflow-muted text-sm mb-1">24h Volume</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter end={701000} duration={1.5} prefix="$" />
                </p>
              </div>
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
          
          <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tradeflow-muted text-sm mb-1">Avg APY</p>
                <p className="text-2xl font-bold">11.7%</p>
              </div>
              <Percent className="text-tradeflow-accent" size={24} />
            </div>
          </div>
        </div>

        {/* Pools Table */}
        <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
          <div className="p-6 border-b border-tradeflow-muted">
            <h2 className="text-xl font-semibold">Available Pools</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
                <tr>
                  <th className="p-4 text-left">Pair</th>
                  <th className="p-4 text-right">TVL</th>
                  <th className="p-4 text-right">Volume (24h)</th>
                  <th className="p-4 text-right">APY</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dummyPools.map((pool) => (
                  <tr
                    key={pool.id}
                    className="border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-tradeflow-accent rounded-full flex items-center justify-center text-xs font-bold">
                            {pool.token1.slice(0, 2)}
                          </div>
                          <div className="w-8 h-8 bg-tradeflow-success rounded-full flex items-center justify-center text-xs font-bold">
                            {pool.token2.slice(0, 2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pool.pair}</span>
                          <StarIcon
                            isStarred={isInWatchlist(pool.token1)}
                            onClick={() => toggleWatchlist(pool.token1)}
                            size={14}
                          />
                          <StarIcon
                            isStarred={isInWatchlist(pool.token2)}
                            onClick={() => toggleWatchlist(pool.token2)}
                            size={14}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">{pool.tvl}</td>
                    <td className="p-4 text-right font-medium">{pool.volume24h}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-400">
                        {pool.apy}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAddLiquidity(pool)}
                        className="inline-flex items-center px-3 py-1.5 bg-tradeflow-accent hover:bg-tradeflow-accent/80 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Liquidity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
