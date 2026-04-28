"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import SkeletonCard from "./ui/SkeletonCard";

// Loading component
const ChartLoadingSkeleton = () => (
  <SkeletonCard height="h-[520px]" className="p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="h-6 w-32 bg-slate-600 rounded animate-pulse"></div>
      </div>
      <div className="h-6 w-20 bg-slate-600 rounded-full animate-pulse"></div>
    </div>
    
    <div className="h-80 w-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Loading risk assessment...</p>
      </div>
    </div>
    
    <div className="mt-6 grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
          <div className="h-4 w-24 bg-slate-600 rounded mb-2 animate-pulse"></div>
          <div className="h-3 w-16 bg-slate-600 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </SkeletonCard>
);

// Dynamic import with SSR disabled
const DynamicRiskAssessmentChart = dynamic(
  () => import("./RiskAssessmentChart").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <ChartLoadingSkeleton />,
  }
);

interface RiskAssessmentData {
  creditScore: number;
  paymentHistory: number;
  marketSectorRisk: number;
  collateralRatio: number;
  liquidityScore: number;
  debtToIncomeRatio: number;
}

interface DynamicRiskAssessmentChartProps {
  data: RiskAssessmentData;
  className?: string;
}

const DynamicRiskAssessmentChartWrapper: React.FC<DynamicRiskAssessmentChartProps> = ({ 
  data, 
  className = "" 
}) => {
  return (
    <Suspense fallback={<ChartLoadingSkeleton />}>
      <DynamicRiskAssessmentChart data={data} className={className} />
    </Suspense>
  );
};

export default DynamicRiskAssessmentChartWrapper;

// Inconsequential change for repo health
