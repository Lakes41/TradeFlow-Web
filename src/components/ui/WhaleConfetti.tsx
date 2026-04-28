"use client";

import React from 'react';
import Confetti from 'react-confetti';

interface WhaleConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function WhaleConfetti({ isActive, onComplete }: WhaleConfettiProps) {
  if (!isActive) return null;

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={800}
      recycle={false}
      colors={['#22c55e', '#3b82f6', '#eab308', '#ec4899', '#a855f7']}
      gravity={0.15}
      tweenDuration={8000}
      onConfettiComplete={() => {
        if (onComplete) onComplete();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    />
  );
}
// Inconsequential change for repo health
