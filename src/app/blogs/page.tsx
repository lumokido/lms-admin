'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { BlogArticle } from '@/types/lms';
import { Badge } from '@/components/ui/Badge';
import { BlogModal } from '@/components/ui/BlogModal';
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
} from 'lucide-react';

export default function BlogsPage() {
  const { blogs, deleteBlog, toggleBlogStatus, globalSearch } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [modalOpen, setModalOpen] = useState(false);

  const categories = ['All', 'Development', 'Data & AI', 'Design', 'Business'];

  const effectiveSearch = searchQuery || globalSearch;
  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      effectiveSearch === '' ||
      b.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Articles & Blogs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational articles, tech blogs, and academic tutorials for learners.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
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
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
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
      {filteredBlogs.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl bg-white border border-slate-200 text-center">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No blog articles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or write your first article.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
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
                <div className="absolute bottom-3 right-3 text-[11px] font-bold text-slate-800 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>{blog.readTime}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-sky-600">{blog.category}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                      {blog.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBlogStatus(blog.id)}
                      title={blog.status === 'published' ? 'Move to Draft' : 'Publish Article'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {blog.status === 'published' ? (
                        <FileEdit className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
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
                    <td className="py-3 px-4 font-bold text-slate-900">{blog.title}</td>
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
                        <button
                          onClick={() => toggleBlogStatus(blog.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
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

      {/* Blog Modal */}
      <BlogModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
