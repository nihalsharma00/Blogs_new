import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { CategoryDetail } from './CategoryDetail';
import * as publicService from '../../services/public.service';

vi.mock('../../services/public.service', () => ({
  getCategoryBySlug: vi.fn(),
  getPosts: vi.fn(),
}));

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useParams: () => ({ slug: 'test-category' })
  };
});

describe('CategoryDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state for category initially', () => {
    vi.mocked(publicService.getCategoryBySlug).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<CategoryDetail />);
    
    expect(screen.getByText(/loading category details/i)).toBeInTheDocument();
  });

  it('renders error state on category failure', async () => {
    vi.mocked(publicService.getCategoryBySlug).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<CategoryDetail />);
    
    expect(await screen.findByText(/category not found/i)).toBeInTheDocument();
  });

  it('renders loading state for posts', async () => {
    vi.mocked(publicService.getCategoryBySlug).mockResolvedValue({ id: '1', name: 'Test Category', slug: 'test-category', description: '' });
    vi.mocked(publicService.getPosts).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<CategoryDetail />);
    
    expect(await screen.findByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('renders empty state when no posts', async () => {
    vi.mocked(publicService.getCategoryBySlug).mockResolvedValue({ id: '1', name: 'Test Category', slug: 'test-category', description: '' });
    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [], total: 0 });
    renderWithProviders(<CategoryDetail />);
    
    expect(await screen.findByText(/no posts found/i)).toBeInTheDocument();
  });

  it('renders posts correctly', async () => {
    const mockPost = {
      id: '1', title: 'Test Post Title', slug: 'test-post', excerpt: 'Excerpt', content: '', 
      publishedAt: null, status: 'PUBLISHED', authorId: '1', categoryId: '1', 
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      coverImage: null,
      likeCount: 0,
      commentCount: 0
    };

    vi.mocked(publicService.getCategoryBySlug).mockResolvedValue({ id: '1', name: 'Test Category', slug: 'test-category', description: '' });
    vi.mocked(publicService.getPosts).mockResolvedValue({ posts: [mockPost], total: 1 });
    
    renderWithProviders(<CategoryDetail />);
    
    expect(await screen.findByText('Test Post Title')).toBeInTheDocument();
  });
});
