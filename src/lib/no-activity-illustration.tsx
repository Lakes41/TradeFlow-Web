import React from 'react';

/**
 * SVG Illustration for when there is no activity or transaction history.
 * Inherits color from parent for dark/light mode compatibility.
 */
export const NoActivityIllustration = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="M7 12h10" />
  </svg>
);