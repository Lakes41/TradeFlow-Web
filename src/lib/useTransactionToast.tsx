"use client";

import { showError, showLoading, showSuccess } from "./toast";

export default function useTransactionToast() {
  const loading = (message = "Waiting for confirmation...") =>
    showLoading(message);
  const success = (message = "Invoice Minted Successfully!") =>
    showSuccess(message);
  const error = (message = "Transaction Failed") => showError(message);

  return { loading, success, error };
}
