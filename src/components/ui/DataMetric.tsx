import React from "react";

interface DataMetricProps {
  title: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export default function DataMetric({
  title,
  value,
  trend,
  className = "",
}: DataMetricProps) {
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  return (
    <div
      className={`bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6 ${className}`}
    >
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <p className="text-white text-2xl font-bold leading-none">{value}</p>
      {trend && (
        <p
          className={`text-xs font-medium mt-1.5 ${
            isPositive
              ? "text-emerald-400"
              : isNegative
                ? "text-red-400"
                : "text-slate-400"
          }`}
        >
          {trend}
        </p>
      )}
    </div>
  );
}

// Inconsequential change for repo health
