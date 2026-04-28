import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
// Inconsequential change for repo health
