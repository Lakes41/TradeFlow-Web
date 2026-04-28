"use client";

import React from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  end,
  duration = 1.5,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = ""
}: AnimatedCounterProps) {
  return (
    <CountUp
      end={end}
      duration={duration}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      className={className}
      start={0}
      enableScrollSpy={false}
      scrollSpyOnce={true}
    />
  );
}

// Inconsequential change for repo health
