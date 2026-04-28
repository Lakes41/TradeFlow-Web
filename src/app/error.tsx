"use client";

import React from 'react';
import Link from 'next/link';
import { ServerCrash, RotateCw, Home } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';
import Icon from '../components/ui/Icon';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    // Send error to Sentry when this error page is rendered
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-2xl w-full text-center">
        {/* 500 Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-blue-400 mb-2">500</h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Server Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Icon icon={ServerCrash} className="text-blue-400" size={32} />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Temporary System Outage</h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Something unexpected happened on our end. The TradeFlow engineering team
            has been notified and is already working to restore full service.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-colors text-white font-medium"
          >
            <Icon icon={RotateCw} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-3 rounded-full transition-colors text-white font-medium"
          >
            <Icon icon={Home} />
            Back to Dashboard
          </Link>
        </div>

        {/* Troubleshooting Tips */}
        <div className="mt-16 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-medium mb-3 text-blue-400">What you can try</h3>
          <ul className="text-slate-400 space-y-2 text-sm">
            <li>• Reload the page in a few moments</li>
            <li>• Check your internet connection</li>
            <li>• Clear your browser cache and try again</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        {/* Dev-only Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-left text-sm">
            <summary className="cursor-pointer font-medium text-slate-300">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap text-red-400">
              {error.message}
            </pre>
          </details>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
