import { useState } from "react";
import { repayInvoice } from "@/soroban";

export function useRepayInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  async function repay(invoiceId: string, callerPublicKey: string) {
    setLoading(true);
    setError(null);
    try {
      const status = await repayInvoice({ invoiceId, callerPublicKey });
      setTxStatus(status);
      return status;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { repay, loading, error, txStatus };
}
