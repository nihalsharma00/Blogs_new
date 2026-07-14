import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories, type Category } from '../../services/public.service';
import { SEO } from '../../components/SEO';

export const CategoryList: React.FC = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <SEO 
        title="Categories" 
        description="Browse all vlog and blog categories on our platform." 
      />
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">Failed to load categories</div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No categories available.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((cat: Category) => (
            <div key={cat.id} className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
              <h3 className="font-medium text-lg text-foreground">{cat.name}</h3>
              {cat.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

