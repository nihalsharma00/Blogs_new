import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { Home } from './Home';
import * as publicService from '../../services/public.service';

vi.mock('../../services/public.service', () => ({
  getPosts: vi.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(publicService.getPosts).mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/loading latest posts/i)).toBeInTheDocument();
  });

  it('renders error state on failure', async () => {
    vi.mocked(publicService.getPosts).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<Home />);
    
    expect(await screen.findByText(/failed to load posts/i)).toBeInTheDocument();
  });

  it('renders empty state when no posts', async () => {
    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [], total: 0 });
    renderWithProviders(<Home />);
    
    expect(await screen.findByText(/no posts available/i)).toBeInTheDocument();
  });

  it('renders posts and carousel', async () => {
    const mockPost = {
      id: '1', title: 'Test Post', slug: 'test-post', excerpt: 'Excerpt', content: '', 
      publishedAt: null, status: 'PUBLISHED', authorId: '1', categoryId: '1', 
      createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z', coverImage: null,
      author: { id: '1', username: 'author1' },
      likeCount: 0, commentCount: 0
    };

    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [mockPost], total: 1 });
    renderWithProviders(<Home />);
    
    const postTitles = await screen.findAllByText('Test Post');
    expect(postTitles.length).toBeGreaterThan(0);
  });
});
