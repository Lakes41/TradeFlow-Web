"use client";

import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onValueChange, className = '' }) => {
  const [isDragging, setIsDragging] = React.useState<'min' | 'max' | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, handle: 'min' | 'max') => {
    setIsDragging(handle);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;

      const newValueArray = [...value];
      if (isDragging === 'min') {
        newValueArray[0] = Math.min(steppedValue, value[1] - step);
      } else {
        newValueArray[1] = Math.max(steppedValue, value[0] + step);
      }
      onValueChange(newValueArray);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, value, onValueChange]);

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div ref={sliderRef} className={`relative h-6 ${className}`}>
      {/* Track */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-tradeflow-muted rounded-full -translate-y-1/2" />
      
      {/* Active Range */}
      <div
        className="absolute top-1/2 h-2 bg-blue-500 rounded-full -translate-y-1/2"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />

      {/* Min Handle */}
      <div
        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform"
        style={{ left: `${minPercent}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'min')}
      />

      {/* Max Handle */}
      <div
        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform"
        style={{ left: `${maxPercent}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'max')}
      />
    </div>
  );
};

export default Slider;

// Inconsequential change for repo health
