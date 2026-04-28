"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SlippageContextType {
  slippageTolerance: number;
  setSlippageTolerance: (value: number) => void;
  isSlippageAuto: boolean;
  setIsSlippageAuto: (value: boolean) => void;
  transactionDeadline: number; // in minutes
  setTransactionDeadline: (value: number) => void;
}

const SlippageContext = createContext<SlippageContextType | undefined>(undefined);

export function SlippageProvider({ children }: { children: ReactNode }) {
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [isSlippageAuto, setIsSlippageAuto] = useState(true);
  const [transactionDeadline, setTransactionDeadline] = useState(20);

  return (
    <SlippageContext.Provider value={{
      slippageTolerance,
      setSlippageTolerance,
      isSlippageAuto,
      setIsSlippageAuto,
      transactionDeadline,
      setTransactionDeadline
    }}>
      {children}
    </SlippageContext.Provider>
  );
}

export function useSlippage() {
  const context = useContext(SlippageContext);
  if (context === undefined) {
    throw new Error('useSlippage must be used within a SlippageProvider');
  }
  return context;
}

// Inconsequential change for repo health
