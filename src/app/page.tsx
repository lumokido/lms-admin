'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/LMSContext';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { BlogModal } from '@/components/ui/BlogModal';
import { VideoModal } from '@/components/ui/VideoModal';
import { BookModal } from '@/components/ui/BookModal';
import {
  Newspaper,
  Video,
  BookOpen,
  Eye,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  GraduationCap,
  Tv,
  UserCheck,
  FileQuestion,
  Briefcase,
} from 'lucide-react';

export default function DashboardPage() {
  const { blogs, videos, books, activities } = useLMS();

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  // Aggregates
  const publishedBlogs = blogs.filter((b) => b.status === 'published');
  const publishedVideos = videos.filter((v) => v.status === 'published');
  const publishedBooks = books.filter((bk) => bk.status === 'published');

  const totalArticleViews = blogs.reduce((acc, b) => acc + b.views, 0);
  const totalVideoViews = videos.reduce((acc, v) => acc + v.views, 0);
  const totalBookDownloads = books.reduce((acc, bk) => acc + bk.downloads, 0);

  const comingSoonItems = [
    { name: 'Teachers', href: '/teachers', icon: GraduationCap, desc: 'Faculty directory, workloads & payouts' },
    { name: 'Online Classes', href: '/online-classes', icon: Tv, desc: 'Live HD video webinars & whiteboards' },
    { name: 'Attendance', href: '/attendance', icon: UserCheck, desc: 'Roll-call, biometric & QR check-in' },
    { name: 'Examinations', href: '/examinations', icon: FileQuestion, desc: 'Timed quizzes & AI proctored tests' },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, desc: 'Campus placement & employer hiring' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 mb-1">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Academic Term 2025–2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            LMS Content & Knowledge Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage your core educational resources: Articles & Blogs, Video Lectures, and Digital Library Books.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBlogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5 text-sky-600" />
            <span>New Blog</span>
          </button>
          <button
            onClick={() => setVideoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-sky-600" />
            <span>Upload Video</span>
          </button>
          <button
            onClick={() => setBookModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Primary KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Published Blogs"
          value={publishedBlogs.length}
          change="+3 this month"
          trend="up"
          period="articles"
          icon={Newspaper}
        />
        <StatCard
          title="Video Lessons"
          value={publishedVideos.length}
          change="+2 new"
          trend="up"
          period="lectures"
          icon={Video}
        />
        <StatCard
          title="Digital Books"
          value={publishedBooks.length}
          change="Study library"
          trend="neutral"
          period="resources"
          icon={BookOpen}
        />
        <StatCard
          title="Total Resource Views"
          value={(totalArticleViews + totalVideoViews).toLocaleString()}
          change="+34%"
          trend="up"
          period="learner reads & watches"
          icon={Eye}
        />
      </div>

      {/* Future Modules Roadmaps Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-sky-50/70 via-white to-blue-50/70 border border-sky-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Future Modules — Coming Soon</h2>
              <p className="text-xs text-slate-500">
                These modules are planned for rollout in upcoming releases.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
            In Active Development
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {comingSoonItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Soon
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Latest Articles & Video Library */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Blogs */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Latest Articles</h2>
              <p className="text-xs text-slate-500">Educational blogs & tutorials published</p>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-sky-50/50 transition-colors border border-transparent hover:border-sky-100"
              >
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{blog.category}</Badge>
                    <span className="text-[11px] text-slate-400 font-medium">{blog.readTime}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{blog.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{blog.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Lectures */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Featured Video Lectures</h2>
              <p className="text-xs text-slate-500">On-demand video sessions for students</p>
            </div>
            <Link
              href="/videos"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {videos.slice(0, 3).map((vid) => (
              <div
                key={vid.id}
                className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-sky-50/50 transition-colors border border-transparent hover:border-sky-100"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{vid.category}</Badge>
                    <span className="text-[11px] text-slate-400 font-medium">{vid.duration}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{vid.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Instructor: {vid.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BlogModal isOpen={blogModalOpen} onClose={() => setBlogModalOpen(false)} />
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
      <BookModal isOpen={bookModalOpen} onClose={() => setBookModalOpen(false)} />
    </div>
  );
}
