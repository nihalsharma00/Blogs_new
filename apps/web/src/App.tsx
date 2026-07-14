import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { useAuthStore } from './store/authStore';
import { PageLoader } from './components/ui/PageLoader';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Home = lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home })));
const PostDetail = lazy(() => import('./pages/public/PostDetail').then(m => ({ default: m.PostDetail })));
const CategoryList = lazy(() => import('./pages/public/CategoryList').then(m => ({ default: m.CategoryList })));
const CategoryDetail = lazy(() => import('./pages/public/CategoryDetail').then(m => ({ default: m.CategoryDetail })));
const AuthorProfile = lazy(() => import('./pages/public/AuthorProfile').then(m => ({ default: m.AuthorProfile })));
const Search = lazy(() => import('./pages/public/Search').then(m => ({ default: m.Search })));
const About = lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = lazy(() => import('./pages/public/TermsAndConditions').then(m => ({ default: m.TermsAndConditions })));
const Unsubscribe = lazy(() => import('./pages/public/Unsubscribe').then(m => ({ default: m.Unsubscribe })));

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/author/:username" element={<AuthorProfile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
          </Route>

          {/* Auth Routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes without PublicLayout for Dashboard/Admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">User Profile</h1>
                <p>Logged in as: {user?.username} ({user?.email})</p>
                <button 
                  onClick={logout}
                  className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-md transition-colors hover:bg-destructive/90"
                >
                  Logout
                </button>
              </div>
            } />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
