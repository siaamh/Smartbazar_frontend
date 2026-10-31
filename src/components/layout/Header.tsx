import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, Menu, ChevronDown,
  LogOut, Package, Settings
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useLogout } from '../../hooks/useAuth';
import CategoriesDropdown from './CategoriesDropdown';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

export function Header() {
  const [catHover, setCatHover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const catTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const accountTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleCatEnter = () => {
    clearTimeout(catTimeout.current);
    setCatHover(true);
  };
  const handleCatLeave = () => {
    catTimeout.current = setTimeout(() => setCatHover(false), 150);
  };

  const handleAccountEnter = () => {
    clearTimeout(accountTimeout.current);
    setAccountOpen(true);
  };
  const handleAccountLeave = () => {
    accountTimeout.current = setTimeout(() => setAccountOpen(false), 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E7E5E4] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: hamburger */}
            <button
              className="lg:hidden text-[#78716C] hover:text-[#1C1917] p-1 mr-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-[#065F46] tracking-wider flex-shrink-0"
            >
              VERDANT
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 ml-10">
              <Link to="/" className="text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                Shop
              </Link>

              {/* Categories with dropdown */}
              <div
                className="relative"
                onMouseEnter={handleCatEnter}
                onMouseLeave={handleCatLeave}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                  Categories
                  <ChevronDown size={14} className={`transition-transform ${catHover ? 'rotate-180' : ''}`} />
                </button>
                {catHover && <CategoriesDropdown />}
              </div>

              <Link to="/brands" className="text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                Brands
              </Link>
              <Link to="/shop?is_featured=true" className="text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                Featured
              </Link>
              <Link to="/offers" className="text-sm font-medium text-[#78716C] hover:text-[#065F46] transition-colors">
                Offers
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#78716C] hover:text-[#065F46] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to="/account/wishlist"
                className="relative p-2 text-[#78716C] hover:text-[#065F46] transition-colors"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#B45309] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-[#78716C] hover:text-[#065F46] transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#065F46] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Account dropdown */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={handleAccountEnter}
                onMouseLeave={handleAccountLeave}
              >
                <button
                  className="p-2 text-[#78716C] hover:text-[#065F46] transition-colors flex items-center gap-1"
                  onClick={() => isAuthenticated ? setAccountOpen((v) => !v) : navigate('/login')}
                  aria-label="Account"
                  aria-expanded={accountOpen}
                >
                  <User size={20} />
                </button>

                {accountOpen && isAuthenticated && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E7E5E4] rounded-xl shadow-lg min-w-[180px] py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-[#FAF9F6]">
                      <p className="text-sm font-semibold text-[#1C1917] truncate">{user?.first_name || user?.username}</p>
                      <p className="text-xs text-[#78716C] truncate">{user?.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46]">
                      <Settings size={15} /> Profile
                    </Link>
                    <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46]">
                      <Package size={15} /> Orders
                    </Link>
                    <Link to="/account/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46]">
                      <Heart size={15} /> Wishlist
                    </Link>
                    <div className="border-t border-[#E7E5E4] mt-1 pt-1">
                      <button
                        onClick={() => { logout.mutate(); setAccountOpen(false); }}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </div>
                )}

                {accountOpen && !isAuthenticated && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#E7E5E4] rounded-xl shadow-lg min-w-[160px] py-1 z-50">
                    <Link to="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#FAF9F6] hover:text-[#065F46]">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm font-medium text-[#065F46] hover:bg-[#D1FAE5]">
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

export default Header;
