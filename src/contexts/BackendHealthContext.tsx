"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type BackendStatus = 'healthy' | 'degraded' | 'offline';

interface BackendHealthState {
  status: BackendStatus;
  lastError?: string;
  lastCheckTime?: Date;
  consecutiveFailures: number;
}

interface BackendHealthContextType {
  healthState: BackendHealthState;
  reportError: (error: Error | string, endpoint?: string) => void;
  reportSuccess: (endpoint?: string) => void;
  resetHealth: () => void;
  isHealthy: boolean;
  isDegraded: boolean;
  isOffline: boolean;
}

const BackendHealthContext = createContext<BackendHealthContextType | undefined>(undefined);

interface BackendHealthProviderProps {
  children: ReactNode;
}

const MAX_CONSECUTIVE_FAILURES = 3;
const ERROR_RESET_DELAY = 5 * 60 * 1000; // 5 minutes

export function BackendHealthProvider({ children }: BackendHealthProviderProps) {
  const [healthState, setHealthState] = useState<BackendHealthState>({
    status: 'healthy',
    consecutiveFailures: 0,
  });

  const updateStatus = useCallback((newStatus: BackendStatus, error?: string) => {
    setHealthState(prev => ({
      ...prev,
      status: newStatus,
      lastError: error,
      lastCheckTime: new Date(),
    }));
  }, []);

  const reportError = useCallback((error: Error | string, endpoint?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const endpointInfo = endpoint ? ` (${endpoint})` : '';
    
    console.warn(`Backend error reported: ${errorMessage}${endpointInfo}`);
    
    setHealthState(prev => {
      const newConsecutiveFailures = prev.consecutiveFailures + 1;
      let newStatus: BackendStatus;

      if (newConsecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        newStatus = 'offline';
      } else if (newConsecutiveFailures >= 1) {
        newStatus = 'degraded';
      } else {
        newStatus = prev.status;
      }

      return {
        ...prev,
        status: newStatus,
        lastError: errorMessage,
        lastCheckTime: new Date(),
        consecutiveFailures: newConsecutiveFailures,
      };
    });

    // Auto-reset after delay if no more errors occur
    setTimeout(() => {
      setHealthState(prev => {
        if (prev.consecutiveFailures > 0 && prev.status !== 'healthy') {
          return {
            ...prev,
            status: 'healthy',
            consecutiveFailures: 0,
            lastError: undefined,
          };
        }
        return prev;
      });
    }, ERROR_RESET_DELAY);
  }, []);

  const reportSuccess = useCallback((endpoint?: string) => {
    setHealthState(prev => {
      if (prev.consecutiveFailures > 0) {
        console.log(`Backend success reported, resetting failure count${endpoint ? ` (${endpoint})` : ''}`);
        return {
          ...prev,
          status: 'healthy',
          consecutiveFailures: 0,
          lastError: undefined,
          lastCheckTime: new Date(),
        };
      }
      return {
        ...prev,
        lastCheckTime: new Date(),
      };
    });
  }, []);

  const resetHealth = useCallback(() => {
    setHealthState({
      status: 'healthy',
      consecutiveFailures: 0,
      lastError: undefined,
      lastCheckTime: new Date(),
    });
  }, []);

  const isHealthy = healthState.status === 'healthy';
  const isDegraded = healthState.status === 'degraded';
  const isOffline = healthState.status === 'offline';

  const value: BackendHealthContextType = {
    healthState,
    reportError,
    reportSuccess,
    resetHealth,
    isHealthy,
    isDegraded,
    isOffline,
  };

  return (
    <BackendHealthContext.Provider value={value}>
      {children}
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth(): BackendHealthContextType {
  const context = useContext(BackendHealthContext);
  if (context === undefined) {
    throw new Error('useBackendHealth must be used within a BackendHealthProvider');
  }
  return context;
}
