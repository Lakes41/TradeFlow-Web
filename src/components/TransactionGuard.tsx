"use client";

import { useNetworkDetection } from "../hooks/useNetworkDetection";

interface TransactionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TransactionGuard({ children, fallback }: TransactionGuardProps) {
  const { isMismatched, showWarning } = useNetworkDetection();

  // If there's a network mismatch and warning is showing, block transactions
  if (isMismatched && showWarning) {
    return fallback || (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">
            Transaction Blocked
          </div>
          <div className="text-red-700 text-sm">
            Please switch to the correct network to continue with transactions.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Inconsequential change for repo health
