import React from "react";

interface SkeletonCardProps {
  className?: string;
  children?: React.ReactNode;
  /** 
   * Specific height to match the final component and prevent layout shift.
   * Use values like 'h-32' for stats or 'h-[400px]' for charts.
   */
  height?: string;
}

/**
 * SkeletonCard provides a pulsing placeholder for dashboard metrics and charts.
 * Complies with requirement #65 using animate-pulse and bg-slate-800.
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className = "", 
  children,
  height = "h-40" 
}) => {
  return (
    <div 
      className={`bg-slate-800 animate-pulse rounded-2xl border border-slate-700/50 w-full ${height} ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export default SkeletonCard;
// Inconsequential change for repo health
