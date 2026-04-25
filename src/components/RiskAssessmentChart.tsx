"use client";

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

interface RiskAssessmentData {
  creditScore: number;
  paymentHistory: number;
  marketSectorRisk: number;
  collateralRatio: number;
  liquidityScore: number;
  debtToIncomeRatio: number;
}

interface RiskAssessmentChartProps {
  data: RiskAssessmentData;
  className?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const fullMark = 100;
    
    // Determine risk level based on value
    let riskLevel = "Low";
    let riskColor = "text-green-400";
    
    if (value < 40) {
      riskLevel = "High";
      riskColor = "text-red-400";
    } else if (value < 70) {
      riskLevel = "Medium";
      riskColor = "text-yellow-400";
    } else {
      riskLevel = "Low";
      riskColor = "text-green-400";
    }

    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-slate-300 mb-1">{label}</p>
        <p className="text-lg font-semibold text-white mb-1">{value}%</p>
        <p className={`text-xs font-medium ${riskColor}`}>{riskLevel} Risk</p>
      </div>
    );
  }
  return null;
};

const RiskAssessmentChart: React.FC<RiskAssessmentChartProps> = ({ 
  data, 
  className = "" 
}) => {
  // Transform data for radar chart
  const chartData = [
    {
      subject: "Credit Score",
      value: data.creditScore,
      fullMark: 100,
    },
    {
      subject: "Payment History",
      value: data.paymentHistory,
      fullMark: 100,
    },
    {
      subject: "Market Sector",
      value: data.marketSectorRisk,
      fullMark: 100,
    },
    {
      subject: "Collateral Ratio",
      value: data.collateralRatio,
      fullMark: 100,
    },
    {
      subject: "Liquidity Score",
      value: data.liquidityScore,
      fullMark: 100,
    },
    {
      subject: "Debt-to-Income",
      value: data.debtToIncomeRatio,
      fullMark: 100,
    },
  ];

  // Calculate overall risk score (weighted average)
  const overallRiskScore = Math.round(
    (data.creditScore * 0.25 +
      data.paymentHistory * 0.20 +
      data.marketSectorRisk * 0.15 +
      data.collateralRatio * 0.20 +
      data.liquidityScore * 0.10 +
      data.debtToIncomeRatio * 0.10)
  );

  // Determine overall risk level
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low", color: "text-green-400", bg: "bg-green-400/20" };
    if (score >= 60) return { level: "Medium", color: "text-yellow-400", bg: "bg-yellow-400/20" };
    return { level: "High", color: "text-red-400", bg: "bg-red-400/20" };
  };

  const riskLevel = getRiskLevel(overallRiskScore);

  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <h2 className="text-xl font-semibold text-white">Risk Assessment</h2>
        </div>
        <div className={`px-3 py-1 rounded-full ${riskLevel.bg} ${riskLevel.color} text-sm font-medium`}>
          {riskLevel.level} Risk ({overallRiskScore}%)
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid 
              stroke="#475569" 
              strokeDasharray="3 3"
              radialLines={true}
            />
            <PolarAngleAxis 
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              className="text-xs"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="Risk Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Factor Details */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {chartData.map((item, index) => {
          const factorRiskLevel = getRiskLevel(item.value);
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">{item.subject}</p>
                <p className={`text-xs ${factorRiskLevel.color}`}>{factorRiskLevel.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{item.value}%</p>
                <div className="w-16 bg-slate-600 h-1 rounded-full mt-1">
                  <div 
                    className={`h-1 rounded-full ${
                      item.value >= 80 ? "bg-green-400" : 
                      item.value >= 60 ? "bg-yellow-400" : "bg-red-400"
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskAssessmentChart;
