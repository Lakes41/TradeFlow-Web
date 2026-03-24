"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkCongestionContextType {
  isNetworkCongested: boolean;
  setIsNetworkCongested: (value: boolean) => void;
  isDismissed: boolean;
  dismiss: () => void;
}

const NetworkCongestionContext = createContext<NetworkCongestionContextType | undefined>(undefined);

export function NetworkCongestionProvider({ children }: { children: ReactNode }) {
  const [isNetworkCongested, setIsNetworkCongested] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const dismiss = () => setIsDismissed(true);

  return (
    <NetworkCongestionContext.Provider value={{ isNetworkCongested, setIsNetworkCongested, isDismissed, dismiss }}>
      {children}
    </NetworkCongestionContext.Provider>
  );
}

export function useNetworkCongestion() {
  const context = useContext(NetworkCongestionContext);
  if (context === undefined) {
    throw new Error('useNetworkCongestion must be used within a NetworkCongestionProvider');
  }
  return context;
}
