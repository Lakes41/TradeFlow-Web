"use client";

import { useEffect } from "react";
import { useNetworkCongestion } from "../contexts/NetworkCongestionContext";

// Baseline average fee in stroops (adjust based on real network observations)
const BASELINE_FEE_STROOPS = 100;

// Congestion threshold: if current fee is 3x baseline, consider congested
const CONGESTION_MULTIPLIER = 3;

interface NetworkFeesResponse {
  estimatedTotal: number; // in stroops
}

export default function NetworkCongestionDetector() {
  const { setIsNetworkCongested } = useNetworkCongestion();

  useEffect(() => {
    const checkNetworkCongestion = async () => {
      try {
        const res = await fetch("/api/v1/network/fees");
        if (!res.ok) {
          console.warn("[NetworkCongestionDetector] Failed to fetch network fees");
          return;
        }
        const data: NetworkFeesResponse = await res.json();
        const { estimatedTotal } = data;

        if (typeof estimatedTotal !== "number" || estimatedTotal <= 0) {
          console.warn("[NetworkCongestionDetector] Invalid fee response:", data);
          return;
        }

        const isCongested = estimatedTotal > BASELINE_FEE_STROOPS * CONGESTION_MULTIPLIER;
        console.log(
          `[NetworkCongestionDetector] Current fee: ${estimatedTotal} stroops, Baseline: ${BASELINE_FEE_STROOPS} stroops, Congested: ${isCongested}`
        );
        setIsNetworkCongested(isCongested);
      } catch (error) {
        console.error("[NetworkCongestionDetector] Error checking network congestion:", error);
        // Default to not congested on error to avoid false alarms
        setIsNetworkCongested(false);
      }
    };

    // Run once on page load
    checkNetworkCongestion();

    // Optional: re-check periodically (e.g., every 2 minutes)
    const intervalId = setInterval(checkNetworkCongestion, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [setIsNetworkCongested]);

  return null; // This component is side-effect only
}
