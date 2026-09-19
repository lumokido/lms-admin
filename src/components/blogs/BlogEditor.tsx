'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, BlogItem } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLMS } from '@/context/LMSContext';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit3,
  Image as ImageIcon,
  Clock,
  User,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link2,
  Columns,
  X,
  Calendar,
  MessageSquare,
  Shield,
  FileText,
} from 'lucide-react';

interface BlogEditorProps {
  mode: 'create' | 'edit';
  blogId?: string;
}

const CATEGORIES = [
  'Development',
  'Data & AI',
  'Design',
  'Business',
  'Cybersecurity',
  'Cloud Computing',
];

const PRESET_COVERS = [
  {
    name: 'Modern Tech',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Data Science',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'AI & Neural',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'UI/UX Design',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coding Desk',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
  },
];

export function BlogEditor({ mode, blogId }: BlogEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { instructors, showToast } = useLMS();

  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  
  // Editor tabs: 'write' | 'split' | 'preview'
  const [activeTab, setActiveTab] = useState<'write' | 'split' | 'preview'>('write');
  
  // Full screen article preview modal
  const [showFullArticlePreview, setShowFullArticlePreview] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Development');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [imageError, setImageError] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [existingBlog, setExistingBlog] = useState<BlogItem | null>(null);

  // Set default author when auth loads
  useEffect(() => {
    if (mode === 'create' && !author) {
      setAuthor(user?.name || instructors[0]?.name || 'LMS Administrator');
    }
  }, [mode, user, instructors, author]);

  // Load existing blog for edit mode
  useEffect(() => {
    if (mode === 'edit' && blogId) {
      async function loadBlog() {
        setIsLoading(true);
        try {
          const data = await api.blogs.getById(blogId, false);
          setExistingBlog(data);
          setTitle(data.title || '');
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setCategory(data.category || 'Development');
          setAuthor(data.author || user?.name || 'LMS Administrator');
          setReadTime(data.readTime || '5 min read');
          setCoverImage(data.coverImage || PRESET_COVERS[0].url);
          setImageError(false);
          setStatus(data.status || 'published');
        } catch (err: any) {
          showToast({
            type: 'error',
            title: 'Failed to load article',
            message: err.message || 'Article could not be found.',
          });
          router.push('/blogs');
        } finally {
          setIsLoading(false);
        }
      }
      loadBlog();
    }
  }, [mode, blogId, showToast, router, user?.name]);

  // Auto-calculate read time when content changes
  const calculateReadTime = () => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const calculated = `${minutes} min read`;
    setReadTime(calculated);
    showToast({
      type: 'info',
      title: 'Read Time Calculated',
      message: `Estimated ${calculated} based on ${words} words.`,
    });
  };

  // Helper to insert markdown syntax into the content textarea
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleSave = async (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      showToast({
        type: 'error',
        title: 'Title Required',
        message: 'Please provide an article title before saving.',
      });
      return;
    }

    if (!excerpt.trim()) {
      showToast({
        type: 'error',
        title: 'Excerpt Required',
        message: 'Please provide a brief excerpt summarizing your article.',
      });
      return;
    }

    if (!content.trim()) {
      showToast({
        type: 'error',
        title: 'Content Required',
        message: 'Please write the article content body.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<BlogItem> = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        author: author.trim() || user?.name || 'LMS Administrator',
        authorAvatar:
          user?.avatar ||
          existingBlog?.authorAvatar ||
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        readTime: readTime.trim() || '5 min read',
        status: publishStatus,
        coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      };

      if (mode === 'create') {
        const created = await api.blogs.create(payload);
        showToast({
          type: 'success',
          title: 'Article Published',
          message: `"${created.title}" was successfully created as ${publishStatus}.`,
        });
        router.push(`/blogs/${created.id}`);
      } else if (mode === 'edit' && blogId) {
        const updated = await api.blogs.update(blogId, payload);
        showToast({
          type: 'success',
          title: 'Article Updated',
          message: `"${updated.title}" has been saved.`,
        });
        router.push(`/blogs/${updated.id}`);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save the article. Please check backend connection.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading article editor...</p>
      </div>
    );
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
            title="Back to Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                {mode === 'create' ? 'New Article' : 'Edit Article'}
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {title.trim() ? title : mode === 'create' ? 'Untitled Article' : 'Edit Article'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Full Page Article Preview Button */}
          <button
            type="button"
            onClick={() => setShowFullArticlePreview(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 shadow-2xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>Preview Full Article</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{mode === 'create' ? 'Publish Article' : 'Update & Publish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Sidebar / Meta on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Main Section (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title Input Card */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Clean Architecture with NestJS & Next.js"
              className="w-full text-lg sm:text-xl font-bold text-slate-900 bg-transparent border-0 border-b border-slate-200 focus:border-sky-500 pb-2 outline-none transition-colors placeholder:font-medium placeholder:text-slate-300"
            />
          </div>

          {/* Excerpt Card */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Short Summary / Excerpt <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {excerpt.length} / 280 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a compelling 1-2 sentence preview that explains key takeaways to learners..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 p-3 rounded-xl text-xs text-slate-800 leading-relaxed outline-none transition-all resize-y"
            />
          </div>

          {/* Content Body Editor Card with Markdown Toolbar & Preview Modes */}
          <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            {/* Toolbar & View Switcher */}
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              {/* Markdown Quick Helpers */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ')}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ')}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  H3
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('```typescript\n', '\n```')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('1. ')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('[', '](https://example.com)')}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* View Switcher: Write vs Split vs Preview */}
              <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3 h-3 text-sky-600" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('split')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'split'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3 h-3 text-sky-600" />
                  <span>Split View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3 h-3 text-sky-600" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Content Area Based on Active Tab */}
            {activeTab === 'write' && (
              <div className="p-4">
                <textarea
                  id="blog-content-editor"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Compose your article here. Full Markdown is supported:
## Introduction
Explain foundational concepts...

### Architecture Highlights
- Clean separation of concerns
- Decoupled API services

```typescript
const service = new EducationService();
```"
                  className="w-full bg-white text-slate-900 font-mono text-xs leading-relaxed outline-none resize-y min-h-[380px] p-2"
                />
              </div>
            )}

            {/* Split View: Editor on Left, Real-time Formatted Markdown on Right */}
            {activeTab === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[420px]">
                <div className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                    Markdown Source
                  </div>
                  <textarea
                    id="blog-content-editor"
                    rows={18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type markdown here..."
                    className="w-full bg-white text-slate-900 font-mono text-xs leading-relaxed outline-none resize-none min-h-[360px]"
                  />
                </div>
                <div className="p-5 bg-slate-50/40 overflow-y-auto max-h-[500px]">
                  <div className="text-[10px] font-bold text-sky-600 uppercase mb-2">
                    Live Formatted Preview
                  </div>
                  <MarkdownRenderer content={content} />
                </div>
              </div>
            )}

            {/* Preview Tab: Full Width Formatted Markdown */}
            {activeTab === 'preview' && (
              <div className="p-6 sm:p-8 min-h-[380px] bg-white">
                <MarkdownRenderer content={content} />
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{content.length} characters</span>
              </div>
              <button
                type="button"
                onClick={calculateReadTime}
                className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
              >
                Recalculate Read Time ({readTime})
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Publication Status & Category Card */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Publishing Settings</span>
            </h3>

            {/* Status Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Article Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Published</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    status === 'draft'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Draft</span>
                </button>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 p-2.5 rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Read Time
                </label>
                <button
                  type="button"
                  onClick={calculateReadTime}
                  className="text-[10px] text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  Auto Calc
                </button>
              </div>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 6 min read"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 pl-8 pr-3 py-2 rounded-xl text-xs text-slate-800 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Author Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 pl-8 pr-3 py-2 rounded-xl text-xs text-slate-800 outline-none transition-all font-medium"
                />
              </div>
              {instructors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Quick pick:</span>
                  {instructors.slice(0, 3).map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => setAuthor(inst.name)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {inst.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cover Image Card (Fixed broken preview!) */}
          <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-500" />
                <span>Cover Image</span>
              </h3>
            </div>

            {/* Live Image Preview (Handles empty/error state cleanly!) */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group flex items-center justify-center">
              {coverImage.trim() && !imageError ? (
                <>
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <span className="text-white text-[11px] font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      Cover Active
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">No cover image set</p>
                  <p className="text-[10px] text-slate-400">
                    Select a preset below or enter an image URL
                  </p>
                </div>
              )}
            </div>

            {/* Custom URL Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Image Web URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setImageError(false);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 p-2 rounded-xl text-xs text-slate-800 outline-none transition-all font-mono"
              />
            </div>

            {/* Preset Image Themes */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                Preset Cover Themes
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                      setImageError(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold text-left border transition-all cursor-pointer truncate ${
                      coverImage === preset.url && !imageError
                        ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed Card Preview Widget */}
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Article Listing Card Preview
            </span>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-sky-600 uppercase">
                <span>{category}</span>
                <span className="text-slate-400 font-normal">{readTime}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                {title.trim() || 'Your Article Title'}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {excerpt.trim() || 'Your short summary preview will display here for readers.'}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                <span>By {author.trim() || 'Administrator'}</span>
                <span className="text-sky-600">Feed Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL ARTICLE PREVIEW MODAL / OVERLAY */}
      {showFullArticlePreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            {/* Modal Top Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Live Article Preview (Reader & Admin View)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    This is how the complete published article appears to learners and admins.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullArticlePreview(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              {/* Category & Status */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                  {category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {title.trim() || 'Untitled Article'}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {excerpt.trim() || 'No excerpt provided.'}
                </p>
              </div>

              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-200 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
                    {author.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{author || 'LMS Administrator'}</p>
                    <p className="text-[11px] text-slate-400">Content Author</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    {readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Today
                  </span>
                </div>
              </div>

              {/* Cover Image Banner */}
              {coverImage.trim() && !imageError && (
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Formatted Markdown Content */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <MarkdownRenderer content={content} />
              </div>

              {/* Reader Comments Mockup */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <MessageSquare className="w-4 h-4 text-sky-500" />
                  <span>Comments Section (Live on Published Article)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  Readers will be able to comment on this article, and administrators can moderate and reply.
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Looks good? Publish or continue editing.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFullArticlePreview(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Back to Editor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFullArticlePreview(false);
                    handleSave(status);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
