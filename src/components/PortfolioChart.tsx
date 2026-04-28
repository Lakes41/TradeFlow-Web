"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import SkeletonCard from "./ui/SkeletonCard";
import { api } from "../lib/api";

interface PnLData {
  date: string;
  value: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isPositive = value >= 0;
    
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function PortfolioChart() {
  const [data, setData] = useState<PnLData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPositive, setIsPositive] = useState(true);

  // Generate dummy data for the last 30 days
  useEffect(() => {
    const controller = new AbortController();
    let didLoadRemote = false;

    const generateDummyData = () => {
      const data: PnLData[] = [];
      const today = new Date();
      let currentValue = 10000; // Starting value
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random walk with slight upward trend
        const change = (Math.random() - 0.45) * 200;
        currentValue += change;
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.round(currentValue * 100) / 100
        });
      }
      
      return data;
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getPnl({ signal: controller.signal });
        if (response.ok) {
          setData(response.data);
          didLoadRemote = true;
        }
      } catch {
        // Fallback to dummy data if backend is not available
      } finally {
        if (!didLoadRemote) {
          const dummyData = generateDummyData();
          setData(dummyData);
        }
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  // Determine if overall trend is positive or negative
  useEffect(() => {
    if (data.length > 1) {
      const startValue = data[0].value;
      const endValue = data[data.length - 1].value;
      setIsPositive(endValue >= startValue);
    }
  }, [data]);

  if (loading) {
    return (
      <SkeletonCard height="h-[320px]" className="p-6" />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-1">Portfolio Performance</h2>
        <p className="text-sm text-tradeflow-muted">Last 30 days</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            
            {/* Remove grid lines */}
            <CartesianGrid strokeDasharray="0" stroke="transparent" />
            
            {/* Remove axis labels and lines */}
            <XAxis 
              dataKey="date" 
              stroke="transparent"
              tick={false}
              axisLine={false}
            />
            <YAxis 
              stroke="transparent"
              tick={false}
              axisLine={false}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
              position={{ y: 0 }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-tradeflow-muted">
            {isPositive ? 'Positive trend' : 'Negative trend'}
          </span>
        </div>
        <div className="text-sm text-tradeflow-muted">
          {data.length > 0 && (
            <>
              Starting: ${data[0]?.value.toLocaleString()} → 
              Current: ${data[data.length - 1]?.value.toLocaleString()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
