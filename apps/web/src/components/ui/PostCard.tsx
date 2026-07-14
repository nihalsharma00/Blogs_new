import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../services/public.service';

interface PostCardProps {
  post: Post;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, className = '' }) => {
  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow ${className}`}>
      <Link to={`/post/${post.slug}`} className="block h-48 bg-muted overflow-hidden">
        {post.coverImage ? (
          <img 
            src={post.coverImage} 
            alt={post.title} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        {post.category && (
          <Link to={`/categories/${post.category.slug}`} className="text-xs font-bold text-primary uppercase tracking-wider mb-2 hover:underline">
            {post.category.name}
          </Link>
        )}
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-card-foreground">
          <Link to={`/post/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-5 flex-grow">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center text-xs text-muted-foreground justify-between pt-4 border-t border-border">
          <Link to={`/author/${post.author?.username}`} className="font-medium hover:text-foreground transition-colors">
            {post.author?.username || 'Unknown Author'}
          </Link>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
      </div>
    </div>
  );
};
