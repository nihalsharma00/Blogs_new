import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PostDetail } from './PostDetail';
import * as publicService from '../../services/public.service';

vi.mock('../../services/public.service', () => ({
  getPostBySlug: vi.fn(),
}));

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useParams: () => ({ slug: 'test-post' })
  };
});

describe('PostDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(publicService.getPostBySlug).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<PostDetail />);
    
    expect(screen.getByText(/loading post/i)).toBeInTheDocument();
  });

  it('renders error state on failure', async () => {
    vi.mocked(publicService.getPostBySlug).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<PostDetail />);
    
    expect(await screen.findByText(/failed to load post/i)).toBeInTheDocument();
  });

  it('renders post content correctly', async () => {
    const mockPost = {
      id: '1', title: 'Test Post Title', slug: 'test-post', excerpt: 'Excerpt', 
      content: '<p>Hello DOMPurify</p>', 
      publishedAt: null, status: 'PUBLISHED', authorId: '1', categoryId: '1', 
      createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z', coverImage: null,
      author: { id: '1', username: 'author1' },
      likeCount: 0, commentCount: 0
    };

    vi.mocked(publicService.getPostBySlug).mockResolvedValue(mockPost);
    renderWithProviders(<PostDetail />);
    
    expect(await screen.findByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Hello DOMPurify')).toBeInTheDocument();
  });

  it('renders all required social sharing buttons', async () => {
    const mockPost = {
      id: '1', title: 'Test Post Title', slug: 'test-post', excerpt: 'Excerpt', 
      content: '<p>Content</p>', 
      publishedAt: null, status: 'PUBLISHED', authorId: '1', categoryId: '1', 
      createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z', coverImage: null,
      author: { id: '1', username: 'author1' },
      likeCount: 0, commentCount: 0
    };

    vi.mocked(publicService.getPostBySlug).mockResolvedValue(mockPost);
    renderWithProviders(<PostDetail />);
    
    await screen.findByText('Test Post Title');
    
    // Verify Share UI exists
    expect(screen.getByTitle('Share on X')).toBeInTheDocument();
    expect(screen.getByTitle('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByTitle('Share on LinkedIn')).toBeInTheDocument();
    expect(screen.getByTitle('Share on WhatsApp')).toBeInTheDocument();
    expect(screen.getByTitle('Copy Link')).toBeInTheDocument();
  });
});
