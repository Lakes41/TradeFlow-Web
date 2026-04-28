"use client";

import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { X, Wallet, TrendingUp, Zap } from "lucide-react";
import Button from "./ui/Button";
import { useTxWithToast } from "../hooks/useTxWithToast";

BigNumber.config({ EXPONENTIAL_AT: 1e9, DECIMAL_PLACES: 7 });

const STROOPS_PER_XLM = 10_000_000;

export interface Invoice {
  id: string;
  faceValue: number;
  apy: number;
  dueDate: string;
  currency: "XLM" | "USDC";
}

interface FractionalPurchaseModalProps {
  invoice: Invoice;
  walletBalance: string;
  onClose: () => void;
  onBuyFraction: (amountStroops: string, invoiceId: string) => Promise<void>;
}

function daysToMaturity(dueDate: string): number {
  const diff = new Date(dueDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function calcExpectedReturn(amount: string, apy: number, days: number) {
  if (!amount || Number(amount) <= 0) {
    return { yieldAmt: "0.0000000", total: "0.0000000" };
  }
  const principal = new BigNumber(amount);
  const yieldAmt = principal.multipliedBy(apy / 100).multipliedBy(days / 365);
  return {
    yieldAmt: yieldAmt.toFixed(7),
    total: principal.plus(yieldAmt).toFixed(7),
  };
}

function toStroops(amount: string): string {
  return new BigNumber(amount)
    .multipliedBy(STROOPS_PER_XLM)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toFixed(0);
}

export default function FractionalPurchaseModal({
  invoice,
  walletBalance,
  onClose,
  onBuyFraction,
}: FractionalPurchaseModalProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { executeTx } = useTxWithToast();

  const days = daysToMaturity(invoice.dueDate);
  const balance = new BigNumber(walletBalance || "0");
  const entered = new BigNumber(amount || "0");
  const isValid =
    entered.isGreaterThan(0) && entered.isLessThanOrEqualTo(balance);
  const { yieldAmt, total } = calcExpectedReturn(amount, invoice.apy, days);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,7}$/.test(val) || val === "") {
      setAmount(val);
      setValidationError(null);
    }
  };

  const handleMax = () => {
    setAmount(balance.toFixed(7));
    setValidationError(null);
  };

  const handleSubmit = async () => {
    // Validation errors stay inline — these are user input issues, not tx errors
    if (!isValid) {
      setValidationError(
        entered.isGreaterThan(balance)
          ? "Amount exceeds wallet balance."
          : "Enter a valid amount greater than 0."
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    // executeTx wraps the call in try/catch and fires the correct toast:
    //   - "User Rejected Signature" → warning toast
    //   - Network / Contract error  → error toast
    // Returns null if the transaction failed (toast already shown).
    const result = await executeTx(() =>
      onBuyFraction(toStroops(amount), invoice.id)
    );

    setIsSubmitting(false);

    if (result !== null) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Buy Fraction</h2>
            <p className="text-sm text-slate-400 mt-0.5">Invoice #{invoice.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
          >
            <Icon icon={X} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Invoice Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Face Value</p>
              <p className="text-white font-semibold text-sm">
                ${invoice.faceValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">APY</p>
              <p className="text-emerald-400 font-semibold text-sm">
                {invoice.apy}%
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Days Left</p>
              <p className="text-blue-400 font-semibold text-sm">{days}d</p>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-700/40 rounded-xl border border-slate-600/50">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Icon icon={Wallet} dense className="text-slate-400" />
              <span>Available Balance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">
                {balance.toFixed(4)} {invoice.currency}
              </span>
              <button
                onClick={handleMax}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-md transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ({invoice.currency})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.0000001"
                min="0"
                placeholder="0.0000000"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                {invoice.currency}
              </span>
            </div>
            {validationError && (
              <p className="mt-2 text-sm text-red-400">{validationError}</p>
            )}
            <p className="mt-1.5 text-xs text-slate-500">
              Up to 7 decimal places (Stellar precision)
            </p>
          </div>

          {/* Expected Return */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-700/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Icon icon={TrendingUp} dense className="text-emerald-400" />
              <span>Expected Return</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Principal</span>
              <span className="text-white font-medium">
                {amount ? new BigNumber(amount).toFixed(7) : "0.0000000"}{" "}
                {invoice.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                Yield ({invoice.apy}% APY, {days}d)
              </span>
              <span className="text-emerald-400 font-medium">
                +{yieldAmt} {invoice.currency}
              </span>
            </div>
            <div className="h-px bg-slate-700" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-200">Total at Maturity</span>
              <span className="text-white">
                {total} {invoice.currency}
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon icon={Zap} dense />
            {isSubmitting ? "Confirming Transaction..." : "Buy Fraction"}
          </Button>

          <p className="text-center text-xs text-slate-500">
            Calls{" "}
            <code className="text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded">
              buy_fraction
            </code>{" "}
            via Soroban contract
          </p>
        </div>
      </div>
    </div>
  );
}
// Inconsequential change for repo health
