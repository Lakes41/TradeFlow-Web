"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs, getPageTitle } from '../lib/breadcrumbs';
import Breadcrumbs from './Breadcrumbs';

interface StickyHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function StickyHeader({ title, subtitle, actions }: StickyHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const generatedTitle = getPageTitle(breadcrumbs);
  const headerTitle = title || generatedTitle;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <div className="mb-2">
              <Breadcrumbs />
            </div>

            {/* Page Title and Subtitle */}
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white truncate">
                  {headerTitle}
                </h1>
                {subtitle && (
                  <p className="text-slate-400 text-sm mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Header Actions */}
          {actions && (
            <div className="flex items-center gap-4 ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Inconsequential change for repo health
