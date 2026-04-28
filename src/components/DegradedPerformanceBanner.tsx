"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, X, Wifi, WifiOff } from 'lucide-react';
import { useBackendHealth } from '../contexts/BackendHealthContext';
import Icon from './ui/Icon';

export default function DegradedPerformanceBanner() {
  const { healthState, resetHealth, isDegraded, isOffline } = useBackendHealth();

  // Don't show banner when backend is healthy
  if (!isDegraded && !isOffline) {
    return null;
  }

  const handleRetry = () => {
    resetHealth();
    // Trigger a health check by making a simple API call
    fetch('/api/health')
      .then(() => {
        // Success will be reported through the health context
      })
      .catch(() => {
        // Error will be reported through the health context
      });
  };

  const getBannerContent = () => {
    if (isOffline) {
      return {
        icon: <Icon icon={WifiOff} />,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        iconColor: 'text-red-400',
        title: 'Backend Offline',
        message: 'Our servers are temporarily unavailable. Some features may be limited.',
        actionText: 'Retry Connection',
        actionBg: 'bg-red-600 hover:bg-red-700',
      };
    }

    return {
      icon: <Icon icon={AlertTriangle} />,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      title: 'Degraded Performance',
      message: 'Some services are experiencing issues. Blockchain operations remain available.',
      actionText: 'Check Status',
      actionBg: 'bg-yellow-600 hover:bg-yellow-700',
    };
  };

  const content = getBannerContent();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${content.bgColor} border-b ${content.borderColor} backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${content.bgColor} ${content.iconColor}`}>
              {content.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${content.iconColor}`}>
                {content.title}
              </p>
              <p className="text-sm text-slate-300">
                {content.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRetry}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${content.actionBg} transition-colors`}
            >
              <Icon icon={RefreshCw} dense />
              {content.actionText}
            </button>
            
            <button
              onClick={() => resetHealth()}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Dismiss"
            >
              <Icon icon={X} dense />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
