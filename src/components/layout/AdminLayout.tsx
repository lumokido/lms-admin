'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ToastContainer } from '../ui/Toast';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
