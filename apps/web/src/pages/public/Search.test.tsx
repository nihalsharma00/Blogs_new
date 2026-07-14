import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { Search } from './Search';
import * as publicService from '../../services/public.service';

vi.mock('../../services/public.service', () => ({
  getPosts: vi.fn(),
}));

describe('Search Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial empty state without query', () => {
    renderWithProviders(<Search />);
    expect(screen.getByText(/what are you looking for/i)).toBeInTheDocument();
  });

  it('renders loading state with initial query in URL', () => {
    vi.mocked(publicService.getPosts).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<Search />, { route: '/search?q=test' });
    
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('renders error state on API failure', async () => {
    vi.mocked(publicService.getPosts).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<Search />, { route: '/search?q=test' });
    
    expect(await screen.findByText(/error occurred while searching/i)).toBeInTheDocument();
  });

  it('renders empty results state', async () => {
    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [], total: 0 });
    renderWithProviders(<Search />, { route: '/search?q=test' });
    
    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders results correctly', async () => {
    const mockPost = {
      id: '1', title: 'Result Post', slug: 'result-post', excerpt: 'Excerpt', content: '', 
      publishedAt: null, status: 'PUBLISHED', authorId: '1', categoryId: '1', 
      createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z', coverImage: null,
      likeCount: 0, commentCount: 0
    };

    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [mockPost], total: 1 });
    renderWithProviders(<Search />, { route: '/search?q=test' });
    
    expect(await screen.findByText('Result Post')).toBeInTheDocument();
    expect(screen.getByText(/found 1 results for "test"/i)).toBeInTheDocument();
  });
});
