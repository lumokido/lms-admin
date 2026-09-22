'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { ContentStatus } from '@/types/lms';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const { addVideo, instructors } = useLMS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState(instructors[0]?.name || 'Dr. Sarah Jenkins');
  const [duration, setDuration] = useState('30:00');
  const [category, setCategory] = useState('Development');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const thumbnail = 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80';

    addVideo({
      title,
      description,
      instructor,
      duration,
      category,
      videoUrl: videoUrl || 'https://www.youtube.com/watch?v=demo',
      status,
      thumbnail,
    });

    setTitle('');
    setDescription('');
    setVideoUrl('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Video Lesson"
      description="Add a new video tutorial or lecture stream to the library."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Video Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js 16 Server Components In Depth"
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key concepts covered in this video lecture..."
            className="w-full glass-input px-3 py-2 rounded-lg text-xs border-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (mm:ss)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 42:15"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="Development">Development</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Video Stream URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or MP4 link"
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            Save Video
          </button>
        </div>
      </form>
    </Modal>
  );
}
