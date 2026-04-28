import React from 'react';

interface EmptyStateProps {
  /** The main title for the empty state. */
  title: string;
  /** A more detailed description. */
  description: string;
  /** The SVG icon or illustration component. */
  icon: React.ReactNode;
  /** An optional call-to-action element, like a button. */
  callToAction?: React.ReactNode;
}

/**
 * A reusable component for displaying empty states in the application.
 * It's designed to be used when a list, table, or content area has no data to show.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  callToAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
      <div className="text-slate-400 dark:text-slate-600">{icon}</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {callToAction && <div className="pt-4">{callToAction}</div>}
    </div>
  );
};
// Inconsequential change for repo health
