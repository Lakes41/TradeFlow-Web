"use client";

import React from 'react';
import { 
  useWalletConnection, 
  useNetwork, 
  useBalances, 
  useTokenBalance,
  NETWORKS 
} from '../stores/useWeb3Store';

export default function Web3TestComponent() {
  const { 
    isConnected, 
    walletAddress, 
    isConnecting, 
    connectWallet, 
    disconnectWallet, 
    error 
  } = useWalletConnection();

  const { network, switchNetwork } = useNetwork();
  const { balances, updateBalances, isLoading } = useBalances();
  const xlmBalance = useTokenBalance('XLM');

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Web3 State Management Test</h2>
      
      {/* Wallet Connection Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Wallet Connection</h3>
        {isConnected ? (
          <div className="space-y-2">
            <p className="text-green-600">✓ Connected</p>
            <p className="text-sm text-gray-600">Address: {walletAddress}</p>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">Not connected</p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">Error: {error}</p>
        )}
      </div>

      {/* Network Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Network</h3>
        <div className="flex gap-2">
          <button
            onClick={() => switchNetwork(NETWORKS.TESTNET)}
            disabled={network === NETWORKS.TESTNET}
            className={`px-3 py-1 rounded ${
              network === NETWORKS.TESTNET 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Testnet
          </button>
          <button
            onClick={() => switchNetwork(NETWORKS.MAINNET)}
            disabled={network === NETWORKS.MAINNET}
            className={`px-3 py-1 rounded ${
              network === NETWORKS.MAINNET 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Mainnet
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Current: {network}</p>
      </div>

      {/* Balances Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Token Balances</h3>
        <button
          onClick={updateBalances}
          disabled={!isConnected || isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mb-3"
        >
          {isLoading ? 'Updating...' : 'Update Balances'}
        </button>
        
        {isConnected && (
          <div className="space-y-1">
            <p className="text-sm">
              <strong>XLM:</strong> {typeof xlmBalance === 'number' ? xlmBalance.toFixed(7) : '0.0000000'}
            </p>
            {Object.entries(balances)
              .filter(([token]) => token !== 'XLM')
              .map(([token, balance]) => (
                <p key={token} className="text-sm">
                  <strong>{token}:</strong> {typeof balance === 'number' ? balance.toFixed(7) : '0.0000000'}
                </p>
              ))}
          </div>
        )}
        
        {!isConnected && (
          <p className="text-gray-500 text-sm">Connect wallet to view balances</p>
        )}
      </div>

      {/* State Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded text-xs">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            isConnected,
            walletAddress,
            network,
            isConnecting,
            isLoading,
            balanceCount: Object.keys(balances).length,
            error
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
