import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Loader2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);
      await api.post('/newsletter/subscribe', { email });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg">VlogPlatform</h3>
          <p className="text-sm text-muted-foreground">
            Discover, read, and share the best content across genres.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/search" className="hover:text-foreground">Search</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Subscribe</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest updates in your inbox.
          </p>
          {success ? (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              Thanks for subscribing!
            </div>
          ) : (
            <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  aria-label="Email address"
                  disabled={isLoading}
                  required
                  className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
                </button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </form>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} VlogPlatform. All rights reserved.
      </div>
    </footer>
  );
};
