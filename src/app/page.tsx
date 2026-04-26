"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { connectWallet, WalletType } from "../lib/stellar";
import { PlusCircle, ShieldCheck, Landmark, Star, Wallet } from "lucide-react";
import LoanTable from "../components/LoanTable";
import SkeletonRow from "../components/SkeletonRow";
import Navbar from "../components/Navbar";
import StickyHeader from "../components/StickyHeader";
import Card from "../components/Card";
import FreighterConnectModal from "../components/FreighterConnectModal";
import InvoiceMintForm from "../components/InvoiceMintForm";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceFilter, { InvoiceFilters } from "../components/InvoiceFilter";
import NewsBanner from "../components/NewsBanner";
import useTransactionToast from "../lib/useTransactionToast";
import AddTrustlineButton from "../components/AddTrustlineButton";
import ProModeSection from "../components/ProModeSection";
import WatchlistTab from "../components/WatchlistTab";
import TabNavigation from "../components/TabNavigation";
import { useWatchlist } from "../hooks/useWatchlist";
import StarIcon from "../components/StarIcon";
import { api } from "../lib/api";
import type { InvoiceSummary } from "../../types/api";
import { RiskSocketClient } from "../lib/riskSocket";
import { useWalletConnection } from "../stores/useWeb3Store";
import { showError, showSuccess } from "../lib/toast";
import Icon from "../components/ui/Icon";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isConnected, walletAddress, isConnecting } = useWalletConnection();
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const riskSocketRef = useRef<RiskSocketClient | null>(null);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<InvoiceFilters>(() => ({
    minApy: parseFloat(searchParams.get('minApy') || '0'),
    maxApy: parseFloat(searchParams.get('maxApy') || '25'),
    tiers: searchParams.get('tiers')?.split(',').filter(Boolean) || [],
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.minApy > 0) params.set('minApy', filters.minApy.toString());
    if (filters.maxApy < 25) params.set('maxApy', filters.maxApy.toString());
    if (filters.tiers.length > 0) params.set('tiers', filters.tiers.join(','));
    
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    router.replace(newUrl);
  }, [filters, router]);

  
  // 1. Connect Stellar Wallet (supports Freighter, Albedo, xBull)
  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      const userInfo = await connectWallet(walletType);
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
        console.log("Wallet connected:", userInfo.publicKey, "Type:", userInfo.walletType);
        showSuccess("Wallet connected");
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error("Connection failed:", error.message);
      showError(error.message || "Failed to connect to wallet.");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await api.getInvoices({ signal: controller.signal });
        if (res.ok) {
          setInvoices(res.data);
        } else {
          console.error("Failed to fetch invoices:", res.error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!walletAddress) {
      riskSocketRef.current?.disconnect();
      riskSocketRef.current = null;
      return;
    }

    const socketClient = riskSocketRef.current ?? new RiskSocketClient();
    riskSocketRef.current = socketClient;
    socketClient.connect();

    const unsubscribe = socketClient.on((event) => {
      if (event.event !== "risk_update") return;
      const { invoiceId, riskScore } = event.data;

      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? { ...inv, riskScore } : inv)),
      );
    });

    return () => {
      unsubscribe();
      socketClient.disconnect();
      if (riskSocketRef.current === socketClient) {
        riskSocketRef.current = null;
      }
    };
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    if (invoices.length === 0) return;

    riskSocketRef.current?.syncInvoices(invoices.map((i) => i.id));
  }, [walletAddress, invoices]);
  const toast = useTransactionToast();

  const handleTestToast = () => {
    toast.loading();
    toast.success();
    toast.error();
  };

  const handleInvoiceMint = (data: Record<string, unknown>) => {
    console.log("Invoice data received:", data);
    setShowMintForm(false);
    // TODO: Chain integration will be handled separately
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "watchlist", label: "Watchlist", icon: <Icon icon={Star} dense /> },
  ];

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
            disabled={isConnecting}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 px-6 py-2 rounded-full transition shadow-lg shadow-blue-900/20 ${!walletAddress && !isConnecting ? 'animate-pulse' : ''}`}
          >
            <Wallet size={18} />
            {isConnecting ? (
              "Connecting..."
            ) : walletAddress ? (
              `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            ) : (
              "Connect Wallet"
            )}
            <Icon icon={Wallet} dense />
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-8 py-6">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "watchlist" ? (
          <WatchlistTab />
        ) : (
          <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <ShieldCheck className="text-green-400 mb-4" />
                  <h3 className="text-tradeflow-muted text-sm">Risk Engine Status</h3>
                  <p className="text-2xl font-semibold text-green-400">Active (Mock)</p>
                </Card>
                <Card>
                  <Landmark className="text-blue-400 mb-4" />
                  <h3 className="text-tradeflow-muted text-sm">Protocol Liquidity</h3>
                  <p className="text-2xl font-semibold">$1,250,000 USDC</p>
                </Card>
                <button
                  onClick={() => setShowMintForm(true)}
                  className="bg-tradeflow-accent/10 border-2 border-dashed border-tradeflow-accent/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-tradeflow-accent/20 transition"
                >
                  <Icon icon={PlusCircle} className="text-tradeflow-accent mb-2" size={32} />
                  <span className="font-medium text-tradeflow-accent">
                    Mint New Invoice NFT
                  </span>
                </button>
              </div>

              {/* Wallet Assets (Trustline Section) */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-12 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">My Stellar Wallet</h2>
                  <p className="text-slate-400 text-sm">Establish trustlines to receive and trade these assets on-chain.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 min-w-[220px] justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">USDC</span>
                      <StarIcon
                        isStarred={isInWatchlist("USDC")}
                        onClick={() => toggleWatchlist("USDC")}
                      />
                    </div>
                    <AddTrustlineButton
                      assetCode="USDC"
                      assetIssuer="GBBD67IF633ZHJ2CCYBT6RILOY7Y6S6M5SOW2S2ZQRAGI7XRYB2TOC6S"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 min-w-[220px] justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">yXLM</span>
                      <StarIcon
                        isStarred={isInWatchlist("yXLM")}
                        onClick={() => toggleWatchlist("yXLM")}
                      />
                    </div>
                    <AddTrustlineButton
                      assetCode="yXLM"
                      assetIssuer="GBDUE7TSYHCWW2NQCXHTS7F7W4R4SXY5NCCO4I734XOYLGGUKJALTCYI"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Table */}
              <InvoiceTable />
              <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden mb-12">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-semibold">Verified Asset Pipeline</h2>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
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
                      invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition"
                        >
                          <td className="p-4 font-mono text-sm text-blue-300">
                            #{inv.id.slice(-6)}
                          </td>
                          <td className="p-4">
                            <div className="w-full bg-tradeflow-muted h-2 rounded-full max-w-[100px]">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${inv.riskScore}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium">
                            <span
                              className={`px-3 py-1 rounded-full ${inv.status === "Approved" ? "bg-tradeflow-success/20 text-tradeflow-success" : "bg-tradeflow-warning/20 text-tradeflow-warning"}`}
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
              {/* Invoice Table with Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                {/* Filter Sidebar */}
                <div className="lg:col-span-1">
                  <InvoiceFilter
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>

                {/* Invoice Table */}
                <div className="lg:col-span-3">
                  <InvoiceTable filters={filters} />
                </div>
              </div>

              {/* Active Loans Table (Issue #6) */}
              <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-semibold">Active Loans Dashboard</h2>
                </div>
                <div className="p-6 bg-tradeflow-dark/50">
                  <LoanTable />
                  {/* Invoice Table */}
                  <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden mb-12">
                    <div className="p-6 border-b border-slate-700">
                      <h2 className="text-xl font-semibold">Verified Asset Pipeline</h2>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
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
                          invoices.map((inv: { id: string; riskScore: number; status: string; amount: number | string }) => (
                            <tr
                              key={inv.id}
                              className="border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition"
                            >
                              <td className="p-4 font-mono text-sm text-blue-300">
                                #{inv.id.slice(-6)}
                              </td>
                              <td className="p-4">
                                <div className="w-full bg-tradeflow-muted h-2 rounded-full max-w-[100px]">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${inv.riskScore}%` }}
                                  ></div>
                                </div>
                              </td>
                              <td className="p-4 text-sm font-medium">
                                <span
                                  className={`px-3 py-1 rounded-full ${inv.status === "Approved" ? "bg-tradeflow-success/20 text-tradeflow-success" : "bg-tradeflow-warning/20 text-tradeflow-warning"}`}
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
                  <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                      <h2 className="text-xl font-semibold">Active Loans Dashboard</h2>
                    </div>
                    <div className="p-6 bg-tradeflow-dark/50">
                      <LoanTable />
                    </div>
                  </div>

                  {/* Pro Mode Charts (Lazy-loaded) */}
                  <ProModeSection />
                </>
          )}
              </div>

        <FreighterConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
              <WalletModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConnect={handleConnectWallet}
              />

              {/* Invoice Mint Form Modal */}
              {showMintForm && (
                <InvoiceMintForm
                  onClose={() => setShowMintForm(false)}
                  onSubmit={handleInvoiceMint}
                />
              )}
            </div>
        </div>
        );
}
