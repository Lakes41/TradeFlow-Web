"use client";

import React, { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { addTrustline } from "../lib/stellar";
import { dismissToast, showError, showLoading, showSuccess } from "../lib/toast";
import Button from "./ui/Button";
import Icon from "./ui/Icon";

interface AddTrustlineButtonProps {
  assetCode: string;
  assetIssuer: string;
}

/**
 * A reusable button that establishes a Trustline for a specific Stellar asset
 * using the Freighter wallet extension.
 */
export default function AddTrustlineButton({ assetCode, assetIssuer }: AddTrustlineButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleAddTrustline = async () => {
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    const toastId = showLoading(`Requesting ${assetCode} trustline...`);

    try {
      await addTrustline(assetCode, assetIssuer);

      setStatus("success");
      dismissToast(toastId);
      showSuccess(`${assetCode} Trustline Established!`);

      // Revert to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error(`[AddTrustline] Error:`, error);
      setStatus("error");

      // Handle rejection vs generic error
      const errorMsg = error.message?.includes("denied")
        ? "Access Denied by User"
        : `Failed to add ${assetCode}`;

      dismissToast(toastId);
      showError(errorMsg);

      // Revert to idle after 3 seconds to allow retry
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleAddTrustline}
      disabled={status === "loading" || status === "success"}
      className={`flex items-center gap-2 text-xs py-1.5 px-3 h-auto transition-all duration-200 ${status === "success" ? "bg-green-600/20 text-green-400 border-green-600/50" : ""
        }`}
    >
      {status === "loading" ? (
        <Icon icon={Loader2} dense className="animate-spin" />
      ) : status === "success" ? (
        <Icon icon={Check} dense />
      ) : (
        <Icon icon={Plus} dense />
      )}

      <span>
        {status === "loading" ? "Signing..." : status === "success" ? "Trustline Active" : `Add ${assetCode}`}
      </span>
    </Button>
  );
}
