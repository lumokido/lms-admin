'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLMS } from '@/context/LMSContext';
import {
  LayoutDashboard,
  Newspaper,
  Video,
  BookOpen,
  GraduationCap,
  Tv,
  UserCheck,
  FileQuestion,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { blogs, videos, books } = useLMS();
  const [collapsed, setCollapsed] = useState(false);

  // Active Modules
  const activeNavItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Blogs', href: '/blogs', icon: Newspaper, count: blogs.length },
    { label: 'Videos', href: '/videos', icon: Video, count: videos.length },
    { label: 'Books', href: '/books', icon: BookOpen, count: books.length },
  ];

  // Coming Soon Modules
  const comingSoonItems = [
    { label: 'Teachers', href: '/teachers', icon: GraduationCap },
    { label: 'Online Classes', href: '/online-classes', icon: Tv },
    { label: 'Attendance', href: '/attendance', icon: UserCheck },
    { label: 'Examination', href: '/examinations', icon: FileQuestion },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
         
          {!collapsed && (
         <img src="/image.png" alt="" />
          )}
        </Link>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {/* Active Content Section */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {!collapsed ? 'Content Library' : '•••'}
          </div>

          {activeNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!collapsed && item.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'text-white/90 bg-white/20' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            {!collapsed ? 'Future Modules' : '•••'}
          </div>

          {comingSoonItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title={collapsed ? `${item.label} (Coming Soon)` : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!collapsed && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* System section */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              pathname === '/settings'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>

      {/* Footer Banner */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Curriculum Engine</span>
          </div>
          <p className="text-[11px] text-sky-700/80 mt-1 leading-relaxed">
            Auto-generate syllabus & quiz modules with Lumokido AI.
          </p>
        </div>
      )}

      {/* User / Session pill */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Admin"
            className="w-8 h-8 rounded-lg object-cover border border-sky-300 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Vaishnavi (Admin)</p>
              <p className="text-[10px] text-slate-500 truncate">vaishnavi@lumokido.in</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
