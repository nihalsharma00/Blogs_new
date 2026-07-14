import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Search, Menu, X, Video } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Video className="w-6 h-6" />
            <span>VlogPlatform</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/search" className="text-muted-foreground hover:text-foreground" aria-label="Search">
            <Search className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm font-medium hover:underline">
                {user.username}
              </Link>
              <button onClick={logout} className="text-sm font-medium text-destructive hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium hover:underline">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link to="/search" className="block text-foreground py-2 font-medium">Search</Link>
          <Link to="/categories" className="block text-foreground py-2 font-medium">Categories</Link>
          <Link to="/about" className="block text-foreground py-2 font-medium">About</Link>
          <div className="pt-2 border-t border-border">
            <ThemeToggle />
          </div>
          <div className="pt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/profile" className="text-foreground font-medium py-2">Profile</Link>
                <button onClick={logout} className="text-left text-destructive font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-foreground font-medium py-2">Login</Link>
                <Link to="/register" className="bg-primary text-primary-foreground text-center font-medium py-2 rounded-md">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
