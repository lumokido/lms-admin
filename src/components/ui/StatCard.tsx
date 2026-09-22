import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  period?: string;
  icon: LucideIcon;
  colorScheme?: 'indigo' | 'emerald' | 'violet' | 'amber' | 'cyan';
}

export function StatCard({
  title,
  value,
  change,
  trend = 'up',
  period = 'vs last month',
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group glass-card p-6 rounded-2xl relative overflow-hidden bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-200">
      {/* Background soft ambient tint */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 rounded-full bg-sky-100/40 blur-xl group-hover:bg-sky-200/50 transition-all" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className="p-2.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-600 transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</h3>
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              trend === 'up'
                ? 'text-emerald-600'
                : trend === 'down'
                ? 'text-rose-600'
                : 'text-slate-600'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
          <span className="text-slate-400 font-medium">{period}</span>
        </div>
      )}
    </div>
  );
}
