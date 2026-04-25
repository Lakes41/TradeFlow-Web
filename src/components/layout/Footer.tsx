"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import NetworkToggle from "../NetworkToggle";

export default function Footer() {
  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear(); // Good measure for QA
    alert("App data cleared. Please refresh the page.");
  };

  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">
              2024 TradeFlow. All rights reserved.
            </span>
            {/* Developer QA Utilities */}
            <NetworkToggle />
            <button
              onClick={handleClearCache}
              className="text-slate-600 hover:text-slate-400 transition-colors text-xs"
              title="Clear Local Storage & Cache"
            >
              Clear Cache
            </button>
          </div>

          <nav className="flex gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Handle Documentation link
                console.log("Documentation clicked");
              }}
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                // Handle Terms of Service link
                console.log("Terms of Service clicked");
              }}
            >
              Terms of Service
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Twitter
              <ExternalLink size={12} className="w-4 h-4" />
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-slate-400 text-sm">Systems Operational</span>
          </div>

        </div>
      </div>
    </footer>
  );
}