import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts, type Post } from '../../services/public.service';
import { PostCard } from '../../components/ui/PostCard';
import { FeaturedCarousel } from '../../components/ui/FeaturedCarousel';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { SEO } from '../../components/SEO';

export const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 6;

  // We fetch featured posts (could be a separate endpoint, or sorted by 'featured' flag)
  const { data: featuredData, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => getPosts({ featured: true, limit: 3 }),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', 'latest', page, limit],
    queryFn: () => getPosts({ page, limit }),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO 
        title="Home" 
        description="Discover the latest and greatest content on our Vlog Platform." 
      />
      
      {!isLoadingFeatured && featuredData?.posts && featuredData.posts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Featured Posts</h2>
          <FeaturedCarousel posts={featuredData.posts} />
        </section>
      )}
      
      <section>
        <h2 className="text-3xl font-bold mb-8 border-b border-border pb-4">Latest Articles</h2>
        
        {isLoading ? (
          <LoadingSpinner message="Loading latest posts..." />
        ) : error ? (
          <div className="text-center py-12 text-destructive">Failed to load posts</div>
        ) : !data || data.posts.length === 0 ? (
          <EmptyState title="No Posts Available" description="There are no articles published yet." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="mt-12">
              <Pagination 
                currentPage={page}
                totalPages={Math.ceil(data.total / limit)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};


