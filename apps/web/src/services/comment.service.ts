import { api } from '../lib/api';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  replies?: Comment[];
}

export const getComments = async (postId: string): Promise<Comment[]> => {
  const { data } = await api.get(`/posts/${postId}/comments`);
  return data.data;
};

export const createComment = async (postId: string, content: string, parentId?: string | null): Promise<Comment> => {
  const { data } = await api.post(`/posts/${postId}/comments`, { content, parentId });
  return data.data;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const { data } = await api.put(`/comments/${commentId}`, { content });
  return data.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

export const moderateComment = async (commentId: string, isHidden: boolean): Promise<Comment> => {
  const { data } = await api.patch(`/comments/${commentId}/moderate`, { isHidden });
  return data.data;
};
