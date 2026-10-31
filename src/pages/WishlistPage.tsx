import { Link } from 'react-router-dom';
import { Heart, Info, PackageSearch } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { useWishlistStore } from '../stores/wishlistStore';
import { productsApi } from '../services/api/products.api';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlistStore();
  // Fetch up to 20 products by searching their names/IDs (backend doesn't support ?ids=)
  // We fetch the product list once and filter locally, or do parallel fetches
  const limitedIds = wishlistIds.slice(0, 20);

  // Fetch all products and try to find matching IDs via search
  // Since backend doesn't support id__in, we use a large page fetch as best effort
  const productsQuery = useQueries({
    queries: limitedIds.map((id) => ({
      queryKey: ['wishlist-product', id],
      queryFn: async () => {
        // Try to get product list filtered to this ID — backend supports no ID filter,
        // so we fetch a broad list and filter in-memory as last resort.
        // Best effort: fetch and check if product with that ID exists
        const result = await productsApi.getProducts({ page_size: 100 });
        return result.results.find((p) => p.id === id) || null;
      },
      staleTime: 2 * 60 * 1000,
      enabled: limitedIds.length > 0,
    })),
  });

  const isLoading = productsQuery.some((q) => q.isLoading);
  const products = productsQuery
    .map((q) => q.data)
    .filter((p): p is NonNullable<typeof p> => p !== null && p !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Heart size={22} className="text-[#065F46]" />
        <h1 className="text-2xl font-bold text-[#1C1917]">My Wishlist</h1>
      </div>

      {/* Local storage notice */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-sm text-amber-800 max-w-lg">
        <Info size={16} className="flex-shrink-0 mt-0.5" />
        <span>Your wishlist is saved locally on this device only. It is not synced across devices or accounts.</span>
      </div>

      {wishlistIds.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <Heart size={56} className="text-[#E7E5E4] mb-4" />
          <h3 className="font-semibold text-[#1C1917] mb-2">Your wishlist is empty</h3>
          <p className="text-sm text-[#78716C] mb-5">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link to="/shop" className="text-sm text-[#065F46] font-medium hover:underline">
            Browse products →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#78716C] mb-6">{wishlistIds.length} saved item{wishlistIds.length !== 1 ? 's' : ''}</p>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: Math.min(wishlistIds.length, 8) }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center">
              <PackageSearch size={48} className="text-[#E7E5E4] mb-4" />
              <p className="text-[#78716C]">
                Could not load your saved products. They may have been removed or renamed.
              </p>
              <Link to="/shop" className="text-sm text-[#065F46] font-medium hover:underline mt-4">
                Browse products →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
