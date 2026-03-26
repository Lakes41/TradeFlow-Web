import React from 'react';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  balance: string;
  placeholder?: string;
}

/**
 * A numerical input component for tokens featuring a "Max" button to 
 * quickly populate the user's full balance.
 */
const TokenInput: React.FC<TokenInputProps> = ({ value, onChange, balance, placeholder = "0.0" }) => {
  return (
    <div className="relative flex items-center w-full">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-14 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
      />
      <button
        type="button"
        onClick={() => onChange(balance)}
        className="absolute right-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 px-1.5 py-0.5 rounded cursor-pointer"
      >
        MAX
      </button>
    </div>
  );
};

export default TokenInput;