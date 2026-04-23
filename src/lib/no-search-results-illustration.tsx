port React from 'react';

/**
 * SVG Illustration for when a search yields no results.
 * Inherits color from parent for dark/light mode compatibility.
 */
export const NoSearchResultsIllustration = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="13" y1="9" x2="9" y2="13" />
    <line x1="9" y1="9" x2="13" y2="13" />
  </svg>
);