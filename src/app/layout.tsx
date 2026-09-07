import type { Metadata } from 'next';
import './globals.css';
import { LMSProvider } from '@/context/LMSContext';
import { AdminLayout } from '@/components/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Lumokido LMS Admin | Learning Management Portal',
  description: 'Clean White and Light Blue LMS Admin Portal for managing courses, students, instructors, grading, and curriculum analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] text-slate-900">
        <LMSProvider>
          <AdminLayout>{children}</AdminLayout>
        </LMSProvider>
      </body>
    </html>
  );
}
