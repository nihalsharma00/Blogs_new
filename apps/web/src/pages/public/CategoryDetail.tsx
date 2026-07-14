import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts, getCategoryBySlug } from '../../services/public.service';
import { PostCard } from '../../components/ui/PostCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';

export const CategoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = React.useState(1);
  const limit = 9;

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryBySlug(slug!),
    enabled: !!slug,
  });

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts', 'category', slug, page, limit],
    queryFn: () => getPosts({ categorySlug: slug, page, limit }),
    enabled: !!slug,
  });

  if (isLoadingCategory) return <LoadingSpinner message="Loading category details..." />;
  if (categoryError || !category) return <EmptyState title="Category Not Found" description="The category you are looking for does not exist." />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-card border border-border rounded-xl p-8 mb-12 text-center shadow-sm">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{category.description}</p>
        )}
      </div>

      {isLoadingPosts ? (
        <LoadingSpinner message="Loading posts..." />
      ) : !postsData || postsData.posts.length === 0 ? (
        <EmptyState title="No Posts Found" description={`There are currently no posts in the ${category.name} category.`} />
      ) : (
        <>
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
