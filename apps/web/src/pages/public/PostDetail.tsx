import React from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPostBySlug } from '../../services/public.service';
import { toggleLike, toggleBookmark } from '../../services/engagement.service';
import { CommentsSection } from '../../features/comments/CommentsSection';
import { useAuthStore } from '../../store/authStore';
import { SEO } from '../../components/SEO';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
    }
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(post!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
    }
  });

  if (isLoading) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading post...</div>;
  if (error || !post) return <div className="container mx-auto px-4 py-12 text-center text-destructive">Failed to load post. It may not exist.</div>;

  // Sanitize the HTML before rendering
  const safeHtml = DOMPurify.sanitize(post.content);

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: [{
      '@type': 'Person',
      name: post.author?.username || 'Unknown',
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO 
        title={post.seoTitle || post.title} 
        description={post.seoDescription || post.excerpt || post.title} 
        type="article"
        image={post.coverImage || undefined}
        structuredData={articleStructuredData}
      />
      <div className="mb-8">
        <div className="h-64 md:h-96 bg-muted rounded-lg mb-6 flex items-center justify-center text-muted-foreground overflow-hidden">
          {post.coverImage ? (
            <img 
              src={post.coverImage} 
              alt={post.title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
            />
          ) : (
            <span>No Cover Image</span>
          )}
        </div>
        {post.category && (
          <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">
            {post.category.name}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center text-muted-foreground text-sm gap-4">
          <span>By {post.author?.username || 'Unknown'}</span>
          <span>•</span>
          <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div 
        className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      <div className="flex items-center gap-4 py-6 border-t border-border">
        <button 
          onClick={() => {
            if (!user) {
              alert('Please log in to like this post.');
              return;
            }
            likeMutation.mutate();
          }} 
          disabled={likeMutation.isPending}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span className="font-medium">{post.likeCount} Likes</span>
        </button>

        <button 
          onClick={() => {
            if (!user) {
              alert('Please log in to bookmark this post.');
              return;
            }
            bookmarkMutation.mutate();
          }}
          disabled={bookmarkMutation.isPending} 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <span className="font-medium">Bookmark</span>
        </button>

        <button 
          onClick={() => {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
          }}
          className="ml-auto flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Share on X"
        >
          <span className="font-medium">X</span>
        </button>
        <button 
          onClick={() => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Share on Facebook"
        >
          <span className="font-medium">Facebook</span>
        </button>
        <button 
          onClick={() => {
            window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Share on LinkedIn"
        >
          <span className="font-medium">LinkedIn</span>
        </button>
        <button 
          onClick={() => {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Share on WhatsApp"
        >
          <span className="font-medium">WhatsApp</span>
        </button>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          title="Copy Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          <span className="font-medium hidden sm:inline">Copy</span>
        </button>
      </div>

      <CommentsSection postId={post.id} />
    </div>
  );
};

