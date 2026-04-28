"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  date: string;
  price: number;
}

const hardcodedData: PriceData[] = [
  { date: 'Mon', price: 0.082 },
  { date: 'Tue', price: 0.085 },
  { date: 'Wed', price: 0.083 },
  { date: 'Thu', price: 0.087 },
  { date: 'Fri', price: 0.089 },
  { date: 'Sat', price: 0.086 },
  { date: 'Sun', price: 0.091 },
];

export default function PriceChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={hardcodedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 0.005', 'dataMax + 0.005']}
            tickFormatter={(value) => `$${value.toFixed(3)}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`$${value.toFixed(3)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Inconsequential change for repo health
