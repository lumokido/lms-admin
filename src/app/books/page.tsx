'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLMS } from '@/context/LMSContext';
import { api, BookItem, PurchaseItem } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { BookModal } from '@/components/ui/BookModal';
import { ProtectedReaderModal } from '@/components/books/ProtectedReaderModal';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  FileText,
  Trash2,
  CheckCircle,
  FileEdit,
  Loader2,
  RefreshCw,
  ShieldCheck,
  DollarSign,
  Cloud,
  ShoppingBag,
  UserCheck,
  UserX,
  CreditCard,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function BooksPage() {
  const { globalSearch, showToast } = useLMS();

  // Navigation Tabs: 'catalog' | 'purchases'
  const [activeTab, setActiveTab] = useState<'catalog' | 'purchases'>('catalog');

  // Books State
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Purchases State
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState('All');
  const [updatingAccessId, setUpdatingAccessId] = useState<string | null>(null);

  // Protected In-App Document Viewer State
  const [readerModalOpen, setReaderModalOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);

  const categories = ['All', 'Development', 'Data & AI', 'Design', 'Business', 'Engineering'];

  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    try {
      const data = await api.books.getAll();
      setBooks(data);
    } catch (err: any) {
      console.error('Failed to fetch books from backend:', err);
      showToast({
        type: 'error',
        title: 'Backend Connection',
        message: 'Could not fetch books from backend. Ensure lms-backend is running.',
      });
    } finally {
      setIsLoadingBooks(false);
    }
  }, [showToast]);

  const fetchPurchases = useCallback(async () => {
    setIsLoadingPurchases(true);
    try {
      const data = await api.purchases.getAll();
      setPurchases(data);
    } catch (err: any) {
      console.error('Failed to fetch purchases from backend:', err);
      showToast({
        type: 'error',
        title: 'Purchases Telemetry',
        message: 'Could not fetch purchase records from backend.',
      });
    } finally {
      setIsLoadingPurchases(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBooks();
    fetchPurchases();
  }, [fetchBooks, fetchPurchases]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? The file will be removed from Cloudflare R2.`)) {
      return;
    }

    try {
      await api.books.delete(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showToast({
        type: 'success',
        title: 'Book Removed',
        message: `"${title}" and its Cloudflare R2 storage were deleted.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete book.',
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await api.books.toggleStatus(id);
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b)));
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `Book status changed to ${updated.status.toUpperCase()}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update status.',
      });
    }
  };

  const handleToggleAccess = async (purchase: PurchaseItem) => {
    const nextStatus = purchase.accessStatus === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    const actionName = nextStatus === 'ACTIVE' ? 'restore' : 'revoke';

    if (!confirm(`Are you sure you want to ${actionName} access for ${purchase.userEmail}?`)) {
      return;
    }

    setUpdatingAccessId(purchase.id);
    try {
      const updated = await api.purchases.updateAccess(purchase.id, nextStatus);
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchase.id
            ? { ...p, accessStatus: updated.accessStatus, paymentStatus: updated.paymentStatus }
            : p,
        ),
      );
      showToast({
        type: nextStatus === 'ACTIVE' ? 'success' : 'warning',
        title: nextStatus === 'ACTIVE' ? 'Access Restored' : 'Access Revoked',
        message: `Reading entitlement for ${purchase.userEmail} was ${nextStatus.toLowerCase()}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update access status.',
      });
    } finally {
      setUpdatingAccessId(null);
    }
  };

  const handleOpenReader = (book: BookItem) => {
    setReadingBook(book);
    setReaderModalOpen(true);
  };

  // Filtered books
  const effectiveSearch = searchQuery || globalSearch;
  const filteredBooks = books.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      effectiveSearch === '' ||
      b.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(effectiveSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered purchases
  const filteredPurchases = purchases.filter((p) => {
    const matchesStatus =
      purchaseStatusFilter === 'All' ||
      p.paymentStatus.toLowerCase() === purchaseStatusFilter.toLowerCase() ||
      p.accessStatus.toLowerCase() === purchaseStatusFilter.toLowerCase();
    const q = purchaseSearch.toLowerCase();
    const matchesSearch =
      q === '' ||
      p.orderId.toLowerCase().includes(q) ||
      p.userEmail.toLowerCase().includes(q) ||
      p.bookTitle.toLowerCase().includes(q) ||
      p.paymentId.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = purchases
    .filter((p) => p.paymentStatus === 'SUCCESS')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              LOG TO LEARN – Book Management & Security
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span>Private R2 Storage</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage electronic textbooks, private documents, online orders, and student DRM entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              fetchBooks();
              fetchPurchases();
            }}
            disabled={isLoadingBooks || isLoadingPurchases}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
            title="Refresh library & orders"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoadingBooks || isLoadingPurchases ? 'animate-spin text-sky-500' : ''
              }`}
            />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book / PDF</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Books Catalog ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'purchases'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Purchases & DRM Access ({purchases.length})</span>
          {purchases.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: BOOKS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="glass-panel p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
                placeholder="Search books, authors, or topics..."
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Books Grid */}
          {isLoadingBooks ? (
            <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading library from Cloudflare R2...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No books found in library</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your first textbook or PDF/EPUB document. It will stream securely through your private R2 bucket.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200 bg-slate-100 relative group">
                      <img
                        src={
                          book.coverImage ||
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
                        }
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.price > 0 && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                          ₹{book.price}
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={book.status === 'published' ? 'success' : 'neutral'} dot>
                          {book.status.toUpperCase()}
                        </Badge>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100">
                          {book.category}
                        </span>
                        {book.purchasesDisabled && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100">
                            Purchases Disabled
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                          {book.subtitle}
                        </p>
                      )}
                      <p className="text-xs font-medium text-slate-500 truncate">
                        By {book.author}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 flex-wrap">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {book.format}
                        </span>
                        <span>{book.pages} pages</span>
                        <span>•</span>
                        <span>{book.language || 'English'}</span>
                      </div>
                    </div>
                  </div>

                  {/* DRM & Storage Telemetry */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>R2 DRM Protected</span>
                    </span>
                    <span className="text-[11px] text-sky-600 font-mono font-bold">
                      {purchases.filter((p) => p.bookId === book.id && p.paymentStatus === 'SUCCESS').length} purchases
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {/* Protected In-App Reader Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenReader(book)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-xs transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Protected Reader</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(book.id)}
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
                        type="button"
                        onClick={() => handleDelete(book.id, book.title)}
                        title="Delete Book & R2 Object"
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
        </div>
      )}

      {/* TAB 2: PURCHASES & ENTITLEMENTS MANAGEMENT */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Orders</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{purchases.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Paid</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {purchases.filter((purchase) => purchase.paymentStatus === 'SUCCESS').length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Refunded</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {purchases.filter((purchase) => purchase.paymentStatus === 'REFUNDED').length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Revenue</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500">Paid orders only</p>
            </div>
          </div>
          {/* Purchase Filters Bar */}
          <div className="glass-panel p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'SUCCESS', 'ACTIVE', 'REVOKED', 'PENDING'].map((status) => (
                <button
                  key={status}
                  onClick={() => setPurchaseStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    purchaseStatusFilter === status
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={purchaseSearch}
                onChange={(e) => setPurchaseSearch(e.target.value)}
                placeholder="Search order ID, buyer email, book..."
                className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Purchases Table */}
          {isLoadingPurchases ? (
            <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading purchase audit log...</p>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No purchases found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Orders placed through the student portal will automatically appear here with verified transaction tokens.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Order ID / Date</th>
                      <th className="py-3 px-4">Book</th>
                      <th className="py-3 px-4">Buyer Email</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">DRM Access</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPurchases.map((purchase) => {
                      const isSuccess = purchase.paymentStatus === 'SUCCESS';
                      const isActive = purchase.accessStatus === 'ACTIVE';

                      return (
                        <tr key={purchase.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-slate-900">{purchase.orderId}</div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(purchase.purchasedAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 max-w-xs truncate">
                              {purchase.bookTitle}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Txn: {purchase.paymentId}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{purchase.userEmail}</div>
                            {purchase.userName && (
                              <div className="text-[10px] text-slate-400">{purchase.userName}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                            ₹{purchase.amount}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isSuccess
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : purchase.paymentStatus === 'REFUNDED'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {purchase.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isActive ? (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  <span>ACTIVE</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3" />
                                  <span>REVOKED</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAccess(purchase)}
                              disabled={updatingAccessId === purchase.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isActive
                                  ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                              title={
                                isActive
                                  ? 'Revoke student access to reader'
                                  : 'Restore student access to reader'
                              }
                            >
                              {updatingAccessId === purchase.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : isActive ? (
                                <>
                                  <UserX className="w-3 h-3" />
                                  <span>Revoke Access</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  <span>Restore Access</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book Upload Modal (Cloudflare R2 Integration) */}
      <BookModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchBooks();
          fetchPurchases();
        }}
      />

      {/* Protected DRM Document Reader Modal */}
      <ProtectedReaderModal
        isOpen={readerModalOpen}
        onClose={() => {
          setReaderModalOpen(false);
          setReadingBook(null);
        }}
        book={readingBook}
      />
    </div>
  );
}
