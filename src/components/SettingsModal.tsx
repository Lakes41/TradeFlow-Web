"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Card from './Card';
import { useSlippage } from '../contexts/SlippageContext';
import { useExpertMode } from '../contexts/ExpertModeContext';
import ExpertModeModal from './ExpertModeModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { slippageTolerance, setSlippageTolerance } = useSlippage();
  const { isExpertMode, setExpertMode, hasAcceptedRisk, acceptRisk } = useExpertMode();
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  const presetOptions = [0.1, 0.5, 1.0, 3.0, 5.0];

  const handlePresetClick = (value: number) => {
    setSlippageTolerance(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setSlippageTolerance(value);
    }
  };

  const handleExpertModeToggle = () => {
    if (isExpertMode) {
      // Turning off Expert Mode doesn't require confirmation
      setExpertMode(false);
    } else {
      // Turning on Expert Mode: check if user already accepted risk
      if (hasAcceptedRisk) {
        // Bypass modal if already accepted
        setExpertMode(true);
      } else {
        // Show modal for first-time acceptance
        setIsExpertModalOpen(true);
      }
    }
  };

  const handleExpertModeConfirm = () => {
    acceptRisk();
    setExpertMode(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Expert Mode Toggle */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Expert Mode</h3>
              <p className="text-sm text-slate-400 mb-4">
                Enable advanced trading features and detailed transaction data.
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Expert Mode</span>
                <button
                  type="button"
                  onClick={handleExpertModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isExpertMode ? "bg-orange-600" : "bg-slate-700"
                    }`}
                  role="switch"
                  aria-checked={isExpertMode}
                >
                  <span
                    className={`${isExpertMode ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Slippage Tolerance */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Slippage Tolerance</h3>
              <p className="text-sm text-slate-400 mb-4">
                Your transaction will revert if the price changes unfavorably by more than this percentage
              </p>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {presetOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePresetClick(option)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${slippageTolerance === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                  >
                    {option}%
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={slippageTolerance}
                  onChange={handleCustomChange}
                  min="0"
                  max="50"
                  step="0.1"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Custom"
                />
                <span className="text-slate-400">%</span>
              </div>

              {slippageTolerance < 0.1 && (
                <p className="text-xs text-yellow-500 mt-2">
                  Your transaction may fail
                </p>
              )}
              {slippageTolerance > 5 && (
                <p className="text-xs text-red-500 mt-2">
                  High slippage tolerance may result in a bad trade
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <ExpertModeModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        onConfirm={handleExpertModeConfirm}
      />
    </>
  );
}
