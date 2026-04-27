/**
 * freighterErrors.ts
 * Parses Freighter / Soroban errors into human-readable UI strings.
 * Issue #181 - BETAIL-BOYS/TradeFlow-Web
 */

export const ERROR_TYPE = {
  USER_REJECTED: "USER_REJECTED",
  NETWORK_ERROR: "NETWORK_ERROR",
  CONTRACT_ERROR: "CONTRACT_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorType = (typeof ERROR_TYPE)[keyof typeof ERROR_TYPE];

export interface ParsedTxError {
  type: ErrorType;
  message: string;
}

const USER_REJECTED_PATTERNS: string[] = [
  "user rejected",
  "user declined",
  "rejected by user",
  "transaction was rejected",
  "signing rejected",
  "cancelled",
  "canceled",
];

const SOROBAN_CODE_MAP: Record<number, string> = {
  1: "The contract rejected this operation.",
  2: "Wasm execution ran out of resources.",
  3: "Contract storage limit exceeded.",
  4: "Contract call stack overflow.",
  10: "Transaction sequence number is out of order.",
  11: "Insufficient account balance to cover fees.",
  12: "Transaction fee is too low.",
  13: "Transaction has already been processed.",
  20: "Network request timed out. Please try again.",
  21: "RPC node is temporarily unavailable.",
  22: "Simulation failed before submission.",
  23: "Transaction was dropped from the mempool.",
};

function extractMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message ?? "";
  if (error !== null && typeof error === "object") {
    const e = error as Record<string, unknown>;
    return String(e["message"] ?? e["error"] ?? e["detail"] ?? JSON.stringify(error));
  }
  return String(error ?? "");
}

export function parseFreighterError(error: unknown): ParsedTxError {
  const raw = extractMessage(error);
  const lower = raw.toLowerCase();

  const isRejected = USER_REJECTED_PATTERNS.some((p) => lower.includes(p));
  if (isRejected) {
    return {
      type: ERROR_TYPE.USER_REJECTED,
      message: "You cancelled the transaction. No funds were moved.",
    };
  }

  const codeMatch = raw.match(/\b(\d+)\b/);
  if (codeMatch) {
    const code = parseInt(codeMatch[1], 10);
    const mapped = SOROBAN_CODE_MAP[code];
    if (mapped) {
      return {
        type: code >= 20 ? ERROR_TYPE.NETWORK_ERROR : ERROR_TYPE.CONTRACT_ERROR,
        message: mapped,
      };
    }
  }

  if (
    lower.includes("network") ||
    lower.includes("timeout") ||
    lower.includes("connection") ||
    lower.includes("rpc") ||
    lower.includes("fetch")
  ) {
    return {
      type: ERROR_TYPE.NETWORK_ERROR,
      message: "A network error occurred. Check your connection and try again.",
    };
  }

  if (
    lower.includes("contract") ||
    lower.includes("invoke") ||
    lower.includes("wasm") ||
    lower.includes("scval") ||
    lower.includes("simulation")
  ) {
    return {
      type: ERROR_TYPE.CONTRACT_ERROR,
      message: "The contract rejected this transaction. Please try again.",
    };
  }

  return {
    type: ERROR_TYPE.UNKNOWN,
    message: "Something went wrong. Please try again.",
  };
}