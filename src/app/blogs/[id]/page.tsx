'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, BlogItem, CommentItem } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLMS } from '@/context/LMSContext';
import { Badge } from '@/components/ui/Badge';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Shield,
  CornerDownRight,
  Share2,
} from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useLMS();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingBlog, setIsDeletingBlog] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Admin reply / comment state
  const [adminCommentContent, setAdminCommentContent] = useState('');
  const [isSubmittingAdminComment, setIsSubmittingAdminComment] = useState(false);
  const [commentSearch, setCommentSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const article = await api.blogs.getById(resolvedParams.id, false);
        setBlog(article);
        if (article.comments && article.comments.length > 0) {
          setComments(article.comments);
        } else {
          const fetchedComments = await api.comments.getByBlogId(article.id);
          setComments(fetchedComments);
        }
      } catch (err: any) {
        showToast({
          type: 'error',
          title: 'Article Not Found',
          message: err.message || 'Could not load article.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id, showToast]);

  const handleToggleStatus = async () => {
    if (!blog) return;
    setIsTogglingStatus(true);
    try {
      const updated = await api.blogs.toggleStatus(blog.id);
      setBlog((prev) => (prev ? { ...prev, status: updated.status } : null));
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `Article status changed to ${updated.status.toUpperCase()}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to toggle status.',
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blog) return;
    if (!confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeletingBlog(true);
    try {
      await api.blogs.delete(blog.id);
      showToast({
        type: 'success',
        title: 'Article Deleted',
        message: `"${blog.title}" was removed.`,
      });
      router.push('/blogs');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete article.',
      });
      setIsDeletingBlog(false);
    }
  };

  const handlePostAdminComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCommentContent.trim() || !blog) return;

    setIsSubmittingAdminComment(true);
    try {
      const authorName = user?.name ? `${user.name} (Admin)` : 'LMS Administrator';
      const authorEmail = user?.email || 'admin@lumokido.com';
      const authorAvatar =
        user?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const newComment = await api.comments.create(blog.id, {
        authorName,
        authorEmail,
        content: adminCommentContent.trim(),
        authorAvatar,
      });

      setComments((prev) => [newComment, ...prev]);
      setAdminCommentContent('');
      showToast({
        type: 'success',
        title: 'Response Posted',
        message: 'Administrator response has been recorded and published.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Post Failed',
        message: err.message || 'Could not post administrative response.',
      });
    } finally {
      setIsSubmittingAdminComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!blog) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.comments.delete(blog.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast({
        type: 'info',
        title: 'Comment Moderated',
        message: 'The comment was removed successfully.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Moderation Failed',
        message: err.message || 'Failed to remove comment.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading admin article overview...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="glass-panel p-16 rounded-3xl bg-white border border-slate-200 text-center max-w-xl mx-auto mt-10 shadow-xs">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Article not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested article could not be located in the database.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  const filteredComments = comments.filter((c) => {
    if (!commentSearch) return true;
    const q = commentSearch.toLowerCase();
    return (
      c.authorName.toLowerCase().includes(q) ||
      c.authorEmail.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Admin Action Bar */}
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                Admin Article View
              </span>
              <span className="text-slate-300">•</span>
              <Badge variant={blog.status === 'published' ? 'success' : 'neutral'} dot>
                {blog.status.toUpperCase()}
              </Badge>
              <Badge variant="info">{blog.category}</Badge>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5 line-clamp-1">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Action Controls for Admin */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Edit Button */}
          <Link
            href={`/blogs/${blog.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all"
            title="Edit Article"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </Link>

          {/* Toggle Status */}
          <button
            type="button"
            disabled={isTogglingStatus}
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              blog.status === 'published'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Toggle published status"
          >
            {isTogglingStatus ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{blog.status === 'published' ? 'Switch to Draft' : 'Publish Article'}</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            disabled={isDeletingBlog}
            onClick={handleDeleteBlog}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Article"
          >
            {isDeletingBlog ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Admin KPI & Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Views</p>
            <p className="text-base font-bold text-slate-900">{blog.views.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Comments</p>
            <p className="text-base font-bold text-slate-900">{comments.length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Read Time</p>
            <p className="text-base font-bold text-slate-900">{blog.readTime}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Publish Date</p>
            <p className="text-xs font-bold text-slate-900 truncate">{blog.publishedAt || 'Recent'}</p>
          </div>
        </div>
      </div>

      {/* Article Preview Card */}
      <div className="glass-panel rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover Image Banner */}
        {blog.coverImage && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-500 text-[10px] font-bold tracking-wide uppercase mb-2">
                {blog.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">
                {blog.title}
              </h2>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Author info & Excerpt */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={blog.authorAvatar}
                alt={blog.author}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 ring-2 ring-sky-50"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{blog.author}</p>
                <p className="text-[11px] text-slate-400">Content Contributor / Educator</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-3">
              <span>Slug: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">{blog.slug}</code></span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
            <span className="font-bold text-sky-900">Summary: </span>
            {blog.excerpt}
          </div>

          {/* Article Full Markdown / Body */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-2xs">
            <MarkdownRenderer content={blog.content} />
          </div>
        </div>
      </div>

      {/* Admin Comment Section & Moderation Hub */}
      <section className="space-y-4 pt-4">
        {/* Section Header */}
        <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Comment Moderation & Reader Discussions
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {comments.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Review reader thoughts, moderate inappropriate remarks, and post official administrator responses.
              </p>
            </div>
          </div>

          {/* Comment Search */}
          {comments.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                placeholder="Filter comments..."
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>
          )}
        </div>

        {/* Post as Administrator Card */}
        <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-white via-sky-50/20 to-sky-50/40 border border-sky-100 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
              <Shield className="w-4 h-4 text-sky-600" />
              <span>Post Official Administrator Response</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Posting as: <strong className="text-slate-800">{user?.name || 'Administrator'}</strong>
            </span>
          </div>

          <form onSubmit={handlePostAdminComment} className="space-y-3">
            <textarea
              required
              rows={3}
              value={adminCommentContent}
              onChange={(e) => setAdminCommentContent(e.target.value)}
              placeholder="Write an official administrator reply, update, or pinned reader announcement..."
              className="w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 p-3.5 rounded-xl text-xs text-slate-800 outline-none transition-all resize-y shadow-2xs"
            />

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Administrator comments will be stamped with an official verified badge.
              </p>

              <button
                type="submit"
                disabled={isSubmittingAdminComment || !adminCommentContent.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAdminComment ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Administrator Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List for Admin Moderation */}
        <div className="space-y-3">
          {filteredComments.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">No comments found</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                {comments.length === 0
                  ? 'No learner or visitor comments have been posted for this article yet. Feedback will appear here for administrative moderation.'
                  : 'No comments matching your search filter.'}
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const isAdminAuthor =
                comment.authorName.toLowerCase().includes('admin') ||
                comment.authorEmail.toLowerCase().includes('admin');

              return (
                <div
                  key={comment.id}
                  className={`glass-panel p-4 sm:p-5 rounded-2xl bg-white border transition-all space-y-3 ${
                    isAdminAuthor ? 'border-sky-200 shadow-xs' : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          comment.authorAvatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {comment.authorName}
                          </span>
                          {isAdminAuthor && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Admin</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>{comment.authorEmail}</span>
                          <span>•</span>
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Moderation Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Moderate / Delete this comment"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pl-11 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
