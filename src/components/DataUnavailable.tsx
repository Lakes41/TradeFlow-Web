"use client";

import React from 'react';
import { Database, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useBackendHealth } from '../contexts/BackendHealthContext';

interface DataUnavailableProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  type?: 'chart' | 'table' | 'general';
}

export default function DataUnavailable({
  title,
  message,
  onRetry,
  showRetry = true,
  type = 'general'
}: DataUnavailableProps) {
  const { isOffline, isDegraded } = useBackendHealth();

  const getDefaultContent = () => {
    if (isOffline) {
      return {
        icon: <WifiOff size={48} />,
        title: title || 'Backend Offline',
        message: message || 'Unable to connect to our servers. Please try again later.',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        iconColor: 'text-red-400',
      };
    }

    if (isDegraded) {
      return {
        icon: <AlertCircle size={48} />,
        title: title || 'Data Unavailable',
        message: message || 'Risk data is temporarily unavailable. Blockchain operations remain functional.',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        iconColor: 'text-yellow-400',
      };
    }

    return {
      icon: <Database size={48} />,
      title: title || 'Data Unavailable',
      message: message || 'Unable to load data at this time. Please try again.',
      bgColor: 'bg-slate-700/30',
      borderColor: 'border-slate-600/50',
      iconColor: 'text-slate-400',
    };
  };

  const content = getDefaultContent();

  const getSpecificMessage = () => {
    switch (type) {
      case 'chart':
        return 'Risk charts and analytics are temporarily unavailable.';
      case 'table':
        return 'Data table is temporarily unavailable. Some features may be limited.';
      default:
        return content.message;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 rounded-xl border ${content.bgColor} ${content.borderColor} min-h-[300px]`}>
      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${content.bgColor} ${content.iconColor} mb-4`}>
        {content.icon}
      </div>
      
      <div className="text-center max-w-md">
        <h3 className={`text-lg font-semibold mb-2 ${content.iconColor}`}>
          {content.title}
        </h3>
        
        <p className="text-slate-300 text-sm mb-6">
          {getSpecificMessage()}
        </p>

        {!isOffline && (
          <p className="text-slate-400 text-xs mb-6">
            Note: Stellar blockchain operations (minting, trading, repaying) are not affected.
          </p>
        )}

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
