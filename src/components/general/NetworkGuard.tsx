"use client";

import React, { useEffect, useState } from "react";
import { getNetwork, isAllowed } from "@stellar/freighter-api";
import UnsupportedNetwork from "../components/UnsupportedNetwork";

export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const expectedNetwork = "TESTNET"; // Can be pulled from env later

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const allowed = await isAllowed();
        if (allowed) {
          const network = await getNetwork();
          setCurrentNetwork(network);
          
          if (network && network.toUpperCase() !== expectedNetwork) {
            setIsWrongNetwork(true);
          } else {
            setIsWrongNetwork(false);
          }
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    };

    checkNetwork();
    
    // Optional: Poll for network changes if Freighter doesn't provide an event listener
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isWrongNetwork && currentNetwork) {
    return <UnsupportedNetwork currentNetwork={currentNetwork} expectedNetwork={expectedNetwork} />;
  }

  return <>{children}</>;
}
