import React, { useState } from 'react';
import type { Comment } from '../../services/comment.service';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string | null;
  isAdmin?: boolean;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onModerate?: (id: string, isHidden: boolean) => void;
  onReply: (parentId: string, content: string) => void;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
  onModerate,
  onReply,
  depth = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const [expanded, setExpanded] = useState(false);

  const isOwner = currentUserId === comment.authorId;
  const isLong = comment.content.length > 200;
  const displayContent = expanded ? comment.content : (isLong ? comment.content.slice(0, 200) + '...' : comment.content);

  const handleEditSubmit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setIsReplying(false);
      setReplyContent('');
    }
  };

  if (comment.isHidden && !isAdmin && !isOwner) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg text-muted-foreground italic mb-4 text-sm border border-border">
        This comment has been hidden by a moderator.
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className={`p-4 rounded-lg border ${comment.isHidden ? 'border-destructive/50 bg-destructive/10' : 'border-border bg-card'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="font-semibold text-sm">
            {comment.author?.username || 'Unknown'}
            {comment.isHidden && <span className="ml-2 text-destructive text-xs font-bold uppercase">Hidden</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </div>
        </div>

        {isEditing ? (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border border-input rounded-md bg-background text-sm mb-2"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleEditSubmit} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md">Save</button>
              <button onClick={() => setIsEditing(false)} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-md">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
            {isLong && (
              <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs mt-1 font-medium hover:underline">
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}

        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
          {currentUserId && !isEditing && depth < 2 && (
            <button onClick={() => setIsReplying(!isReplying)} className="hover:text-primary">
              Reply
            </button>
          )}
          {isOwner && !isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="hover:text-primary">Edit</button>
              <button onClick={() => onDelete(comment.id)} className="hover:text-destructive">Delete</button>
            </>
          )}
          {isAdmin && onModerate && (
            <button onClick={() => onModerate(comment.id, !comment.isHidden)} className="hover:text-primary">
              {comment.isHidden ? 'Restore' : 'Hide'}
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 pl-4 border-l-2 border-border">
            <textarea
              className="w-full p-2 border border-input rounded-md bg-background text-sm mb-2"
              rows={2}
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleReplySubmit} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md">Post Reply</button>
              <button onClick={() => setIsReplying(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && depth < 2 && (
        <div className="ml-6 mt-4 border-l-2 border-border/50 pl-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
              onModerate={onModerate}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
