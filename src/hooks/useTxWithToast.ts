"use client";

/**
 * useTxWithToast.ts
 * Wraps Freighter transaction calls in try/catch and fires the
 * correct toast on failure using react-hot-toast.
 *
 * Issue #181 - BETAIL-BOYS/TradeFlow-Web
 * Place at: src/hooks/useTxWithToast.ts
 */

import { useCallback } from "react";
import toast from "react-hot-toast";
import { parseFreighterError, ERROR_TYPE } from "../lib/freighterErrors";

interface UseTxWithToastReturn {
  executeTx: <T>(fn: () => Promise<T>) => Promise<T | null>;
  showTxError: (error: unknown) => void;
}

export function useTxWithToast(): UseTxWithToastReturn {
  const showTxError = useCallback((error: unknown) => {
    const { type, message } = parseFreighterError(error);

    if (type === ERROR_TYPE.USER_REJECTED) {
      toast(message, {
        icon: "⚠️",
        style: {
          background: "#FEF9C3",
          color: "#854D0E",
          border: "1px solid #FDE047",
        },
      });
    } else {
      toast.error(message, {
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #FCA5A5",
        },
      });
    }
  }, []);

  const executeTx = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        const result = await fn();
        return result;
      } catch (error: unknown) {
        showTxError(error);
        return null;
      }
    },
    [showTxError]
  );

  return { executeTx, showTxError };
}