"use client";

import React from "react";
import { useRepayInvoice } from "@/hooks/useRepayInvoice";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface RepayInvoiceButtonProps {
  invoiceId: string;
  callerPublicKey: string;
  /** Principal + interest total for display purposes only. */
  totalDue?: number;
  onSuccess?: (txStatus: string) => void;
}

/**
 * Issue #194: Displays a "Repay Loan" CTA for invoices owned by the connected
 * wallet. Calculates the total due for UX transparency and calls the `repay`
 * Soroban contract function on click.
 */
export default function RepayInvoiceButton({
  invoiceId,
  callerPublicKey,
  totalDue,
  onSuccess,
}: RepayInvoiceButtonProps) {
  const { repay, loading, error, txStatus } = useRepayInvoice();

  const handleRepay = async () => {
    try {
      const status = await repay(invoiceId, callerPublicKey);
      onSuccess?.(status);
    } catch {
      // error state is set inside the hook
    }
  };

  if (txStatus) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm">
        <CheckCircle className="w-4 h-4 shrink-0" />
        Repayment confirmed on-chain
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {totalDue !== undefined && (
        <p className="text-sm text-slate-400">
          Total due:{" "}
          <span className="text-white font-semibold">
            ${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
      )}

      <button
        onClick={handleRepay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting repayment…
          </>
        ) : (
          "Repay Loan"
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-400/10 text-red-400 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

// Inconsequential change for repo health
