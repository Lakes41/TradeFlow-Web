import React, { useState } from "react";
import { ArrowUpDown, Settings, BarChart3, LineChart, TrendingUp } from "lucide-react";
import TokenDropdown from "./TokenDropdown";
import SettingsModal from "./SettingsModal";
import { useSettings } from "../lib/context/SettingsContext";

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState("XLM");
  const [toToken, setToToken] = useState("USDC");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  
  const { deadline } = useSettings();

  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Pro Mode Toggle */}
      <div className="flex justify-between items-center bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isProMode ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400"}`}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Pro Mode</h3>
            <p className="text-xs text-slate-400">Advanced charts & market data</p>
          </div>
        </div>
        <button
          onClick={() => setIsProMode(!isProMode)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isProMode ? "bg-blue-600" : "bg-slate-600"
          }`}
        >
          <div
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
              isProMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Advanced Chart Area (Issue #83) */}
      {isProMode && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-blue-500/10 rounded-full text-blue-400 animate-pulse">
              <TrendingUp size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Advanced Chart Area</h3>
              <p className="text-slate-400 max-w-md">
                Real-time TradingView charts and liquidity depth analysis for professional traders.
              </p>
            </div>
          </div>
          {/* Decorative Grid */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
        </div>
      )}

      {/* Main Swap Card */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-1 shadow-2xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all transform hover:rotate-90"
            >
              <Settings size={20} />
            </button>
          </div>
          
          {/* From Token */}
          <div className="mb-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From</label>
            <div className="flex gap-4 items-center">
              <TokenDropdown onTokenChange={setFromToken} />
              <input
                type="number"
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="relative h-4 flex justify-center items-center z-10">
            <button
              onClick={handleSwap}
              className="bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl transition-all shadow-xl shadow-blue-900/40 border-4 border-slate-800 transform hover:scale-110 active:scale-95"
            >
              <ArrowUpDown size={20} className="text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To</label>
            <div className="flex gap-4 items-center">
              <TokenDropdown onTokenChange={setToToken} />
              <input
                type="number"
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Transaction Info (Issue #74) */}
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Optimal Routing
            </div>
            <div className="text-sm font-medium text-slate-300 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600/50">
              Deadline: <span className="text-blue-400">{deadline}m</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 text-lg">
            Swap Assets
          </button>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
