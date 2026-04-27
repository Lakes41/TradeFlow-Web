import { useState } from "react";
import { mintInvoice, type MintInvoiceParams } from "@/soroban";

export function useMintInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  async function mint(params: MintInvoiceParams) {
    setLoading(true);
    setError(null);
    try {
      const status = await mintInvoice(params);
      setTxStatus(status);
      return status;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { mint, loading, error, txStatus };
}
