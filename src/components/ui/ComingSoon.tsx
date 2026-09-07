'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LucideIcon, Bell, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  moduleName: string;
  badge: string;
  description: string;
  icon: LucideIcon;
  plannedFeatures: string[];
  targetQuarter: string;
}

export function ComingSoon({
  moduleName,
  badge,
  description,
  icon: Icon,
  plannedFeatures,
  targetQuarter,
}: ComingSoonProps) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
      </Link>

      {/* Main card */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-16 w-80 h-80 rounded-full bg-sky-100/50 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 mb-5 shadow-xs">
          <Icon className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
            {badge}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            Planned for {targetQuarter}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
          {moduleName}
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-3 leading-relaxed">
          {description}
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 pt-8 border-t border-slate-100 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Architecture & Roadmap Highlights</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plannedFeatures.map((feat, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/50 border border-sky-100/80 text-xs font-medium text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notification subscribe box */}
        <div className="mt-8 max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 text-left">
            <span className="text-xs font-bold text-slate-800 block">Get Early Access Alert</span>
            <span className="text-[11px] text-slate-500">We will notify administrators on release.</span>
          </div>
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              subscribed
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs'
            }`}
          >
            {subscribed ? 'Subscribed ✓' : 'Notify Me'}
          </button>
        </div>
      </div>
    </div>
  );
}
