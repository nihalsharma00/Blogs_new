import { api } from '../lib/api';

export const toggleLike = async (postId: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const toggleBookmark = async (postId: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post(`/posts/${postId}/bookmark`);
  return data;
};
