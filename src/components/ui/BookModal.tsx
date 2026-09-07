'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { ContentStatus } from '@/types/lms';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookModal({ isOpen, onClose }: BookModalProps) {
  const { addBook } = useLMS();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Development');
  const [pages, setPages] = useState(250);
  const [format, setFormat] = useState<'PDF' | 'EPUB'>('PDF');
  const [fileSize, setFileSize] = useState('12.5 MB');
  const [status, setStatus] = useState<ContentStatus>('published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const coverImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

    addBook({
      title,
      author,
      category,
      pages: Number(pages),
      format,
      fileSize,
      status,
      coverImage,
      downloadUrl: '#',
    });

    setTitle('');
    setAuthor('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Book / Study Resource"
      description="Upload an e-book or digital study guide for student access."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Systems & Microservices Manual"
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Pages</label>
            <input
              type="number"
              min="1"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'PDF' | 'EPUB')}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">File Size</label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="e.g. 15 MB"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>
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
            Add Book
          </button>
        </div>
      </form>
    </Modal>
  );
}
