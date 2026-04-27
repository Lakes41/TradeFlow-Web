"use client";

import React, { useState } from "react";
import { connectWallet, WalletType } from "../../lib/stellar";
import Navbar from "../../components/Navbar";
import WalletModal from "../../components/WalletModal";
import PortfolioChart from "../../components/PortfolioChart";
import WalletNotConnected from "../../components/WalletNotConnected";
import AssetsList from "../../components/AssetsList";
import LiquidityList from "../../components/LiquidityList";

export default function PortfolioPage() {
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      const userInfo = await connectWallet(walletType);
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
      }
    } catch (e: any) {
      console.error("Connection failed:", e.message);
      alert(e.message || "Failed to connect to wallet.");
    }
  };

  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      <Navbar address={address} onConnect={() => setIsModalOpen(true)} />

      <div className="flex-1 px-8">
        {!address ? (
          <WalletNotConnected onConnect={() => setIsModalOpen(true)} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-tradeflow-muted text-lg">
                Track your wealth growth over time
              </p>
            </div>

            <div className="bg-gradient-to-r from-tradeflow-accent/20 to-blue-600/20 rounded-2xl border border-tradeflow-accent/30 p-8 mb-8">
              <div className="text-center">
                <p className="text-tradeflow-muted text-sm mb-2">Total Balance</p>
                <p className="text-5xl font-bold text-white mb-2">$62,750.00</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-400 text-sm">+$2,450.00</span>
                  <span className="text-green-400 text-sm">(+4.1%)</span>
                  <span className="text-tradeflow-muted text-sm">24h</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <AssetsList />
              <LiquidityList />
            </div>

            <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
              <PortfolioChart />
            </div>
          </>
        )}
      </div>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectWallet}
      />
    </div>
  );
}