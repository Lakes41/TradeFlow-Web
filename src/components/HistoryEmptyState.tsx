import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import Icon from './ui/Icon';

export default function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Ghost/Document Icon */}
      <div className="mb-8 p-6 bg-slate-700/30 rounded-full border-2 border-slate-600/50">
        <Icon icon={FileText} size={64} className="text-slate-400" />
      </div>

      {/* Main Text */}
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
        No recent transactions found.
      </h2>
      
      <p className="text-slate-400 text-lg max-w-md mb-8 leading-relaxed">
        Start trading to see your transaction history here.
      </p>

      {/* Make a Trade Button */}
      <Link
        href="/swap"
        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <Icon icon={FileText} />
        Make a Trade
      </Link>
    </div>
  );
}

// Inconsequential change for repo health
