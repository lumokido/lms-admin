'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLMS } from '@/context/LMSContext';
import { api, BlogItem } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import {
  Newspaper,
  Plus,
  Search,
  Eye,
  Clock,
  Trash2,
  CheckCircle,
  FileEdit,
  LayoutGrid,
  List,
  BookOpen,
  Loader2,
  RefreshCw,
  MessageSquare,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function BlogsPage() {
  const { globalSearch, showToast } = useLMS();

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = ['All', 'Development', 'Data & AI', 'Design', 'Business'];

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.blogs.getAll();
      setBlogs(data);
    } catch (err: any) {
      console.error('Failed to fetch blogs from backend:', err);
      showToast({
        type: 'error',
        title: 'Backend Connection',
        message: 'Could not fetch live articles. Make sure lms-backend is running on port 4000.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.blogs.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast({
        type: 'success',
        title: 'Article Deleted',
        message: `"${title}" was removed successfully.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Failed to delete article.',
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await api.blogs.toggleStatus(id);
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b)));
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `Article status changed to ${updated.status}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to toggle status.',
      });
    }
  };

  const effectiveSearch = searchQuery || globalSearch;
  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      effectiveSearch === '' ||
      b.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // KPI Metrics
  const totalArticles = blogs.length;
  const publishedArticles = blogs.filter((b) => b.status === 'published').length;
  const draftArticles = blogs.filter((b) => b.status === 'draft').length;
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Articles & Blogs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage, compose, publish, and moderate educational articles and learner discussions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchBlogs}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
            title="Refresh articles"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Dedicated New Blog Page Button (No modal dialog!) */}
          <Link
            href="/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Articles</p>
            <p className="text-lg font-bold text-slate-900">{totalArticles}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Published</p>
            <p className="text-lg font-bold text-slate-900">{publishedArticles}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Drafts</p>
            <p className="text-lg font-bold text-slate-900">{draftArticles}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Views</p>
            <p className="text-lg font-bold text-slate-900">{totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
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

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading articles from backend...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No blog articles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or write a new educational article.
          </p>
          <Link
            href="/blogs/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 cursor-pointer shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50 transition-all"
            >
              {/* Cover Image & Badges */}
              <Link href={`/blogs/${blog.id}`} className="relative h-44 w-full overflow-hidden bg-slate-100 block">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant={blog.status === 'published' ? 'success' : 'neutral'} dot>
                    {blog.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 text-[11px] font-bold text-slate-800 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>{blog.readTime}</span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wide">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${blog.id}`}
                    className="block font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2"
                  >
                    {blog.title}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Card Footer: Author + Admin Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
                      {blog.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Admin View & Comment Moderation link */}
                    <Link
                      href={`/blogs/${blog.id}`}
                      title="Admin Overview & Comments"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>

                    {/* Dedicated Edit Page link (No modal!) */}
                    <Link
                      href={`/blogs/${blog.id}/edit`}
                      title="Edit Article on dedicated page"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <FileEdit className="w-4 h-4" />
                    </Link>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(blog.id)}
                      title={blog.status === 'published' ? 'Switch to Draft' : 'Publish Article'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          blog.status === 'published' ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      title="Delete Article"
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
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-sky-50/50">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                      >
                        {blog.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{blog.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{blog.author}</td>
                    <td className="py-3 px-4">
                      <Badge variant={blog.status === 'published' ? 'success' : 'neutral'} dot>
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{blog.publishedAt}</td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{blog.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/blogs/${blog.id}`}
                          title="Admin Overview & Comments"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/blogs/${blog.id}/edit`}
                          title="Edit Article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(blog.id)}
                          title="Toggle Status"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              blog.status === 'published' ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          title="Delete Article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
