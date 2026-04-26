"use client";
import { useState, useRef, useEffect } from "react";
import { connectWallet, WalletType, FREIGHTER_ID } from "../lib/stellar";
import Button from "./ui/Button";
import { useTokenStore } from "../stores/tokenStore";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { getCachedWalletConnection } from "../lib/walletCache";
import { LogOut, ChevronDown } from "lucide-react";
import WalletModal from "./WalletModal";
import AuthenticatedSkeleton from "./AuthenticatedSkeleton";
import Icon from "./ui/Icon";

const RECENT_TOKENS_KEY = "tradeflow_recent_tokens";

export default function ConnectWallet() {
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
      const { setConnected } = useTokenStore();
      const { connectWallet, disconnectWallet, isInitialized, isRevalidating } = useWalletConnection();
      const dropdownRef = useRef<HTMLDivElement>(null);

      // Get cached state synchronously to prevent UI flicker
      const cached = getCachedWalletConnection();
      const [pubKey, setPubKey] = useState<string | null>(() => {
        // Initialize with cached public key if available
        return cached.isCached && cached.isConnected ? cached.walletAddress : null;
      });

      // Update local state when wallet connection changes
      useEffect(() => {
        if (isInitialized) {
          const currentCached = getCachedWalletConnection();
          if (currentCached.isCached && currentCached.isConnected) {
            setPubKey(currentCached.walletAddress);
            setConnected(true, currentCached.walletAddress || undefined);
          } else {
            setPubKey(null);
            setConnected(false, undefined);
          }
        }
      }, [isInitialized, setConnected]);

      // Close dropdown when clicking outside
      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setIsDropdownOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const handleConnect = async (walletType: WalletType) => {
            try {
                  await connectWallet(walletType);
                  // The hook will update the cache and state automatically
            } catch (e: any) {
                  console.error("Connection error:", e);
                  alert(e.message || "Failed to connect to wallet!");
            }
      };

      const handleConnectClick = () => {
            setIsWalletModalOpen(true);
      };

      const handleDisconnect = () => {
            setPubKey(null);
            setConnected(false, undefined);
            localStorage.removeItem(RECENT_TOKENS_KEY);
            setIsDropdownOpen(false);
      };

      // Show skeleton if we have cached state but haven't finished initialization
      if (cached.isCached && cached.isConnected && !isInitialized) {
            return (
                  <div className="relative" ref={dropdownRef}>
                        <button
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
                        >
                              <AuthenticatedSkeleton 
                                    walletAddress={cached.walletAddress || undefined}
                                    walletType={cached.walletType || undefined}
                                    isRevalidating={isRevalidating}
                              />
                        </button>
                  </div>
            );
      }

      if (pubKey) {
            return (
                  <div className="relative" ref={dropdownRef}>
                        <button
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
                        >
                              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                              {`${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`}
                              <Icon icon={ChevronDown} dense className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-50 overflow-hidden">
                                    <div className="px-3 py-2 border-b border-slate-700">
                                          <p className="text-xs text-slate-400 font-medium">Connected Wallet</p>
                                          <p className="text-xs text-slate-300 font-mono truncate mt-0.5">{pubKey}</p>
                                    </div>
                                    <button
                                          onClick={handleDisconnect}
                                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                    >
                                          <Icon icon={LogOut} dense />
                                          Disconnect Wallet
                                    </button>
                              </div>
                        )}
                  </div>
            );
      }

      return (
            <div>
                  <Button
                        onClick={handleConnectClick}
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center gap-2 px-6 py-3"
                  >
                        Connect Wallet
                  </Button>
                  <WalletModal
                        isOpen={isWalletModalOpen}
                        onClose={() => setIsWalletModalOpen(false)}
                        onConnect={handleConnect}
                  />
            </div>
      );
}
