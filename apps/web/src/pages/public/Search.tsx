import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../../services/public.service';
import { PostCard } from '../../components/ui/PostCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { Search as SearchIcon } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['posts', 'search', initialQuery, page, limit],
    queryFn: () => getPosts({ search: initialQuery, page, limit }),
    enabled: initialQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setPage(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Articles</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {!initialQuery ? (
        <EmptyState 
          title="What are you looking for?" 
          description="Enter a keyword above to search through our articles." 
          icon={<SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />}
        />
      ) : isLoading ? (
        <LoadingSpinner message="Searching..." />
      ) : error ? (
        <EmptyState title="Error" description="An error occurred while searching. Please try again." />
      ) : !postsData || postsData.posts.length === 0 ? (
        <EmptyState 
          title="No Results Found" 
          description={`We couldn't find any articles matching "${initialQuery}". Try different keywords.`} 
        />
      ) : (
        <>
          <p className="text-muted-foreground mb-6">Found {postsData.total} results for "{initialQuery}"</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsData.posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="mt-12">
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(postsData.total / limit)} 
              onPageChange={setPage} 
            />
          </div>
        </>
      )}
    </div>
  );
};
