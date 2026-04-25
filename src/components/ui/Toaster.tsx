'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      offset={24}
      closeButton
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-tradeflow-secondary group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-tradeflow-muted group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl',
          title: 'text-sm font-semibold',
          description: 'group-[.toast]:text-slate-300/80 text-sm',
          actionButton:
            'group-[.toast]:bg-tradeflow-accent group-[.toast]:text-white group-[.toast]:rounded-xl',
          cancelButton:
            'group-[.toast]:bg-slate-700/60 group-[.toast]:text-slate-200 group-[.toast]:rounded-xl',
        },
      }}
    />
  );
}