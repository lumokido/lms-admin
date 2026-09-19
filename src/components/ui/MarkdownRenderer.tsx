'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content || !content.trim()) {
    return (
      <div className="text-slate-400 italic text-xs py-4">
        No content provided yet.
      </div>
    );
  }

  // Parse markdown line by line into structured blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockContent: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside my-3 space-y-1.5 text-slate-700 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="list-decimal list-inside my-3 space-y-1.5 text-slate-700 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      const codeText = codeBlockContent.join('\n');
      elements.push(
        <CodeBlockSnippet
          key={`code-${elements.length}`}
          code={codeText}
          language={codeBlockLanguage}
        />
      );
      codeBlockContent = [];
      inCodeBlock = false;
      codeBlockLanguage = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Check lists
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(ulMatch[2]);
      continue;
    }

    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(olMatch[2]);
      continue;
    }

    // If not in a list anymore, flush any list
    if (inList) {
      flushList();
    }

    // Check headings
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-slate-900 mt-5 mb-2 tracking-tight">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-slate-900 mt-6 mb-2.5 tracking-tight border-b border-slate-100 pb-1.5">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl font-extrabold text-slate-900 mt-6 mb-3 tracking-tight">
          {renderInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Check blockquotes
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 pl-4 border-l-4 border-sky-400 bg-sky-50/50 py-2 pr-3 rounded-r-xl text-slate-700 italic text-xs leading-relaxed"
        >
          {renderInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Check horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(
        <hr key={`hr-${i}`} className="my-6 border-slate-200" />
      );
      continue;
    }

    // Empty lines
    if (trimmed === '') {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={`p-${i}`} className="my-2 text-slate-700 leading-relaxed text-xs sm:text-sm">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  // Flush remaining lists or code blocks
  flushList();
  flushCodeBlock();

  return <div className={`space-y-1 font-sans ${className}`}>{elements}</div>;
}

// Inline markdown parser (bold, italic, inline code, links, images)
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split text by tokens (code, bold, italic, links, images)
  const regex = /(!?\[.*?\]\(.*?\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Image: ![alt](url)
    if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <span key={index} className="block my-3">
            <img
              src={match[2]}
              alt={match[1]}
              className="rounded-xl max-h-80 object-cover border border-slate-200 shadow-xs"
            />
            {match[1] && (
              <span className="block text-[11px] text-slate-400 text-center mt-1">
                {match[1]}
              </span>
            )}
          </span>
        );
      }
    }

    // Link: [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-2 transition-colors"
          >
            {match[1]}
          </a>
        );
      }
    }

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 text-sky-700 font-mono text-[11px] border border-slate-200/80 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

// Styled Code Block Snippet with Copy Button
function CodeBlockSnippet({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-slate-900 text-slate-100 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-sky-200/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
