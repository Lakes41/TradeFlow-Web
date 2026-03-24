"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { useNetworkCongestion } from "../contexts/NetworkCongestionContext";

export default function NetworkCongestionBanner() {
  const { isNetworkCongested, isDismissed, dismiss } = useNetworkCongestion();

  if (!isNetworkCongested || isDismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <p className="text-sm text-yellow-200">
              <span className="font-medium">Stellar Network is currently congested.</span>{" "}
              Transactions may take longer than usual.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="ml-4 flex-shrink-0 p-1 rounded-md text-yellow-400 hover:text-yellow-200 hover:bg-yellow-500/20 transition-colors"
            aria-label="Dismiss congestion warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

type NetworkFeesResponse = {
  estimatedTotal?: number | string;
  baselineAverage?: number | string;
  baselineEstimatedTotal?: number | string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export default function NetworkCongestionBanner() {
  const [isNetworkCongested, setIsNetworkCongested] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/v1/network/fees", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = (await res.json()) as NetworkFeesResponse;

        const estimatedTotal = toNumber(data?.estimatedTotal);
        if (estimatedTotal == null) return;

        const baselineFromApi =
          toNumber(data?.baselineAverage) ?? toNumber(data?.baselineEstimatedTotal);

        const baselineFromEnv = toNumber(
          process.env.NEXT_PUBLIC_NETWORK_FEES_BASELINE
        );

        const baseline = baselineFromApi ?? baselineFromEnv ?? 1000;

        const multiplierFromEnv = toNumber(
          process.env.NEXT_PUBLIC_NETWORK_FEES_CONGESTION_MULTIPLIER
        );
        const congestionMultiplier = multiplierFromEnv ?? 2.5;

        const congested = estimatedTotal >= baseline * congestionMultiplier;

        if (!cancelled) {
          setIsNetworkCongested(congested);
        }
      } catch {
        return;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isNetworkCongested || isDismissed) return null;

  return (
    <div className="bg-yellow-400/15 border-b border-yellow-400/30 text-yellow-100 py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle size={16} className="text-yellow-300" />
        <span className="text-sm font-medium text-center">
          Stellar Network is currently congested. Transactions may take longer than usual.
        </span>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-100/80 hover:text-yellow-100 transition-colors"
        aria-label="Close congestion warning"
      >
        <X size={16} />
      </button>
    </div>
  );
}
