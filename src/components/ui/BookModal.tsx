'use client';

import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { api, BookItem } from '@/lib/api';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Development',
  'Data & AI',
  'Design',
  'Business',
  'Engineering',
  'Cybersecurity',
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
];

export function BookModal({ isOpen, onClose, onSuccess }: BookModalProps) {
  const { showToast } = useLMS();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Development');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('999');
  const [discountPrice, setDiscountPrice] = useState('');
  const [pages, setPages] = useState('120');
  const [language, setLanguage] = useState('English');
  const [publicationInfo, setPublicationInfo] = useState('');
  const [previewPagesCount, setPreviewPagesCount] = useState('3');
  const [allowPreview, setAllowPreview] = useState(true);
  const [purchasesDisabled, setPurchasesDisabled] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);

  // Uploaded document state (Cloudflare R2)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [r2StorageKey, setR2StorageKey] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [format, setFormat] = useState<'PDF' | 'EPUB'>('PDF');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle PDF/EPUB selection and immediate upload to Cloudflare R2
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'epub') {
      showToast({
        type: 'error',
        title: 'Unsupported Format',
        message: 'Please select a PDF or EPUB document file.',
      });
      return;
    }

    setSelectedFile(file);
    setIsUploadingDoc(true);

    // Auto-fill title if empty
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(cleanName);
    }

    try {
      showToast({
        type: 'info',
        title: 'Uploading to Cloudflare R2',
        message: `Streaming "${file.name}" to private bucket...`,
      });

      const res = await api.books.uploadDocument(file);
      setR2StorageKey(res.r2StorageKey);
      setFileSize(res.fileSize);
      setFormat(res.format);

      showToast({
        type: 'success',
        title: 'Uploaded to Cloudflare R2',
        message: `File securely stored (${res.fileSize} • ${res.format}). Protected from public download.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload file to Cloudflare R2.',
      });
      setSelectedFile(null);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Handle cover image upload to Cloudflare R2
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const res = await api.books.uploadCover(file);
      setCoverImage(res.coverUrl);
      showToast({
        type: 'success',
        title: 'Cover Uploaded',
        message: 'Cover image uploaded to Cloudflare R2.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Cover Upload Failed',
        message: err.message || 'Could not upload cover image.',
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Submit complete book record
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      showToast({
        type: 'error',
        title: 'Required Fields',
        message: 'Please fill in Book Title and Author Name.',
      });
      return;
    }

    if (!r2StorageKey) {
      showToast({
        type: 'error',
        title: 'Document Required',
        message: 'Please upload a PDF or EPUB document file first.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.books.create({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        author: author.trim(),
        category,
        subject: subject.trim() || undefined,
        course: course.trim() || undefined,
        price: parseFloat(price) || 0,
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        format,
        pages: parseInt(pages) || 1,
        language: language.trim() || 'English',
        fileSize: fileSize || '1.0 MB',
        r2StorageKey,
        coverImage,
        description: description.trim(),
        publicationInfo: publicationInfo.trim() || undefined,
        previewSettings: {
          allowPreview,
          previewPagesCount: parseInt(previewPagesCount) || 3,
        },
        purchasesDisabled,
        status,
      });

      showToast({
        type: 'success',
        title: 'Book Created Successfully',
        message: `"${title}" is saved with Cloudflare R2 document protection.`,
      });

      // Reset form
      setTitle('');
      setSubtitle('');
      setAuthor('');
      setSubject('');
      setCourse('');
      setDiscountPrice('');
      setPublicationInfo('');
      setSelectedFile(null);
      setR2StorageKey('');
      setDescription('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save book record.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Book / Protected Document"
      description="Upload an educational textbook or PDF/EPUB. Content is protected in Cloudflare R2."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto p-1">
        {/* PDF / EPUB Upload Zone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
            <span>
              Document File (PDF or EPUB) <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-sky-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cloudflare R2 Protected</span>
            </span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.epub,application/pdf,application/epub+zip"
            className="hidden"
          />

          {!r2StorageKey ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                isUploadingDoc
                  ? 'border-sky-400 bg-sky-50/50'
                  : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/20 bg-slate-50'
              }`}
            >
              {isUploadingDoc ? (
                <>
                  <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                  <p className="text-xs font-bold text-sky-900">
                    Uploading directly to Cloudflare R2 bucket...
                  </p>
                  <p className="text-[11px] text-slate-400">Please wait while the file streams.</p>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-white shadow-2xs border border-slate-200 text-sky-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to upload or drag & drop PDF / EPUB
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports PDF and EPUB files up to 100 MB
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {selectedFile?.name || 'Document Ready'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-800 text-[10px] font-bold">
                      {format}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({fileSize})
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stored securely in Cloudflare R2</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setR2StorageKey('');
                  setSelectedFile(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove and upload different file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Book Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems & Cloud Architecture"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Complete Engineering & Interview Guide"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Author, Category, Subject & Course */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Author Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-800 outline-none transition-all cursor-pointer font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Course
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. B.Tech / GATE"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Pricing & Publication Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Price (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 pl-7 pr-3 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Original / M.R.P (₹)
            </label>
            <div className="relative">
              <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="1499"
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 pl-7 pr-3 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Page Count
            </label>
            <input
              type="number"
              min="1"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g. 250"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Language
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="English"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Publication Info & Publishing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Publication Information
            </label>
            <input
              type="text"
              value={publicationInfo}
              onChange={(e) => setPublicationInfo(e.target.value)}
              placeholder="e.g. First Edition 2026, LOG TO LEARN Press, ISBN: 978-0-123456-78-9"
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
              Publishing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 px-3.5 py-2 rounded-xl text-xs text-slate-800 outline-none transition-all cursor-pointer font-bold"
            >
              <option value="published">Published (Live in Store)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Preview Settings & Purchasing Settings */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={allowPreview}
                onChange={(e) => setAllowPreview(e.target.checked)}
                className="rounded text-sky-500 focus:ring-sky-400"
              />
              <span>Enable Sample Preview</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={purchasesDisabled}
                onChange={(e) => setPurchasesDisabled(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-400"
              />
              <span>Disable Purchases</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Sample Pages:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={previewPagesCount}
              onChange={(e) => setPreviewPagesCount(e.target.value)}
              className="w-16 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-mono text-center"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
            <span>Book Cover Image</span>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="text-[10px] text-sky-600 font-bold hover:underline cursor-pointer"
            >
              {isUploadingCover ? 'Uploading...' : 'Upload Custom Cover'}
            </button>
          </label>

          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <img
              src={coverImage}
              alt="Cover Preview"
              className="w-12 h-16 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 px-3 py-1.5 rounded-xl text-[11px] text-slate-800 outline-none transition-all font-mono"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Presets:</span>
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset)}
                    className="w-4 h-4 rounded-full border border-slate-300 transition-transform hover:scale-110 cursor-pointer overflow-hidden"
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
            Description / Overview
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key syllabus topics, chapters, and prerequisites covered in this textbook..."
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 p-3 rounded-xl text-xs text-slate-800 leading-relaxed outline-none transition-all resize-y"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !r2StorageKey}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Book...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Save & Protect in R2</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
