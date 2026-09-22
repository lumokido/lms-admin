'use client';

import React, { use } from 'react';
import { BlogEditor } from '@/components/blogs/BlogEditor';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = use(params);

  return <BlogEditor mode="edit" blogId={resolvedParams.id} />;
}
