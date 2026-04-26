import React from "react";

interface ChevronDownIconProps {
  className?: string;
}

export default function ChevronDownIcon({ className = "w-4 h-4" }: ChevronDownIconProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
