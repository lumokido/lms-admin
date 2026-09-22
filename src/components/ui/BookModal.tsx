'use client';

import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { api } from '@/lib/api';
import { UploadCloud, FileText, CheckCircle2, Loader2, Trash2, BookOpen, ShieldCheck } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = ['Development', 'Data & AI', 'Design', 'Business', 'Engineering', 'Cybersecurity'];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
];

const fieldClass =
  'w-full bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 px-3.5 py-2.5 rounded-xl text-sm text-slate-900 outline-none';

export function BookModal({ isOpen, onClose, onSuccess }: BookModalProps) {
  const { showToast } = useLMS();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Development');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [pages, setPages] = useState('');
  const [language, setLanguage] = useState('English');
  const [publicationInfo, setPublicationInfo] = useState('');
  const [previewPagesCount, setPreviewPagesCount] = useState('3');
  const [allowPreview, setAllowPreview] = useState(true);
  const [purchasesDisabled, setPurchasesDisabled] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [coverImage, setCoverImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [r2StorageKey, setR2StorageKey] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [format, setFormat] = useState<'PDF' | 'EPUB'>('PDF');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setSubtitle('');
    setAuthor('');
    setSubject('');
    setCourse('');
    setPrice('');
    setDiscountPrice('');
    setPages('');
    setPublicationInfo('');
    setDescription('');
    setCoverImage('');
    setSelectedFile(null);
    setR2StorageKey('');
    setFileSize('');
  };

  const uploadDocument = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'epub') {
      showToast({
        type: 'error',
        title: 'Unsupported file',
        message: 'Choose a PDF or EPUB file.',
      });
      return;
    }

    setSelectedFile(file);
    setIsUploadingDoc(true);
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(cleanName);
    }

    try {
      const res = await api.books.uploadDocument(file);
      setR2StorageKey(res.r2StorageKey);
      setFileSize(res.fileSize);
      setFormat(res.format);
      if (res.pages) setPages(String(res.pages));
      showToast({
        type: 'success',
        title: 'Document uploaded',
        message: res.pages
          ? `${res.format}, ${res.fileSize}, ${res.pages} pages detected.`
          : `${res.format}, ${res.fileSize}. Page count could not be read, so enter it on the next step.`,
      });
    } catch (err: any) {
      setSelectedFile(null);
      showToast({
        type: 'error',
        title: 'Upload failed',
        message: err.message || 'The document could not be stored.',
      });
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadDocument(file);
    e.target.value = '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const res = await api.books.uploadCover(file);
      setCoverImage(res.coverUrl);
      showToast({ type: 'success', title: 'Cover uploaded', message: 'The cover image is saved.' });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Cover upload failed',
        message: err.message || 'The cover could not be stored.',
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const goNext = () => {
    if (step === 1 && !r2StorageKey) {
      showToast({ type: 'error', title: 'Document required', message: 'Upload a PDF or EPUB before continuing.' });
      return;
    }
    if (step === 2 && (!title.trim() || !author.trim())) {
      showToast({ type: 'error', title: 'Missing details', message: 'Title and author are required.' });
      return;
    }
    setStep((current) => (current < 3 ? ((current + 1) as 2 | 3) : current));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      goNext();
      return;
    }
    if (!title.trim() || !author.trim() || !r2StorageKey) return;

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
        coverImage: coverImage || undefined,
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
        title: 'Book saved',
        message: `"${title}" is ready in the catalog.`,
      });
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save failed',
        message: err.message || 'The book could not be saved.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a book"
      description="Upload the file, add the details, then publish it."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <ol className="grid grid-cols-3 gap-2">
          {[
            ['1', 'Document'],
            ['2', 'Details'],
            ['3', 'Publish'],
          ].map(([number, label], index) => {
            const active = step === index + 1;
            const done = step > index + 1;
            return (
              <li
                key={label}
                className={`rounded-2xl border px-3 py-2 text-sm ${
                  active
                    ? 'border-sky-300 bg-sky-50 text-sky-900'
                    : done
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <span className="block text-[11px] font-bold uppercase tracking-wide">Step {number}</span>
                {label}
              </li>
            );
          })}
        </ol>

        {step === 1 ? (
          <section className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.epub,application/pdf,application/epub+zip"
              className="hidden"
            />
            {!r2StorageKey ? (
              <div
                onClick={() => !isUploadingDoc && fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) uploadDocument(file);
                }}
                className={`min-h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 cursor-pointer ${
                  dragOver || isUploadingDoc ? 'border-sky-400 bg-sky-50' : 'border-slate-300 bg-slate-50'
                }`}
              >
                {isUploadingDoc ? (
                  <>
                    <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">Uploading the document…</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 grid place-items-center text-sky-600">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">Drop the PDF or EPUB here</p>
                    <p className="mt-1 text-sm text-slate-500">or click to choose a file, up to 100 MB</p>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white grid place-items-center text-emerald-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{selectedFile?.name || 'Document ready'}</p>
                  <p className="text-sm text-emerald-800 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {format} · {fileSize}
                    {pages ? ` · ${pages} pages` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setR2StorageKey('');
                    setSelectedFile(null);
                    setPages('');
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-white"
                  aria-label="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              The file stays in private storage. Students never receive a public download link.
            </p>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-5">
            <div className="space-y-2">
              <div className="h-44 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden grid place-items-center">
                {coverImage ? (
                  <img src={coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700"
              >
                {isUploadingCover ? 'Uploading…' : 'Upload cover'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                Title
                <input className={`${fieldClass} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                Subtitle
                <input className={`${fieldClass} mt-1`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Author
                <input className={`${fieldClass} mt-1`} value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Category
                <select className={`${fieldClass} mt-1`} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Price (₹)
                <input className={`${fieldClass} mt-1`} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Pages
                <input className={`${fieldClass} mt-1`} type="number" min="1" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="Detected from the PDF" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Subject
                <input className={`${fieldClass} mt-1`} value={subject} onChange={(e) => setSubject(e.target.value)} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Course
                <input className={`${fieldClass} mt-1`} value={course} onChange={(e) => setCourse(e.target.value)} />
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                Description
                <textarea className={`${fieldClass} mt-1 min-h-24`} value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <div className="sm:col-span-2 flex gap-2">
                {PRESET_COVERS.map((preset) => (
                  <button key={preset} type="button" onClick={() => setCoverImage(preset)} className="w-10 h-12 rounded-lg overflow-hidden border border-slate-200">
                    <img src={preset} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="rounded-3xl border border-slate-200 p-5 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Ready to save</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{title || 'Untitled book'}</h3>
              <p className="text-sm text-slate-500">
                {author || 'No author'} · {format} · {pages || '—'} pages · ₹{price || '0'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-medium text-slate-700">
                Language
                <input className={`${fieldClass} mt-1`} value={language} onChange={(e) => setLanguage(e.target.value)} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Status
                <select className={`${fieldClass} mt-1`} value={status} onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                Publication note
                <input className={`${fieldClass} mt-1`} value={publicationInfo} onChange={(e) => setPublicationInfo(e.target.value)} placeholder="Edition, ISBN, or publisher" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Compare-at price (₹)
                <input className={`${fieldClass} mt-1`} type="number" min="0" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Sample pages
                <input className={`${fieldClass} mt-1`} type="number" min="1" max="10" value={previewPagesCount} onChange={(e) => setPreviewPagesCount(e.target.value)} />
              </label>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={allowPreview} onChange={(e) => setAllowPreview(e.target.checked)} />
                Allow a sample preview
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={purchasesDisabled} onChange={(e) => setPurchasesDisabled(e.target.checked)} />
                Turn off purchases
              </label>
            </div>
          </section>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => (step === 1 ? onClose() : setStep((current) => (current - 1) as 1 | 2))}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={isUploadingDoc}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save book
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
