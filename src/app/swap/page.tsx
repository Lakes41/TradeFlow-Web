"use client";

import React, { useState } from "react";
import { connectWallet, WalletType } from "@/lib/stellar";
import  Navbar from "@/components/Navbar";
import WalletModal from "@/components/WalletModal";
import { SwapCard } from "@/components/SwapCard";
import WalletNotConnected from "@/components/WalletNotConnected";

export default function SwapPage() {
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
          <div className="flex items-center justify-center py-12">
            <SwapCard />
          </div>
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
