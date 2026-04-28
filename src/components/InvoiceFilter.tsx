"use client";

import React from 'react';
import { Slider } from './ui/Slider';
import { Checkbox } from './ui/Checkbox';

export interface InvoiceFilters {
  minApy: number;
  maxApy: number;
  tiers: string[];
}

interface InvoiceFilterProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
}

const RISK_TIERS = ['A', 'B', 'C', 'D'] as const;

const InvoiceFilter: React.FC<InvoiceFilterProps> = ({ filters, onFiltersChange }) => {
  const handleApyChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minApy: values[0],
      maxApy: values[1],
    });
  };

  const handleTierToggle = (tier: string) => {
    const newTiers = filters.tiers.includes(tier)
      ? filters.tiers.filter((t) => t !== tier)
      : [...filters.tiers, tier];
    
    onFiltersChange({
      ...filters,
      tiers: newTiers,
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'C': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'D': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        {/* APY Range Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-tradeflow-muted">APY Range</label>
            <span className="text-sm text-blue-400 font-medium">
              {filters.minApy}% - {filters.maxApy}%
            </span>
          </div>
          <Slider
            min={0}
            max={25}
            step={0.5}
            value={[filters.minApy, filters.maxApy]}
            onValueChange={handleApyChange}
            className="w-full"
          />
        </div>

        {/* Risk Tier Checkboxes */}
        <div>
          <label className="text-sm font-medium text-tradeflow-muted mb-3 block">
            Risk Tiers
          </label>
          <div className="flex flex-wrap gap-3">
            {RISK_TIERS.map((tier) => (
              <label
                key={tier}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  filters.tiers.includes(tier)
                    ? getTierColor(tier)
                    : 'bg-tradeflow-dark/50 text-tradeflow-muted border-tradeflow-muted/30 hover:border-tradeflow-muted/50'
                }`}
              >
                <Checkbox
                  checked={filters.tiers.includes(tier)}
                  onChange={() => handleTierToggle(tier)}
                  className="pointer-events-none"
                />
                <span className="font-medium">Tier {tier}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {filters.tiers.length > 0 || filters.minApy > 0 || filters.maxApy < 25 && (
        <button
          onClick={() => onFiltersChange({ minApy: 0, maxApy: 25, tiers: [] })}
          className="text-sm text-tradeflow-muted hover:text-white transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default InvoiceFilter;

// Inconsequential change for repo health
