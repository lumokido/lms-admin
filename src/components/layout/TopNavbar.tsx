'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import {
  Search,
  Bell,
  Plus,
  Newspaper,
  Video,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { BlogModal } from '../ui/BlogModal';
import { VideoModal } from '../ui/VideoModal';
import { BookModal } from '../ui/BookModal';

export function TopNavbar() {
  const { globalSearch, setGlobalSearch, activities, settings } = useLMS();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
        {/* Global Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search blogs, videos, books, topics..."
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 pl-9 pr-4 py-1.5 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Institution badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] text-sky-800">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-semibold">{settings.organizationName}</span>
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>

            {showCreateMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreateMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      setBlogModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 text-left transition-colors cursor-pointer"
                  >
                    <Newspaper className="w-4 h-4 text-sky-600" />
                    <span>New Article</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      setVideoModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 text-left transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>Upload Video</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      setBookModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 text-left transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Add Book</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
                    <span className="text-xs font-bold text-slate-800">System Activity</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                      Live
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="p-3 hover:bg-sky-50/60 transition-colors">
                        <p className="text-xs font-semibold text-slate-800">{act.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{act.description}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{act.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <BlogModal isOpen={blogModalOpen} onClose={() => setBlogModalOpen(false)} />
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
      <BookModal isOpen={bookModalOpen} onClose={() => setBookModalOpen(false)} />
    </>
  );
}
