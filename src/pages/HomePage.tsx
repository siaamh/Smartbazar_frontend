import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useCategories';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useProducts } from '../hooks/useProducts';
import { useOffers } from '../hooks/useOffers';
import { useBrands } from '../hooks/useBrands';
import ProductGrid from '../components/products/ProductGrid';
import CountdownTimer from '../components/ui/CountdownTimer';
import { getImageUrl } from '../utils/image';

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] gap-0">
          {/* Left: Text content */}
          <div className="flex flex-col justify-center py-16 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-semibold text-[#065F46] bg-[#D1FAE5] px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                New Season Collection
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1917] leading-tight tracking-tight">
                Discover
                <br />
                <span className="text-[#065F46]">Your Style</span>
              </h1>
              <p className="mt-5 text-lg text-[#78716C] leading-relaxed max-w-md">
                Curated premium products with exceptional quality. Shop the latest arrivals from the world's finest brands.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-[#065F46] text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors shadow-sm hover:shadow-md"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link
                  to="/shop?is_featured=true"
                  className="inline-flex items-center gap-2 bg-white text-[#065F46] border border-[#065F46] px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#D1FAE5] transition-colors"
                >
                  View Featured
                </Link>
              </div>
              <div className="flex gap-8 mt-10">
                {[
                  { val: '10K+', label: 'Products' },
                  { val: '500+', label: 'Brands' },
                  { val: '50K+', label: 'Happy Customers' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-[#1C1917]">{stat.val}</p>
                    <p className="text-xs text-[#78716C] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Editorial visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:flex items-center justify-center py-10"
          >
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative bg-[#D1FAE5] rounded-2xl overflow-hidden h-96 flex items-center justify-center">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #065F46 2px, transparent 2px),
                                      radial-gradient(circle at 75% 75%, #065F46 2px, transparent 2px)`,
                    backgroundSize: '40px 40px',
                  }}
                />
                {/* Center emerald circle */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                  <div className="w-36 h-36 bg-[#065F46] rounded-full flex items-center justify-center shadow-xl">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <path d="M32 8C20 8 12 20 12 28C12 40 24 52 32 56C40 52 52 40 52 28C52 20 44 8 32 8Z" fill="white" opacity="0.9"/>
                      <circle cx="32" cy="28" r="8" fill="#D1FAE5"/>
                    </svg>
                  </div>
                  <p className="text-[#065F46] font-bold text-lg tracking-wide">VERDANT</p>
                </div>
                {/* Decorative accent circles */}
                <div className="absolute top-6 right-8 w-16 h-16 bg-[#065F46]/10 rounded-full" />
                <div className="absolute bottom-10 left-6 w-10 h-10 bg-[#B45309]/20 rounded-full" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-2 border border-[#E7E5E4]">
                <div className="w-8 h-8 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                  <Zap size={14} className="text-[#065F46]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1917]">Flash Deals</p>
                  <p className="text-[10px] text-[#78716C]">Up to 50% off</p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="absolute -top-3 -right-3 bg-[#065F46] text-white rounded-xl px-3 py-2">
                <p className="text-xs font-bold">Free Shipping</p>
                <p className="text-[10px] opacity-80">on ৳999+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Categories ────────────────────────────────────────────────────

function FeaturedCategoriesSection() {
  const { data, isLoading } = useCategories();
  const categories = data?.results?.slice(0, 6) || [];

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#065F46] uppercase tracking-wider mb-1">Browse</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Shop by Category</h2>
        </div>
        <Link to="/categories" className="text-sm text-[#065F46] font-medium hover:underline flex items-center gap-1">
          All categories <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-[#E7E5E4] rounded-xl mb-2" />
              <div className="h-3 bg-[#E7E5E4] rounded w-3/4 mx-auto" />
            </div>
          ))
          : categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#D1FAE5] mb-2 flex items-center justify-center relative group-hover:shadow-md transition-shadow">
                {cat.image ? (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-[#065F46] text-3xl font-bold opacity-30">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold text-[#1C1917] text-center group-hover:text-[#065F46] transition-colors">
                {cat.name}
              </p>
              {cat.children.length > 0 && (
                <p className="text-[10px] text-[#78716C]">{cat.children.length} sub-categories</p>
              )}
            </Link>
          ))}
      </div>
    </section>
  );
}

// ─── Featured Products ────────────────────────────────────────────────────────

function FeaturedProductsSection() {
  const { data, isLoading } = useFeaturedProducts({ page_size: 8 });

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#065F46] uppercase tracking-wider mb-1">Handpicked</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Featured Products</h2>
          </div>
          <Link to="/shop?is_featured=true" className="text-sm text-[#065F46] font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={data?.results} loading={isLoading} skeletonCount={8} />
        {!isLoading && (!data?.results || data.results.length === 0) && (
          <p className="text-center text-[#78716C] py-8">No featured products at the moment.</p>
        )}
      </div>
    </section>
  );
}

// ─── Offers Section ──────────────────────────────────────────────────────────

function OffersSection() {
  const { data: offers, isLoading } = useOffers();

  if (!isLoading && (!offers || offers.length === 0)) return null;

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#B45309] uppercase tracking-wider mb-1">Limited Time</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Active Offers</h2>
        </div>
        <Link to="/offers" className="text-sm text-[#065F46] font-medium hover:underline flex items-center gap-1">
          All offers <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(isLoading ? Array.from({ length: 4 }) : (offers || []).slice(0, 4)).map((offer, i) =>
          isLoading ? (
            <div key={i} className="animate-pulse bg-[#E7E5E4] rounded-xl h-52" />
          ) : (
            <Link
              key={(offer as any).id}
              to={`/products/${(offer as any).product_slug}`}
              className="group bg-white border border-[#E7E5E4] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-28 bg-[#D1FAE5] relative flex items-center justify-center overflow-hidden">
                {(offer as any).product_image ? (
                  <img
                    src={getImageUrl((offer as any).product_image)}
                    alt={(offer as any).product_name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-[#065F46]/20 text-4xl font-bold">
                    {(offer as any).discount_type === 'percentage'
                      ? `-${(offer as any).value}%`
                      : `-৳${(offer as any).value}`}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {(offer as any).discount_type === 'percentage'
                    ? `-${(offer as any).value}%`
                    : `-৳${(offer as any).value}`}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#1C1917] line-clamp-1">{(offer as any).title}</p>
                <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{(offer as any).product_name}</p>
                <div className="mt-2">
                  <CountdownTimer
                    endsAt={(offer as any).ends_at}
                    remainingSeconds={(offer as any).remaining_seconds}
                    compact
                  />
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}

// ─── Brands Section ──────────────────────────────────────────────────────────

function BrandsSection() {
  const { data, isLoading } = useBrands({ page_size: 12 });
  const brands = data?.results || [];

  if (!isLoading && brands.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-[#78716C] uppercase tracking-widest mb-8">
          Trusted Brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 w-24 animate-pulse bg-[#E7E5E4] rounded-lg" />
            ))
            : brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#E7E5E4] hover:border-[#065F46] hover:bg-[#FAF9F6] transition-all group"
              >
                {brand.logo ? (
                  <img
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    className="h-8 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#78716C] group-hover:text-[#065F46] transition-colors">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

// ─── Latest Products ─────────────────────────────────────────────────────────

function LatestProductsSection() {
  const { data, isLoading } = useProducts({ ordering: '-created_at', page_size: 8 });

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#065F46] uppercase tracking-wider mb-1">Just arrived</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">New Arrivals</h2>
        </div>
        <Link to="/shop?ordering=-created_at" className="text-sm text-[#065F46] font-medium hover:underline flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <ProductGrid products={data?.results} loading={isLoading} skeletonCount={8} />
    </section>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <OffersSection />
      <BrandsSection />
      <LatestProductsSection />
    </div>
  );
}
