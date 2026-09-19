'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ToastContainer } from '../ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const isLoginPage = pathname === '/login';
  const isReaderPage = pathname.startsWith('/blogs/') && pathname !== '/blogs';

  useEffect(() => {
    // If not loading and not authenticated, and trying to access an admin-only page
    if (!isLoading && !isAuthenticated && !isLoginPage && !isReaderPage) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, isReaderPage, router]);

  // If on login page, don't show the admin sidebar or top navbar
  if (isLoginPage) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  // Show loading skeleton while verifying auth for admin pages
  if (isLoading && !isReaderPage) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-2" />
        <span className="text-xs font-semibold text-slate-500">Checking authorization...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
