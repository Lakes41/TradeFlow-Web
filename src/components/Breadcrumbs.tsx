"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs } from '../lib/breadcrumbs';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((breadcrumb, index) => {
        const isFirst = index === 0;
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={breadcrumb.href}>
            {index > 0 && (
              <ChevronRight
                size={16}
                className="text-slate-600 shrink-0"
              />
            )}

            <div className="flex items-center gap-1">
              {isFirst && (
                <Home
                  size={16}
                  className={`${isLast ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                    } transition-colors`}
                />
              )}

              {isLast ? (
                <span className="text-blue-400 font-medium">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
