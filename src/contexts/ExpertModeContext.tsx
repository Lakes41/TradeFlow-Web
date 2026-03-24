"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExpertModeContextType {
  isExpertMode: boolean;
  setExpertMode: (value: boolean) => void;
  hasAcceptedRisk: boolean;
  acceptRisk: () => void;
}

const ExpertModeContext = createContext<ExpertModeContextType | undefined>(undefined);

export function ExpertModeProvider({ children }: { children: ReactNode }) {
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [hasAcceptedRisk, setHasAcceptedRisk] = useState(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tradeflow_expert_accepted') === 'true';
    }
    return false;
  });

  const setExpertMode = (value: boolean) => {
    setIsExpertMode(value);
  };

  const acceptRisk = () => {
    setHasAcceptedRisk(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradeflow_expert_accepted', 'true');
    }
  };

  return (
    <ExpertModeContext.Provider value={{ isExpertMode, setExpertMode, hasAcceptedRisk, acceptRisk }}>
      {children}
    </ExpertModeContext.Provider>
  );
}

export function useExpertMode() {
  const context = useContext(ExpertModeContext);
  if (context === undefined) {
    throw new Error('useExpertMode must be used within an ExpertModeProvider');
  }
  return context;
}
