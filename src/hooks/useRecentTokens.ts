import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tradeflow_recent_tokens';
const MAX_RECENT_TOKENS = 3;

export function useRecentTokens() {
  const [recentTokens, setRecentTokens] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentTokens(parsed);
        }
      }
    } catch (error) {
      console.warn('Error reading recent tokens from localStorage:', error);
    }
  }, []);

  const addRecentToken = useCallback((token: string) => {
    setRecentTokens((prev) => {
      // Remove if exists to move to top
      const filtered = prev.filter((t) => t !== token);
      // Prepend new token and slice to max length
      const newRecent = [token, ...filtered].slice(0, MAX_RECENT_TOKENS);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecent));
      } catch (error) {
        console.warn('Error saving recent tokens:', error);
      }
      return newRecent;
    });
  }, []);

  return { recentTokens, addRecentToken };
}