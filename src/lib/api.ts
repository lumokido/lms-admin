// Centralized API Client for LMS Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  readTime: string;
  publishedAt: string;
  status: 'published' | 'draft';
  views: number;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  commentsCount?: number;
  comments?: CommentItem[];
}

export interface CommentItem {
  id: string;
  blogId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lumokido_admin_token');
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('lumokido_admin_token', token);
  } else {
    localStorage.removeItem('lumokido_admin_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string): Promise<{ accessToken: string; user: AdminUser }> => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    getProfile: async (): Promise<AdminUser> => {
      return request('/auth/me');
    },
  },

  // Blogs
  blogs: {
    getAll: async (params?: { status?: string; category?: string; search?: string }): Promise<BlogItem[]> => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.search) searchParams.append('search', params.search);
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request(`/blogs${queryString}`);
    },

    getById: async (idOrSlug: string, incrementView = false): Promise<BlogItem> => {
      return request(`/blogs/${idOrSlug}${incrementView ? '?view=true' : ''}`);
    },

    create: async (data: Partial<BlogItem>): Promise<BlogItem> => {
      return request('/blogs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: Partial<BlogItem>): Promise<BlogItem> => {
      return request(`/blogs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    toggleStatus: async (id: string): Promise<BlogItem> => {
      return request(`/blogs/${id}/toggle-status`, {
        method: 'PATCH',
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return request(`/blogs/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Comments
  comments: {
    getByBlogId: async (blogId: string): Promise<CommentItem[]> => {
      return request(`/blogs/${blogId}/comments`);
    },

    create: async (blogId: string, data: { authorName: string; authorEmail: string; content: string; authorAvatar?: string }): Promise<CommentItem> => {
      return request(`/blogs/${blogId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    delete: async (blogId: string, commentId: string): Promise<{ success: boolean; message: string }> => {
      return request(`/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
      });
    },
  },
};
