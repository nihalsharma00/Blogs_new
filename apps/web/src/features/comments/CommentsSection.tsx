import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, updateComment, deleteComment, moderateComment } from '../../services/comment.service';
import { CommentItem } from './CommentItem';
import { useAuthStore } from '../../store/authStore'; // We need auth store for currentUserId

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  const createMutation = useMutation({
    mutationFn: (data: { content: string; parentId?: string | null }) => createComment(postId, data.content, data.parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; content: string }) => updateComment(data.id, data.content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  });

  const moderateMutation = useMutation({
    mutationFn: (data: { id: string; isHidden: boolean }) => moderateComment(data.id, data.isHidden),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  });

  const handleCreate = () => {
    if (newComment.trim()) {
      createMutation.mutate({ content: newComment });
    }
  };

  const isAdmin = user?.roles?.includes('Admin');

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {user ? (
        <div className="mb-8">
          <textarea
            className="w-full p-3 border border-input rounded-md bg-background min-h-[100px] mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            onClick={handleCreate}
            disabled={createMutation.isPending || !newComment.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-muted/50 rounded-lg text-center mb-8">
          <p className="text-muted-foreground mb-2">Please log in to leave a comment.</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onEdit={(id, content) => updateMutation.mutate({ id, content })}
              onDelete={(id) => {
                if (window.confirm('Are you sure you want to delete this comment?')) {
                  deleteMutation.mutate(id);
                }
              }}
              onReply={(parentId, content) => createMutation.mutate({ content, parentId })}
              onModerate={isAdmin ? (id, isHidden) => moderateMutation.mutate({ id, isHidden }) : undefined}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      )}
    </div>
  );
};
