"use client";

import React from "react";
import Button from "../components/ui/Button";
import { useSigningActions } from "../stores/signatureStore";

// Test component to verify signature overlay functionality
export default function SignatureOverlayTest() {
  const { startSigning, stopSigning, updateMessage, setTransactionDetails } = useSigningActions();

  const testBasicOverlay = () => {
    startSigning("Please sign the transaction in your wallet.");
  };

  const testOverlayWithDetails = () => {
    setTransactionDetails({
      amount: "100",
      fromToken: "XLM",
      toToken: "USDC",
      networkFee: "0.0001",
      contractAddress: "GBBMNK5DC3K5M6S5HXUC7N4JUSMZJZFNQZU6LXNNYARF4B5KE5ZG4L6U"
    });
    startSigning("Please approve this swap transaction.");
  };

  const testOverlayWithCustomMessage = () => {
    startSigning("Connecting to your wallet... Please wait.");
    // Update message after 2 seconds
    setTimeout(() => {
      updateMessage("Please sign the transaction in your wallet.");
    }, 2000);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Signature Overlay Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Basic Overlay Test</h3>
          <Button onClick={testBasicOverlay} className="bg-blue-600 hover:bg-blue-700">
            Show Basic Overlay
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Overlay with Transaction Details</h3>
          <Button onClick={testOverlayWithDetails} className="bg-green-600 hover:bg-green-700">
            Show Overlay with Details
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Overlay with Custom Message</h3>
          <Button onClick={testOverlayWithCustomMessage} className="bg-purple-600 hover:bg-purple-700">
            Show Overlay with Custom Message
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Stop Overlay</h3>
          <Button onClick={stopSigning} className="bg-red-600 hover:bg-red-700">
            Stop Overlay
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Test Instructions</h3>
        <ol className="text-slate-300 space-y-2 list-decimal list-inside">
          <li>Click "Show Basic Overlay" to test the basic overlay functionality</li>
          <li>Click "Show Overlay with Details" to test with transaction details</li>
          <li>Click "Show Overlay with Custom Message" to test message updates</li>
          <li>Click "Stop Overlay" or use the X button to close the overlay</li>
          <li>Verify that the overlay prevents interaction with other UI elements</li>
          <li>Check that the overlay has proper z-index (z-[9999])</li>
        </ol>
      </div>
    </div>
  );
}
