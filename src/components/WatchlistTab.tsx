"use client";

import React from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import StarIcon from './StarIcon';

const allTokens = ['XLM', 'USDC', 'yXLM', 'ETH', 'EURC'];

interface WatchlistTabProps {
  className?: string;
}

export default function WatchlistTab({ className = '' }: WatchlistTabProps) {
  const { watchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const watchlistTokens = allTokens.filter(token => isInWatchlist(token));

  if (watchlistTokens.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-tradeflow-muted mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-tradeflow-muted/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-2.572-1.868a1 1 0 00-1.176 0l-2.572 1.868c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Watchlist Items</h3>
          <p className="text-tradeflow-muted">
            Start adding tokens to your watchlist by clicking the star icon next to any token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">My Watchlist</h2>
        <p className="text-tradeflow-muted text-sm">
          Track your favorite tokens and monitor their performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlistTokens.map((token) => (
          <div
            key={token}
            className="bg-tradeflow-secondary border border-tradeflow-muted rounded-xl p-4 hover:border-tradeflow-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tradeflow-accent rounded-full flex items-center justify-center text-sm font-bold">
                  {token.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{token}</h3>
                  <p className="text-tradeflow-muted text-xs">Stellar Asset</p>
                </div>
              </div>
              <StarIcon
                isStarred={true}
                onClick={() => removeFromWatchlist(token)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-tradeflow-muted text-sm">Price</span>
                <span className="text-white font-medium">
                  ${token === 'XLM' ? '0.12' : token === 'USDC' ? '1.00' : token === 'yXLM' ? '0.13' : token === 'ETH' ? '2,234' : '1.08'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-tradeflow-muted text-sm">24h Change</span>
                <span className="text-green-400 text-sm font-medium">+2.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-tradeflow-muted text-sm">Volume</span>
                <span className="text-white text-sm">
                  ${token === 'XLM' ? '1.2M' : token === 'USDC' ? '45.6M' : token === 'yXLM' ? '890K' : token === 'ETH' ? '123M' : '2.1M'}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 bg-tradeflow-accent hover:bg-tradeflow-accent/80 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
              Trade {token}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inconsequential change for repo health
