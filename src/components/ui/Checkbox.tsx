"use client";

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, className = '' }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`w-4 h-4 rounded border-tradeflow-muted bg-tradeflow-dark text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer ${className}`}
    />
  );
};

export default Checkbox;

// Inconsequential change for repo health
