"use client";

import React, { useState, useEffect } from "react";
import { Server } from "soroban-client";
import StickyHeader from "../../../components/StickyHeader";
import FractionalPurchaseModal, {
  type Invoice,
} from "../../../components/FractionalPurchaseModal";
import DynamicRiskAssessmentChart from "../../../components/DynamicRiskAssessmentChart";
import { useTokenStore } from "../../../stores/tokenStore";
import { ArrowLeft, ExternalLink, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import Icon from "../../../components/ui/Icon";

// Stellar testnet USDC issuer
const USDC_CODE = "USDC";
const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

const server = new Server("https://soroban-testnet.stellar.org", {
  allowHttp: true,
});

// TODO: Replace with real invoice data from your API / contract query
const INVOICE_DATA: Invoice = {
  id: "INV-00123",
  faceValue: 50000,
  apy: 8.5,
  dueDate: "2026-12-15",
  currency: "USDC",
};

// Mock risk assessment data - replace with real data from TradeFlow API
const MOCK_RISK_DATA = {
  creditScore: 85,
  paymentHistory: 92,
  marketSectorRisk: 78,
  collateralRatio: 75,
  liquidityScore: 90,
  debtToIncomeRatio: 68,
};

export default function InvoiceDetailPage() {
  const { publicKey, isConnected } = useTokenStore();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0");

  // Fetch live USDC balance from Stellar network whenever wallet connects
  useEffect(() => {
    if (!isConnected || !publicKey) {
      setUsdcBalance("0");
      return;
    }

    const fetchBalance = async () => {
      try {
        const accountResponse = await server.accounts().accountId(publicKey).call();
        const usdcEntry = accountResponse.balances.find(
          (b: any) =>
            b.asset_code === USDC_CODE && b.asset_issuer === USDC_ISSUER
        );
        setUsdcBalance(usdcEntry ? usdcEntry.balance : "0");
      } catch {
        setUsdcBalance("0");
      }
    };

    fetchBalance();
  }, [isConnected, publicKey]);

  const handleBuyFraction = async (
    amountStroops: string,
    invoiceId: string
  ) => {
    // TODO: Replace with your real Soroban client call, e.g.:
    // await sorobanClient.buy_fraction({
    //   invoice_id: invoiceId,
    //   amount: BigInt(amountStroops),
    // });
    console.log("buy_fraction called:", { invoiceId, amountStroops });
    await new Promise((r) => setTimeout(r, 1500));
  };

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
              <Icon icon={ArrowLeft} dense />
              Back
            </Link>
            <button
              onClick={() => setShowBuyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Icon icon={ExternalLink} dense />
              Trade
            </button>
          </div>
        }
      />

      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Overview */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Overview</h2>

              {loading && (
                <p className="text-slate-400 text-sm animate-pulse">Loading on-chain data...</p>
              )}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg mb-4">
                  Could not load contract data: {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Invoice ID</p>
                  <p className="font-mono text-blue-300">
                    {invoice?.id ?? "INV-00123"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Token ID</p>
                  <p className="font-mono text-green-300">TKN-0x1234...5678</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Principal Amount</p>
                  <p className="text-xl font-bold">
                    {invoice
                      ? `$${(Number(invoice.amount) / 10_000_000).toLocaleString()}`
                      : "$50,000"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Recipient</p>
                  <p className="font-mono text-sm truncate text-slate-300">
                    {invoice?.recipient ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Maturity Date</p>
                  <p className="font-medium">Dec 15, 2026</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medium">
                    {invoice?.status ?? "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart — unchanged */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Performance</h2>
                <div className="flex items-center gap-2 text-green-400">
                  <Icon icon={TrendingUp} />
                  <span className="font-medium">+12.5%</span>
                </div>
              </div>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Chart visualization would go here</p>
              </div>
            </div>

            {/* Transaction History — unchanged */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              <div className="space-y-3">
                {[
                  { date: "2024-01-15", type: "Payment", amount: "$2,125", status: "Completed" },
                  { date: "2024-01-01", type: "Payment", amount: "$2,125", status: "Completed" },
                  { date: "2023-12-15", type: "Initial", amount: "$50,000", status: "Completed" },
                ].map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
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
            {/* Risk Assessment Chart */}
            <DynamicRiskAssessmentChart data={MOCK_RISK_DATA} />

            {/* Quick Actions */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Buy Fraction
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

        {/* Fractional Purchase Modal */}
        {showBuyModal && (
          <FractionalPurchaseModal
            invoice={INVOICE_DATA}
            walletBalance={usdcBalance}
            onClose={() => setShowBuyModal(false)}
            onBuyFraction={handleBuyFraction}
          />
        )}
      </div>
    </div>
  );
}