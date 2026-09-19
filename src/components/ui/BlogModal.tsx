'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { FormModeProvider } from '@/use-form/FormMode';
import FormGeneratorComp from '@/use-form/FormGeneratorComp';
import BlogFormConfig from '@/use-form/configs/BlogFormConfig';
import { api, BlogItem } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BlogItem | null;
  onSuccess?: () => void;
  isReadOnly?: boolean;
}

export function BlogModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
  isReadOnly = false,
}: BlogModalProps) {
  const { instructors, showToast } = useLMS();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      readTime: '6 min read',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Development',
      author: instructors[0]?.name || 'Dr. Sarah Jenkins',
      status: 'published',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title || '',
          readTime: initialData.readTime || '6 min read',
          excerpt: initialData.excerpt || '',
          content: initialData.content || '',
          coverImage: initialData.coverImage || '',
          category: initialData.category || 'Development',
          author: initialData.author || instructors[0]?.name || 'Dr. Sarah Jenkins',
          status: initialData.status || 'published',
        });
      } else {
        reset({
          title: '',
          readTime: '6 min read',
          excerpt: '',
          content: '',
          coverImage: '',
          category: 'Development',
          author: instructors[0]?.name || 'Dr. Sarah Jenkins',
          status: 'published',
        });
      }
    }
  }, [isOpen, initialData, instructors, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const coverImage =
        data.coverImage?.trim() ||
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80';
      const authorAvatar =
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

      if (initialData?.id) {
        await api.blogs.update(initialData.id, {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          author: data.author,
          authorAvatar,
          readTime: data.readTime,
          status: data.status,
          coverImage,
        });
        showToast({
          type: 'success',
          title: 'Article Updated',
          message: `"${data.title}" was successfully updated.`,
        });
      } else {
        await api.blogs.create({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          author: data.author,
          authorAvatar,
          readTime: data.readTime,
          status: data.status,
          coverImage,
        });
        showToast({
          type: 'success',
          title: 'Article Created',
          message: `"${data.title}" was published to the LMS library.`,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Operation Failed',
        message: err.message || 'Could not save the article.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!initialData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isReadOnly
          ? 'View Blog Article'
          : isEditMode
          ? 'Edit Blog Article'
          : 'Write & Publish Blog Article'
      }
      description={
        isEditMode
          ? 'Modify article metadata, cover image, and full markdown body.'
          : 'Publish new educational articles, guides, and learning resources.'
      }
      maxWidth="2xl"
    >
      <FormModeProvider isReadOnly={isReadOnly}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-4 p-1 max-h-[65vh] overflow-y-auto">
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
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditMode ? 'Update Article' : 'Publish Article'}</span>
                )}
              </button>
            )}
          </div>
        </form>
      </FormModeProvider>
    </Modal>
  );
}
