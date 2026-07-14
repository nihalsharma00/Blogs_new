import { api } from '../lib/api';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  status: string;
  authorId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  coverImage: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author?: {
    id: string;
    username: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Author {
  id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

interface GetPostsParams {
  page?: number;
  limit?: number;
  categorySlug?: string;
  authorUsername?: string;
  search?: string;
  featured?: boolean;
}

export const getPosts = async (params?: GetPostsParams): Promise<{ posts: Post[]; total: number }> => {
  const { data } = await api.get('/posts', { params });
  return data.data; 
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { data } = await api.get(`/posts/${slug}`);
  return data.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data.data; 
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data } = await api.get(`/categories/${slug}`);
  return data.data;
};

export const getAuthorProfile = async (username: string): Promise<Author> => {
  const { data } = await api.get(`/users/${username}`);
  return data.data;
};

