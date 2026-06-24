import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from '@/lib/i18n.jsx';
import { CartProvider } from '@/lib/cartStore.jsx';

// Store layouts
import StoreLayout from '@/components/store/StoreLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// Public pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import FAQ from '@/pages/FAQ';
import Account from '@/pages/Account';
import AccountProfile from '@/pages/AccountProfile';
import TrackOrder from '@/pages/TrackOrder';
import GitPage from '@/pages/GitPage';

// Admin pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminCategories from '@/pages/AdminCategories';
import AdminOrders from '@/pages/AdminOrders';
import AdminCustomers from '@/pages/AdminCustomers';
import AdminOffers from '@/pages/AdminOffers';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminErrors from '@/pages/AdminErrors';
import AdminBlog from '@/pages/AdminBlog';
import AdminSettings from '@/pages/AdminSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-body tracking-widest uppercase text-muted-foreground">Pellazgo</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Store routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/profile" element={<AccountProfile />} />
        <Route path="/account/settings" element={<AccountProfile />} />
        <Route path="/account/orders" element={<Account />} />
        <Route path="/wishlist" element={<Account />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/git" element={<GitPage />} />
        <Route path="/shipping-policy" element={<FAQ />} />
        <Route path="/returns-policy" element={<FAQ />} />
        <Route path="/privacy-policy" element={<FAQ />} />
        <Route path="/terms" element={<FAQ />} />
      </Route>

      {/* Admin routes — path is intentionally obfuscated */}
      <Route element={<AdminLayout />}>
        <Route path="/nothranted" element={<AdminDashboard />} />
        <Route path="/nothranted/products" element={<AdminProducts />} />
        <Route path="/nothranted/categories" element={<AdminCategories />} />
        <Route path="/nothranted/orders" element={<AdminOrders />} />
        <Route path="/nothranted/customers" element={<AdminCustomers />} />
        <Route path="/nothranted/offers" element={<AdminOffers />} />
        <Route path="/nothranted/analytics" element={<AdminAnalytics />} />
        <Route path="/nothranted/errors" element={<AdminErrors />} />
        <Route path="/nothranted/blog" element={<AdminBlog />} />
        <Route path="/nothranted/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </CartProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
