"use client";

import React, { useState, useEffect } from "react";
import { checkConnection, getPublicKey } from "@stellar/freighter-api";
import { Wallet, PlusCircle, ShieldCheck, Landmark } from "lucide-react";
import LoanTable from "../components/LoanTable";
import SkeletonRow from "../components/SkeletonRow";
import useTransactionToast from "../lib/useTransactionToast";
import { formatCurrency, formatDate } from "../lib/format";

export default function Page() {
  const [address, setAddress] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Connect Stellar Wallet (Freighter)
  const connectWallet = async () => {
    if (await checkConnection()) {
      const publicKey = await getPublicKey();
      setAddress(publicKey);
    } else {
      alert("Please install Freighter Wallet");
    }
  };

  // 2. Fetch Invoices from your Repo 2 API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (e) {
      console.error("API not running");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);
  const handleTestToast = () => {
    useTransactionToast().loading();
    useTransactionToast().success();
    useTransactionToast().error();
  };

  const handleInvoiceMint = (data: any) => {
    console.log("Invoice data received:", data);
    setShowMintForm(false);
    // TODO: Chain integration will be handled separately
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-12">
          <h1 className="text-3xl font-bold tracking-tight">
            TradeFlow <span className="text-blue-400">RWA</span>
          </h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white font-medium hover:text-blue-400 transition-colors">Dashboard</a>
            <a href="/swap" className="text-slate-400 font-medium hover:text-white transition-colors">Swap</a>
            <a href="/pools" className="text-slate-400 font-medium hover:text-white transition-colors">Pools</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition shadow-lg shadow-blue-900/20"
          >
            <Wallet size={18} />
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <ShieldCheck className="text-green-400 mb-4" />
            <h3 className="text-slate-400 text-sm">Risk Engine Status</h3>
            <p className="text-2xl font-semibold text-green-400">Active (Mock)</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <Landmark className="text-blue-400 mb-4" />
            <h3 className="text-slate-400 text-sm">Protocol Liquidity</h3>
            <p className="text-2xl font-semibold">$1,250,000 USDC</p>
          </div>
          <button
            onClick={() => setShowMintForm(true)}
            className="bg-blue-600/10 border-2 border-dashed border-blue-500/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-blue-600/20 transition"
          >
            <PlusCircle className="text-blue-400 mb-2" size={32} />
            <span className="font-medium text-blue-400">
              Mint New Invoice NFT
            </span>
          </button>
        </div>

        {/* Invoice Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-12">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Verified Asset Pipeline</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Show 5 skeleton rows while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))
              ) : (
                invoices.map((inv: any) => (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                  >
                    <td className="p-4 font-mono text-sm text-blue-300">
                      #{inv.id.slice(-6)}
                    </td>
                    <td className="p-4">
                      <div className="w-full bg-slate-700 h-2 rounded-full max-w-[100px]">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${inv.riskScore}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium">
                      <span
                        className={`px-3 py-1 rounded-full ${inv.status === "Approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-lg">${inv.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Active Loans Table (Issue #6) */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Active Loans Dashboard</h2>
          </div>
          <div className="p-6 bg-slate-900/50">
            <LoanTable />
          </div>
        </div>
      </div>

      <Footer />

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <button
        onClick={handleTestToast}
        className="fixed bottom-5 right-5 bg-red-500 px-4 py-2 capitalize rounded-md"
      >
        Test toast
      </button>

      {/* Invoice Mint Form Modal */}
      {showMintForm && (
        <InvoiceMintForm
          onClose={() => setShowMintForm(false)}
          onSubmit={handleInvoiceMint}
        />
      )}
    </div>
  );
}
