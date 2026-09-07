'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { FormModeProvider } from '@/use-form/FormMode';
import FormGeneratorComp from '@/use-form/FormGeneratorComp';
import BlogFormConfig from '@/use-form/configs/BlogFormConfig';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadOnly?: boolean;
}

export function BlogModal({ isOpen, onClose, isReadOnly = false }: BlogModalProps) {
  const { addBlog, instructors } = useLMS();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      category: 'Development',
      author: instructors[0]?.name || 'Dr. Sarah Jenkins',
      readTime: '6 min read',
      status: 'published',
    },
  });

  const onSubmit = (data: any) => {
    const slug = (data.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const coverImage =
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80';
    const authorAvatar =
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

    addBlog({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      category: data.category,
      author: data.author,
      authorAvatar,
      readTime: data.readTime,
      status: data.status,
      coverImage,
    });

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isReadOnly ? 'View Blog Article' : 'Publish Blog Article'}
      description="Define the article metadata using config-driven FormGenerator."
      maxWidth="xl"
    >
      <FormModeProvider isReadOnly={isReadOnly}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-4 p-1">
            <FormGeneratorComp
              props={BlogFormConfig({
                control,
              })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
              >
                Save Article
              </button>
            )}
          </div>
        </form>
      </FormModeProvider>
    </Modal>
  );
}
