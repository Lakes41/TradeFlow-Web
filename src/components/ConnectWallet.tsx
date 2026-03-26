"use client";
import { useState } from "react";
import { connectWallet, WalletType, FREIGHTER_ID } from "../lib/stellar";
import Button from "./ui/Button";
import { useTokenStore } from "../stores/tokenStore";

export default function ConnectWallet() {
      const [pubKey, setPubKey] = useState<string | null>(null);
      const { setConnected } = useTokenStore();

      const handleConnect = async (walletType: WalletType = FREIGHTER_ID) => {
            try {
                  // This calls the wallet kit API
                  const userInfo = await connectWallet(walletType);
                  if (userInfo.publicKey) {
                        setPubKey(userInfo.publicKey);
                        setConnected(true, userInfo.publicKey);
                  }
            } catch (e: any) {
                  console.error("Connection error:", e);
                  alert(e.message || "Failed to connect to wallet!");
            }
      };

      return (
            <div>
                  <Button
                        onClick={() => handleConnect(FREIGHTER_ID)}
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center gap-2 px-6 py-3"
                  >
                        {pubKey ? `Connected: ${pubKey.slice(0, 4)}...${pubKey.slice(-4)}` : "Connect Wallet"}
                  </Button>
            </div>
      );
}
