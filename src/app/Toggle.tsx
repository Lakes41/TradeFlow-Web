import React from "react";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function Toggle({ isOn, onToggle, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        disabled 
          ? "bg-slate-800 cursor-not-allowed opacity-50" 
          : isOn 
            ? "bg-blue-600" 
            : "bg-slate-700"
      }`}
      role="switch"
      aria-checked={isOn}
      aria-disabled={disabled}
    >
      <span
        className={`${
          isOn ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          disabled ? "bg-slate-600" : "bg-white"
        }`}
      />
    </button>
  );
}