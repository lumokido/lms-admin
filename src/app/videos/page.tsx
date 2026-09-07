'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { VideoLesson } from '@/types/lms';
import { Badge } from '@/components/ui/Badge';
import { VideoModal } from '@/components/ui/VideoModal';
import { Modal } from '@/components/ui/Modal';
import {
  Video,
  Plus,
  Search,
  Play,
  Clock,
  Eye,
  Trash2,
  CheckCircle,
  FileEdit,
} from 'lucide-react';

export default function VideosPage() {
  const { videos, deleteVideo, toggleVideoStatus, globalSearch } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  const categories = ['All', 'Development', 'Data & AI', 'Design'];

  const effectiveSearch = searchQuery || globalSearch;
  const filteredVideos = videos.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      effectiveSearch === '' ||
      v.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      v.instructor.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Video Lessons Library</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage video tutorials, recorded masterclasses, and on-demand streaming lectures.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos or instructors..."
            className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl bg-white border border-slate-200 text-center">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No video lessons found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload educational videos or stream links for student learning.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50"
            >
              {/* Thumbnail with Play trigger */}
              <div
                onClick={() => setActiveVideo(vid)}
                className="relative h-44 w-full overflow-hidden bg-slate-900 cursor-pointer"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-sky-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-sky-600 ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <Badge variant={vid.status === 'published' ? 'success' : 'neutral'} dot>
                    {vid.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="absolute bottom-3 right-3 text-[11px] font-bold text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{vid.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-sky-600">{vid.category}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Instructor: <strong className="text-slate-800">{vid.instructor}</strong></span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    {vid.views.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(vid)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-sky-600" /> Preview Video
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleVideoStatus(vid.id)}
                      title={vid.status === 'published' ? 'Move to Draft' : 'Publish Video'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {vid.status === 'published' ? (
                        <FileEdit className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteVideo(vid.id)}
                      title="Delete Video"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <VideoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Player Preview Modal */}
      {activeVideo && (
        <Modal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          description={`Instructor: ${activeVideo.instructor} • Duration: ${activeVideo.duration}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-200">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-40 absolute inset-0"
              />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-2xl">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Simulated HD Player Streaming</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{activeVideo.description}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
