import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#78716C] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl font-bold text-white tracking-wider">
              VERDANT
            </Link>
            <p className="text-sm mt-3 leading-relaxed text-[#78716C]">
              Premium products, thoughtfully curated. Discover style, quality, and value in every purchase.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#065F46] transition-colors">
                <span className="text-white text-xs font-bold">IG</span>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#065F46] transition-colors">
                <span className="text-white text-xs font-bold">TW</span>
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#065F46] transition-colors">
                <span className="text-white text-xs font-bold">FB</span>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/brands', label: 'Brands' },
                { to: '/shop?is_featured=true', label: 'Featured' },
                { to: '/offers', label: 'Offers & Deals' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Account</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/account', label: 'My Profile' },
                { to: '/account/orders', label: 'My Orders' },
                { to: '/account/wishlist', label: 'Wishlist' },
                { to: '/cart', label: 'Cart' },
                { to: '/login', label: 'Sign In' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Mail size={14} className="flex-shrink-0 text-[#065F46]" />
                support@verdant.shop
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={14} className="flex-shrink-0 text-[#065F46]" />
                +880 1700-000000
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="flex-shrink-0 mt-0.5 text-[#065F46]" />
                Dhaka, Bangladesh
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wide mb-2">Newsletter</p>
              {subscribed ? (
                <p className="text-xs text-[#065F46] font-medium">
                  Thanks for subscribing! We'll be in touch.
                </p>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[#78716C] focus:outline-none focus:border-[#065F46]"
                  />
                  <button
                    type="submit"
                    className="bg-[#065F46] text-white text-xs px-3 py-2 rounded-lg hover:bg-[#047857] transition-colors whitespace-nowrap"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Verdant. All rights reserved.</p>
          <p className="text-[#78716C]/60">Cash on Delivery · Secure Checkout · Fast Shipping</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
