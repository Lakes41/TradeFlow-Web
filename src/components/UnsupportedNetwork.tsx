"use client";

import React from "react";
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";
import Icon from "./ui/Icon";

interface UnsupportedNetworkProps {
  currentNetwork: string;
  expectedNetwork: string;
}

export default function UnsupportedNetwork({ currentNetwork, expectedNetwork }: UnsupportedNetworkProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-300">
        {/* Warning Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
          <div className="relative bg-red-500/10 border border-red-500/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-red-500">
            <Icon icon={AlertTriangle} />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Unsupported Network
        </h2>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your wallet is currently connected to <span className="text-red-400 font-mono font-bold uppercase">{currentNetwork || "Unknown"}</span>. 
          TradeFlow requires <span className="text-blue-400 font-mono font-bold uppercase">{expectedNetwork}</span> to function correctly.
        </p>

        {/* Status Comparison */}
        <div className="bg-slate-950/50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-slate-800">
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Expected</div>
            <div className="text-blue-400 font-mono font-bold">{expectedNetwork}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Current</div>
            <div className="text-red-400 font-mono font-bold">{currentNetwork || "???"}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-blue-300 text-sm">
            Please open your <span className="font-bold text-white">Freighter Wallet</span> and switch the network to <span className="font-bold text-white uppercase">{expectedNetwork}</span>.
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
          >
            <Icon icon={RefreshCw} />
            Check Connection Again
          </button>
          
          <a 
            href="https://www.freighter.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors mt-4"
          >
            Freighter Documentation <Icon icon={ExternalLink} dense />
          </a>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
