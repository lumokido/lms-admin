'use client';

import React from 'react';
import { useLMS } from '@/context/LMSContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useLMS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let borderColor = 'border-emerald-200';
        let bgStyle = 'bg-white border-l-4 border-l-emerald-500';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          borderColor = 'border-rose-200';
          bgStyle = 'bg-white border-l-4 border-l-rose-500';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-600 shrink-0" />;
          borderColor = 'border-sky-200';
          bgStyle = 'bg-white border-l-4 border-l-sky-500';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          borderColor = 'border-amber-200';
          bgStyle = 'bg-white border-l-4 border-l-amber-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-200 shadow-xl ${bgStyle} transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
