import { Link } from 'react-router-dom';
import { X, Home, ShoppingBag, Grid3X3, Tag, Star, Percent, LogIn, User, ShoppingCart, Heart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useLogout } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.itemCount);
  const logout = useLogout();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results?.slice(0, 6) || [];

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/shop', label: 'Shop', icon: <ShoppingBag size={18} /> },
    { to: '/categories', label: 'Categories', icon: <Grid3X3 size={18} /> },
    { to: '/brands', label: 'Brands', icon: <Tag size={18} /> },
    { to: '/shop?is_featured=true', label: 'Featured', icon: <Star size={18} /> },
    { to: '/offers', label: 'Offers', icon: <Percent size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E5E4]">
              <Link to="/" onClick={onClose} className="text-xl font-bold text-[#065F46] tracking-wider">
                VERDANT
              </Link>
              <button
                onClick={onClose}
                className="text-[#78716C] hover:text-[#1C1917] p-1"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* User info */}
            {isAuthenticated && user && (
              <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#E7E5E4]">
                <p className="text-sm font-semibold text-[#1C1917]">{user.first_name || user.username}</p>
                <p className="text-xs text-[#78716C]">{user.email}</p>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors font-medium"
                >
                  <span className="text-[#78716C]">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {/* Categories shortcut */}
              {categories.length > 0 && (
                <div className="pt-3 pb-1 px-3">
                  <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      onClick={onClose}
                      className="block px-2 py-1.5 text-sm text-[#78716C] hover:text-[#065F46] rounded"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t border-[#E7E5E4] pt-3 mt-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors">
                      <User size={18} className="text-[#78716C]" />Profile
                    </Link>
                    <Link to="/cart" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors">
                      <ShoppingCart size={18} className="text-[#78716C]" />
                      Cart {itemCount > 0 && <span className="ml-auto bg-[#065F46] text-white text-xs px-1.5 py-0.5 rounded-full">{itemCount}</span>}
                    </Link>
                    <Link to="/account/wishlist" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors">
                      <Heart size={18} className="text-[#78716C]" />Wishlist
                    </Link>
                    <Link to="/account/orders" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors">
                      <ShoppingBag size={18} className="text-[#78716C]" />Orders
                    </Link>
                    <button
                      onClick={() => { logout.mutate(); onClose(); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={18} />Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46] transition-colors">
                      <LogIn size={18} className="text-[#78716C]" />Sign in
                    </Link>
                    <Link to="/register" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-[#065F46] text-white hover:bg-[#047857] transition-colors font-medium">
                      <User size={18} />Create account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
