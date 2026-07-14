import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts, getAuthorProfile } from '../../services/public.service';
import { PostCard } from '../../components/ui/PostCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { UserCircle2 } from 'lucide-react';

export const AuthorProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [page, setPage] = React.useState(1);
  const limit = 9;

  const { data: author, isLoading: isLoadingAuthor, error: authorError } = useQuery({
    queryKey: ['author', username],
    queryFn: () => getAuthorProfile(username!),
    enabled: !!username,
  });

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts', 'author', username, page, limit],
    queryFn: () => getPosts({ authorUsername: username, page, limit }),
    enabled: !!username,
  });

  if (isLoadingAuthor) return <LoadingSpinner message="Loading author profile..." />;
  if (authorError || !author) return <EmptyState title="Author Not Found" description="This author does not exist." />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 pb-12 border-b border-border">
        {author.avatarUrl ? (
          <img src={author.avatarUrl} alt={author.username} className="w-32 h-32 rounded-full object-cover shadow-md" />
        ) : (
          <UserCircle2 className="w-32 h-32 text-muted-foreground" />
        )}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-bold mb-2">{author.username}</h1>
          <p className="text-muted-foreground text-lg mb-4">{author.bio || 'No bio provided.'}</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="bg-muted px-4 py-2 rounded-md text-sm font-medium">
              <span className="text-foreground font-bold mr-2">{postsData?.total || 0}</span>
              Posts Published
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8">Articles by {author.username}</h2>

      {isLoadingPosts ? (
        <LoadingSpinner message="Loading posts..." />
      ) : !postsData || postsData.posts.length === 0 ? (
        <EmptyState title="No Posts Yet" description={`${author.username} hasn't published any posts yet.`} />
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
