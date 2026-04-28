import React from "react";
import SkeletonCard from "./ui/SkeletonCard";

/**
 * AnalyticsSkeleton renders a structured placeholder layout for the dashboard.
 * Designed to be shown when 'isLoading' is true to prevent layout shifting.
 */
const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Metrics Grid (matching typical 4-column stat layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} height="h-32" className="p-6 flex flex-col gap-3">
            {/* Title placeholder */}
            <div className="h-4 w-24 bg-slate-700/50 rounded" />
            {/* Value placeholder */}
            <div className="h-8 w-32 bg-slate-700/50 rounded" />
            {/* Trend placeholder */}
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
          </SkeletonCard>
        ))}
      </div>

      {/* Main Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Primary Chart (e.g., Volume over time) */}
        <SkeletonCard className="lg:col-span-2 p-6" height="h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-48 bg-slate-700/50 rounded" />
            <div className="h-8 w-24 bg-slate-700/50 rounded-lg" />
          </div>
          {/* Simulated Chart Area */}
          <div className="w-full h-64 border-l border-b border-slate-700/50 relative">
            <div className="absolute bottom-4 left-4 right-4 h-32 bg-gradient-to-t from-blue-500/10 to-transparent rounded-t-lg" />
          </div>
        </SkeletonCard>
        
        {/* Secondary Panel (e.g., Asset distribution) */}
        <SkeletonCard height="h-[400px]" className="p-6 flex flex-col items-center justify-center">
          <div className="h-6 w-32 bg-slate-700/50 rounded mb-8 self-start" />
          {/* Simulated Donut Chart */}
          <div className="w-48 h-48 rounded-full border-[16px] border-slate-700/50" />
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="h-3 bg-slate-700/50 rounded" />
            <div className="h-3 bg-slate-700/50 rounded" />
          </div>
        </SkeletonCard>
      </div>

      {/* Bottom Table/Activity Section */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-800/50 animate-pulse rounded" />
        <SkeletonCard height="h-64" className="divide-y divide-slate-700/30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-transparent" />
          ))}
        </SkeletonCard>
      </div>
    </div>
  );
};
export default AnalyticsSkeleton;
// Inconsequential change for repo health
