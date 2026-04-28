"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Download, Shield, ExternalLink, Loader2 } from "lucide-react";
import { useWalletConnection } from "../stores/useWeb3Store";
import { FREIGHTER_ID } from "../lib/stellar";
import toast from "react-hot-toast";

interface FreighterConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreighterConnectModal({ isOpen, onClose }: FreighterConnectModalProps) {
  const { connectWallet, isConnecting, error } = useWalletConnection();
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Check if Freighter is installed
  useEffect(() => {
    const checkFreighterInstallation = async () => {
      if (!isOpen) return;

      setIsChecking(true);
      
      try {
        // Check if Freighter is available in window
        const isInstalled = typeof window !== 'undefined' && 
          !!window.freighter;
        
        setIsFreighterInstalled(isInstalled);
      } catch (error) {
        console.error('Error checking Freighter installation:', error);
        setIsFreighterInstalled(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkFreighterInstallation();
  }, [isOpen]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet(FREIGHTER_ID);
      toast.success("Wallet connected successfully!");
      onClose();
    } catch (error: any) {
      console.error('Connection failed:', error);
      toast.error(error.message || "Failed to connect to Freighter wallet");
    }
  };

  // Handle download Freighter
  const handleDownloadFreighter = () => {
    window.open('https://www.freighter.app/', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Connect Freighter Wallet</h2>
              <p className="text-sm text-slate-400">Secure Stellar wallet connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isChecking ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
              <p className="text-slate-400">Checking for Freighter wallet...</p>
            </div>
          ) : isFreighterInstalled ? (
            <div className="space-y-4">
              {/* Freighter detected state */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-green-400 font-medium">Freighter Detected</p>
                    <p className="text-sm text-slate-400">Your wallet is ready to connect</p>
                  </div>
                </div>
              </div>

              {/* Connect button */}
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect Freighter Wallet
                  </>
                )}
              </button>

              {/* Error display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Freighter not detected state */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-medium">Freighter Not Detected</p>
                    <p className="text-sm text-slate-400">Install the browser extension to continue</p>
                  </div>
                </div>
              </div>

              {/* Download button */}
              <button
                onClick={handleDownloadFreighter}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Freighter Extension
              </button>

              {/* Additional info */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">About Freighter</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Secure browser extension wallet for Stellar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Supports multiple accounts and advanced features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Trusted by thousands of Stellar users</span>
                  </li>
                </ul>
              </div>

              {/* External link indicator */}
              <div className="flex items-center justify-center text-xs text-slate-500">
                <ExternalLink className="w-3 h-3 mr-1" />
                Opens in new tab
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="border-t border-slate-700 pt-4">
            <p className="text-xs text-slate-500 text-center">
              By connecting your wallet, you agree to the{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
