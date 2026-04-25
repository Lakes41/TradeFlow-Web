"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, Copy } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useRecentTokens } from "../hooks/useRecentTokens";
import { useWatchlist } from "../hooks/useWatchlist";
import StarIcon from "./StarIcon";
import toast from "react-hot-toast";
import Icon from "./ui/Icon";

interface TokenDropdownProps {
  onTokenChange?: (token: string) => void;
}

export default function TokenDropdown({ onTokenChange }: TokenDropdownProps) {
  const [selectedToken, setSelectedToken] = useState("XLM");
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { recentTokens, addRecentToken } = useRecentTokens();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  // Debounce the search input with 300ms delay
  const debouncedSearch = useDebounce(searchInput, 300);

  // Hardcoded array of tokens
  const tokens = ["XLM", "USDC", "yXLM"];

  /** * ISSUE #86: Mock addresses for copy functionality. 
   * In a production environment, these would come from a token list API.
   */
  const mockAddresses: Record<string, string> = {
    "XLM": "native",
    "USDC": "CBQ6O7Y4O7Z5J2... (Stellar Contract)",
    "yXLM": "CBP3T2... (Yield Stellar Asset)",
  };

  // Memoize filtered tokens based on debounced search value
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchInput(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    addRecentToken(token);
    setIsOpen(false);
    if (onTokenChange) {
      onTokenChange(token);
    }
  };

  /**
   * ISSUE #86: Clipboard handler.
   * Uses stopPropagation to ensure the dropdown doesn't close when copying.
   */
  const handleCopyAddress = (e: React.MouseEvent, token: string) => {
    e.stopPropagation();
    const address = mockAddresses[token] || "Address not found";
    
    navigator.clipboard.writeText(address)
      .then(() => {
        toast.success("Token Address Copied!");
      })
      .catch(() => {
        toast.error("Failed to copy address");
      });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Token Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 transition-colors min-w-[120px] justify-between"
      >
        <span className="font-medium text-white">{selectedToken}</span>
        <Icon icon={ChevronDown} dense className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="border-b border-slate-700 p-3 sticky top-0 bg-slate-800">
            <div className="relative">
              <Icon icon={Search} dense className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tokens..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <Icon icon={X} dense />
                </button>
              )}
            </div>
          </div>

          {/* Token List */}
          {filteredTokens.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {/* Recent Tokens Section */}
              {searchInput === "" && recentTokens.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/95 sticky top-0 z-10 backdrop-blur-sm">
                    Recent
                  </div>
                  {recentTokens.map((token) => (
                    <button
                      key={`recent-${token}`}
                      onClick={() => handleTokenSelect(token)}
                      className="w-full text-left px-4 py-2 transition-colors flex items-center justify-between hover:bg-slate-700 text-white group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token}</span>
                        {/* ISSUE #86: Copy Icon for Recent Tokens */}
                        <div
                          onClick={(e) => handleCopyAddress(e, token)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                          title="Copy Contract Address"
                        >
                        <Icon icon={Copy} dense />
                        </div>
                        <StarIcon
                          isStarred={isInWatchlist(token)}
                          onClick={() => toggleWatchlist(token)}
                        />
                      </div>
                      {token === selectedToken && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/95 sticky top-0 z-10 backdrop-blur-sm border-t border-slate-700/50">
                    All Tokens
                  </div>
                </>
              )}
              {filteredTokens.map((token) => (
                <button
                  key={token}
                  onClick={() => handleTokenSelect(token)}
                  className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between group ${
                    token === selectedToken
                      ? "bg-blue-600/20 text-blue-400"
                      : "hover:bg-slate-700 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{token}</span>
                    {/* ISSUE #86: Copy Icon for All Tokens */}
                    <div
                      onClick={(e) => handleCopyAddress(e, token)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                      title="Copy Contract Address"
                    >
                      <Icon icon={Copy} dense />
                    </div>
                    <StarIcon
                      isStarred={isInWatchlist(token)}
                      onClick={() => toggleWatchlist(token)}
                    />
                  </div>
                  {token === selectedToken && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            /**
             * ISSUE #91: Enhanced "Token Not Found" Empty State.
             * Includes visual cues and instructional secondary text.
             */
            <div className="px-6 py-10 text-center flex flex-col items-center justify-center">
              <div className="bg-slate-700/50 p-3 rounded-full mb-4">
                <Icon icon={Search} className="text-slate-500" />
              </div>
              <p className="text-white font-medium mb-1">No tokens found</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">
                Try searching for a different name or pasting a valid Stellar contract address.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}