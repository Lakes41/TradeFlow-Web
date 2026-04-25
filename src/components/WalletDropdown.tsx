"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Wallet, TrendingUp, RefreshCw, ExternalLink } from "lucide-react";
import { useWeb3Store } from "../stores/useWeb3Store";
import { useTokenStore, TF_TOKEN_INFO } from "../stores/tokenStore";

interface TokenBalance {
  code: string;
  balance: number;
  issuer?: string;
  name?: string;
  isNative?: boolean;
}

interface WalletDropdownProps {
  address: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function WalletDropdown({ address, isOpen, onToggle }: WalletDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { balances, updateBalances, isLoading } = useWeb3Store();
  const { tfTokenBalance } = useTokenStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Refresh balances
  const handleRefreshBalances = async () => {
    setIsRefreshing(true);
    try {
      await updateBalances();
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format balance to 2 decimal places
  const formatBalance = (balance: number): string => {
    return balance.toFixed(2);
  };

  // Get token display info
  const getTokenInfo = (code: string): { name: string; color: string } => {
    switch (code) {
      case 'XLM':
        return { name: 'Stellar Lumens', color: 'text-blue-400' };
      case 'TF':
        return { name: 'TradeFlow Token', color: 'text-green-400' };
      case 'USDC':
        return { name: 'USD Coin', color: 'text-blue-300' };
      case 'EURC':
        return { name: 'Euro Coin', color: 'text-yellow-400' };
      default:
        return { name: code, color: 'text-gray-400' };
    }
  };

  // Combine all token balances
  const getAllTokenBalances = (): TokenBalance[] => {
    const tokenBalances: TokenBalance[] = [];

    // Add XLM balance
    if (balances.XLM > 0) {
      tokenBalances.push({
        code: 'XLM',
        balance: balances.XLM,
        name: 'Stellar Lumens',
        isNative: true
      });
    }

    // Add TF token balance
    if (tfTokenBalance > 0) {
      tokenBalances.push({
        code: 'TF',
        balance: tfTokenBalance,
        issuer: TF_TOKEN_INFO.issuer,
        name: TF_TOKEN_INFO.name
      });
    }

    // Add other token balances
    Object.entries(balances).forEach(([code, balance]) => {
      if (code !== 'XLM' && code !== 'TF' && balance > 0) {
        tokenBalances.push({
          code,
          balance,
          name: getTokenInfo(code).name
        });
      }
    });

    // Sort by balance value (descending)
    return tokenBalances.sort((a, b) => b.balance - a.balance);
  };

  const tokenBalances = getAllTokenBalances();
  const totalValue = tokenBalances.reduce((sum, token) => sum + token.balance, 0);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Liquid Assets</span>
          </div>
          <button
            onClick={handleRefreshBalances}
            disabled={isRefreshing || isLoading}
            className="p-1 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
            title="Refresh balances"
          >
            <RefreshCw 
              className={`w-4 h-4 text-slate-400 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        
        {/* Wallet Address */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <a
            href={`https://stellar.expert/explorer/testnet/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Explorer
          </a>
        </div>
      </div>

      {/* Balance List */}
      <div className="max-h-64 overflow-y-auto">
        {tokenBalances.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-slate-400 text-sm mb-2">No balances found</div>
            <div className="text-slate-500 text-xs">
              {isLoading ? 'Loading balances...' : 'Your wallet appears to be empty'}
            </div>
          </div>
        ) : (
          <div className="p-2">
            {tokenBalances.map((token) => {
              const tokenInfo = getTokenInfo(token.code);
              return (
                <div
                  key={token.code}
                  className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ${token.isNative ? 'ring-2 ring-blue-400/50' : ''}`}>
                      <span className="text-xs font-bold text-white">
                        {token.code.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${tokenInfo.color}`}>
                        {token.code}
                      </div>
                      <div className="text-xs text-slate-500">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-white">
                      {formatBalance(token.balance)}
                    </div>
                    {token.isNative && (
                      <div className="text-xs text-slate-500">Native</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {tokenBalances.length > 0 && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-400">Total Assets</span>
            </div>
            <div className="font-medium text-white">
              {formatBalance(totalValue)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
