import React from "react";

const TableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <div className="w-full">
        {/* Header */}
        <div className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
          <div className="flex border-b border-tradeflow-muted">
            <div className="p-4 flex-1">
              <div className="h-4 w-16 bg-slate-800 rounded animate-pulse"></div>
            </div>
            <div className="p-4 flex-1 text-right">
              <div className="h-4 w-12 bg-slate-800 rounded animate-pulse ml-auto"></div>
            </div>
            <div className="p-4 flex-1 text-right">
              <div className="h-4 w-20 bg-slate-800 rounded animate-pulse ml-auto"></div>
            </div>
            <div className="p-4 flex-1 text-right">
              <div className="h-4 w-12 bg-slate-800 rounded animate-pulse ml-auto"></div>
            </div>
            <div className="p-4 flex-1 text-center">
              <div className="h-4 w-16 bg-slate-800 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="flex border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition"
          >
            {/* Pair Column */}
            <div className="p-4 flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-slate-800 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-slate-800 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* TVL Column */}
            <div className="p-4 flex-1 text-right">
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse ml-auto"></div>
            </div>

            {/* Volume Column */}
            <div className="p-4 flex-1 text-right">
              <div className="h-4 w-28 bg-slate-800 rounded animate-pulse ml-auto"></div>
            </div>

            {/* APY Column */}
            <div className="p-4 flex-1 text-right">
              <div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse ml-auto"></div>
            </div>

            {/* Action Column */}
            <div className="p-4 flex-1 text-center">
              <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;

// Inconsequential change for repo health
