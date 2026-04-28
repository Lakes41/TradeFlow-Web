"use client";

import React, { useState } from "react";
import { Droplets, TrendingUp, Info } from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { formatCurrency } from "../../lib/format";
import Footer from "../../components/layout/Footer";

// Mock data for pools
const MOCK_POOLS = [
  { id: 1, name: "XLM / USDC", liquidity: 500000, volume24h: 12000, apr: 5.2 },
  { id: 2, name: "USDC / EURT", liquidity: 250000, volume24h: 8000, apr: 4.8 },
  { id: 3, name: "XLM / EURT", liquidity: 150000, volume24h: 3000, apr: 6.1 },
  { id: 4, name: "USDC / AQUA", liquidity: 100000, volume24h: 5000, apr: 12.4 },
  { id: 5, name: "XLM / AQUA", liquidity: 80000, volume24h: 2000, apr: 15.0 },
  { id: 6, name: "USDC / yUSDC", liquidity: 1200000, volume24h: 45000, apr: 3.2 },
  { id: 7, name: "XLM / yXLM", liquidity: 900000, volume24h: 32000, apr: 3.5 },
];

export default function PoolsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Mocking total pages

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight">
          Liquidity <span className="text-blue-400">Pools</span>
        </h1>
        <p className="text-slate-400 mt-2">Provide liquidity and earn protocol fees.</p>
      </div>

      <main className="flex-1 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <Droplets className="text-blue-400 mb-4" />
            <h3 className="text-slate-400 text-sm">Total Value Locked</h3>
            <p className="text-2xl font-semibold">$3,150,000</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <TrendingUp className="text-green-400 mb-4" />
            <h3 className="text-slate-400 text-sm">24h Volume</h3>
            <p className="text-2xl font-semibold">$107,200</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <Info className="text-purple-400 mb-4" />
            <h3 className="text-slate-400 text-sm">Average APR</h3>
            <p className="text-2xl font-semibold">7.2%</p>
          </div>
        </div>

        {/* Pools Table */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">All Pools</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Pool Name</th>
                  <th className="px-6 py-4 font-semibold">Liquidity</th>
                  <th className="px-6 py-4 font-semibold">Volume (24h)</th>
                  <th className="px-6 py-4 font-semibold">APR</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {MOCK_POOLS.map((pool) => (
                  <tr key={pool.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                        {pool.name}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-300">
                      {formatCurrency(pool.liquidity)}
                    </td>
                    <td className="px-6 py-5 text-slate-300">
                      {formatCurrency(pool.volume24h)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 font-bold text-sm">
                        {pool.apr}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="bg-slate-700 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-all">
                        Deposit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Component (Issue #77) */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Inconsequential change for repo health
