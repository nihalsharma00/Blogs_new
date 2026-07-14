
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { CommentItem } from './CommentItem';

describe('CommentItem Component', () => {
  const mockComment = {
    id: '1',
    content: 'Test Comment',
    authorId: 'user1',
    postId: 'post1',
    parentId: null,
    isHidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: 'user1',
      username: 'testuser',
      avatar: null,
    },
    replies: []
  };

  it('renders a comment correctly', () => {
    renderWithProviders(
      <CommentItem 
        comment={mockComment} 
        currentUserId="user2" 
        isAdmin={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onModerate={vi.fn()} 
        onReply={vi.fn()} 
      />
    );
    expect(screen.getByText('Test Comment')).toBeInTheDocument();
  });

  it('renders reply button when depth is less than 2', () => {
    renderWithProviders(
      <CommentItem 
        comment={mockComment} 
        depth={1}
        currentUserId="user2" 
        isAdmin={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onModerate={vi.fn()} 
        onReply={vi.fn()} 
      />
    );
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });

  it('does not render reply button when depth is 2 or greater', () => {
    renderWithProviders(
      <CommentItem 
        comment={mockComment} 
        depth={2}
        currentUserId="user2" 
        isAdmin={false} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onModerate={vi.fn()} 
        onReply={vi.fn()} 
      />
    );
    expect(screen.queryByText('Reply')).not.toBeInTheDocument();
  });

  it('shows hide button for admins and allows toggling', () => {
    const onModerateMock = vi.fn();
    renderWithProviders(
      <CommentItem 
        comment={mockComment} 
        currentUserId="admin1" 
        isAdmin={true} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onModerate={onModerateMock} 
        onReply={vi.fn()} 
      />
    );
    
    const hideBtn = screen.getByText('Hide');
    expect(hideBtn).toBeInTheDocument();
    
    fireEvent.click(hideBtn);
    expect(onModerateMock).toHaveBeenCalledWith('1', true);
  });
});
