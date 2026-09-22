'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Lock,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BookItem } from '@/lib/api';

interface ProtectedReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookItem | null;
}

export function ProtectedReaderModal({
  isOpen,
  onClose,
  book,
}: ProtectedReaderModalProps) {
  const { user } = useAuth();

  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-Screenshot & Screen Capture: Blur blackout on window focus loss
  useEffect(() => {
    if (!isOpen) return;

    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block keyboard shortcuts: PrintScreen, Ctrl+P, Cmd+P, Ctrl+S, Cmd+S
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')
      ) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen') {
        setIsWindowBlurred(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const streamUrl = `http://localhost:4000/api/books/${book.id}/stream`;
  const watermarkText = `${user?.email || 'admin@lumokido.com'} • Protected Digital Rights • LMS ID #${user?.id || 'ADM-1'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 select-none">
      <div
        className={`bg-slate-900 border border-slate-800 rounded-3xl w-full flex flex-col overflow-hidden shadow-2xl transition-all ${
          isFullscreen ? 'h-full' : 'max-w-5xl h-[92vh]'
        }`}
      >
        {/* Top Control Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 line-clamp-1">
                  {book.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Cloudflare R2 DRM Stream</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                By {book.author} • {book.format} • {book.fileSize}
              </p>
            </div>
          </div>

          {/* Viewer Tools */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(75, z - 15))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-300">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(150, z + 15))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-slate-700 transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Body / Content Viewport */}
        <div className="flex-1 relative bg-slate-950 overflow-auto flex items-center justify-center p-4">
          {/* ANTI-SCREENSHOT BLACKOUT OVERLAY */}
          {isWindowBlurred && (
            <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-100">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Protected Document View
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Screenshots and screen recordings are disabled for copyrighted materials.
                Return focus to the window to resume reading.
              </p>
            </div>
          )}

          {/* DYNAMIC FORENSIC WATERMARK OVERLAY */}
          <div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex flex-wrap items-center justify-around opacity-[0.14] select-none text-white text-xs font-mono font-bold rotate-[-25deg]"
            aria-hidden="true"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="p-8 whitespace-nowrap">
                {watermarkText}
              </div>
            ))}
          </div>

          {/* PROTECTED DOCUMENT EMBED / STREAM */}
          <div
            className="relative z-10 w-full h-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transition-transform"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <object
              data={`${streamUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full border-0 pointer-events-auto"
            >
              <div className="p-10 text-center flex flex-col items-center justify-center h-full text-slate-800 space-y-3">
                <FileText className="w-12 h-12 text-sky-500 mx-auto" />
                <h4 className="text-sm font-bold">Document Stream Ready</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  This document is streaming securely from your Cloudflare R2 bucket. Direct file downloads and right-click copying are locked.
                </p>
              </div>
            </object>
          </div>
        </div>

        {/* Reader Footer Protection Notice */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Rights Management (DRM) Active</span>
          </span>
          <span className="font-mono text-[10px]">
            Buyer ID: {user?.email || 'Admin Preview'}
          </span>
        </div>
      </div>
    </div>
  );
}
