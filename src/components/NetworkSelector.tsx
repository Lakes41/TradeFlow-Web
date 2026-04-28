"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import Icon from "./ui/Icon";

export type Network = "mainnet" | "testnet";

interface NetworkSelectorProps {
  onNetworkChange?: (network: Network) => void;
}

export default function NetworkSelector({ onNetworkChange }: NetworkSelectorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("mainnet");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const networks = [
    {
      id: "mainnet" as Network,
      name: "Stellar Mainnet",
      description: "Production network"
    },
    {
      id: "testnet" as Network,
      name: "Stellar Testnet", 
      description: "Development network"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
    if (onNetworkChange) {
      onNetworkChange(network);
    }
  };

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Network Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 transition-colors min-w-[160px] justify-between"
      >
        <div className="flex items-center gap-2">
          {/* Stellar Logo */}
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-medium text-white text-sm">
            {selectedNetworkData?.name.replace("Stellar ", "")}
          </span>
        </div>
        <Icon icon={ChevronDown} dense className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Testnet Warning Badge */}
      {selectedNetwork === "testnet" && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
          <Icon icon={AlertTriangle} dense />
          Testnet
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden min-w-[200px]">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => handleNetworkSelect(network.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                network.id === selectedNetwork
                  ? "bg-blue-600/20 text-blue-400"
                  : "hover:bg-slate-700 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Stellar Logo */}
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{network.name}</div>
                  <div className="text-xs text-slate-400">{network.description}</div>
                </div>
                {network.id === selectedNetwork && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Inconsequential change for repo health
