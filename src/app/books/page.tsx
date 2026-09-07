'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { BookResource } from '@/types/lms';
import { Badge } from '@/components/ui/Badge';
import { BookModal } from '@/components/ui/BookModal';
import {
  BookOpen,
  Plus,
  Search,
  Download,
  FileText,
  Trash2,
  CheckCircle,
  FileEdit,
} from 'lucide-react';

export default function BooksPage() {
  const { books, deleteBook, toggleBookStatus, globalSearch, showToast } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const categories = ['All', 'Development', 'Data & AI', 'Design'];

  const effectiveSearch = searchQuery || globalSearch;
  const filteredBooks = books.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      effectiveSearch === '' ||
      b.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (book: BookResource) => {
    showToast({
      type: 'info',
      title: 'Preparing Download',
      message: `Downloading "${book.title}" (${book.format} • ${book.fileSize})...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Digital Books & Library</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage electronic textbooks, course reference guides, and PDF reading materials.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
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
            placeholder="Search books or authors..."
            className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl bg-white border border-slate-200 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No books found in library</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload digital textbooks and reading resources for enrolled students.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50"
            >
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200 bg-slate-100">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Badge variant={book.status === 'published' ? 'success' : 'neutral'} dot>
                    {book.status.toUpperCase()}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 truncate">
                    By {book.author}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                      {book.format}
                    </span>
                    <span>{book.pages} pages</span>
                    <span>•</span>
                    <span>{book.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Downloads telemetry */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  {book.downloads.toLocaleString()} student downloads
                </span>
                <span className="font-semibold text-slate-700">{book.category}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleDownload(book)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Read / Download
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBookStatus(book.id)}
                    title={book.status === 'published' ? 'Move to Draft' : 'Publish Book'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {book.status === 'published' ? (
                      <FileEdit className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    title="Delete Book"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Modal */}
      <BookModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
