"use client";

import React from 'react';
import StickyHeader from '../../../components/StickyHeader';
import { ArrowLeft, ExternalLink, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans">
      {/* Sticky Header */}
      <StickyHeader 
        title="INV-123"
        subtitle="Real World Asset token details and performance metrics"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <ExternalLink size={16} />
              Trade
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Overview */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Invoice ID</p>
                  <p className="font-mono text-blue-300">INV-00123</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Token ID</p>
                  <p className="font-mono text-green-300">TKN-0x1234...5678</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Principal Amount</p>
                  <p className="text-xl font-bold">$50,000</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Interest Rate</p>
                  <p className="text-xl font-bold">8.5% APR</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Maturity Date</p>
                  <p className="font-medium">Dec 15, 2024</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Performance</h2>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp size={20} />
                  <span className="font-medium">+12.5%</span>
                </div>
              </div>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Chart visualization would go here</p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              <div className="space-y-3">
                {[
                  { date: '2024-01-15', type: 'Payment', amount: '$2,125', status: 'Completed' },
                  { date: '2024-01-01', type: 'Payment', amount: '$2,125', status: 'Completed' },
                  { date: '2023-12-15', type: 'Initial', amount: '$50,000', status: 'Completed' },
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-slate-400 text-sm">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount}</p>
                      <p className="text-green-400 text-sm">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-blue-400" size={20} />
                <h2 className="text-xl font-semibold">Risk Assessment</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Credit Score</span>
                    <span className="text-sm font-medium">A+</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Collateral Ratio</span>
                    <span className="text-sm font-medium">150%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Liquidity Score</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Buy More Tokens
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  View Documents
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
