"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  slippage: number;
  setSlippage: (value: number) => void;
  deadline: number;
  setDeadline: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);

  return (
    <SettingsContext.Provider value={{ slippage, setSlippage, deadline, setDeadline }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
