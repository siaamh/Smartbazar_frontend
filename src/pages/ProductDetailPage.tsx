import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingCart, Minus, Plus, AlertTriangle, Tag, Clock } from 'lucide-react';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import { getImageUrl } from '../utils/image';
import PriceDisplay from '../components/products/PriceDisplay';
import ProductGrid from '../components/products/ProductGrid';
import Badge from '../components/ui/Badge';
import CountdownTimer from '../components/ui/CountdownTimer';
import { Skeleton } from '../components/ui/Skeleton';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug!);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const { toggleItem, isWishlisted } = useWishlistStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const addToCart = useAddToCart();
  const isCustomer = isAuthenticated && user?.role === 'customer';
  const wishlisted = product ? isWishlisted(product.id) : false;

  // Related products
  const { data: relatedData } = useProducts({
    category: product?.category_slug || '',
    page_size: 4,
  });
  const relatedProducts = relatedData?.results?.filter((p) => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton variant="image" className="w-full h-96" />
          <div className="space-y-4">
            <Skeleton variant="text" className="w-1/3 h-4" />
            <Skeleton variant="text" className="w-3/4 h-8" />
            <Skeleton variant="text" className="w-1/2 h-6" />
            <Skeleton variant="text" className="w-full h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <AlertTriangle size={48} className="text-[#DC2626] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1C1917] mb-2">Product not found</h2>
        <p className="text-[#78716C] mb-6">This product may no longer be available.</p>
        <Link to="/shop" className="text-[#065F46] font-medium hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;
  const imageUrl = imgError ? getImageUrl(null) : getImageUrl(product.image);

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-8 flex-wrap">
        <Link to="/" className="hover:text-[#065F46]">Home</Link>
        <ChevronRight size={12} />
        {product.category_name && (
          <>
            <Link to={`/categories/${product.category_slug}`} className="hover:text-[#065F46]">
              {product.category_name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[#1C1917] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl overflow-hidden border border-[#E7E5E4] aspect-square">
            <img
              src={imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Brand */}
          {product.brand_name && (
            <Link
              to={`/brands/${product.brand_slug}`}
              className="inline-block text-xs font-semibold text-[#B45309] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Tag size={10} className="inline mr-1" />
              {product.brand_name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
            {product.name}
          </h1>

          {/* Stock badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {outOfStock ? (
              <Badge variant="outOfStock">Out of Stock</Badge>
            ) : lowStock ? (
              <Badge variant="discount">Only {product.stock} left in stock</Badge>
            ) : (
              <Badge variant="new">In Stock</Badge>
            )}
            {product.is_featured && <Badge variant="featured">Featured</Badge>}
          </div>

          {/* Price */}
          <PriceDisplay pricing={product.pricing} size="lg" />

          {/* Offer info */}
          {product.pricing.offer_title && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#B45309]" />
                <span className="text-sm font-semibold text-[#B45309]">{product.pricing.offer_title}</span>
              </div>
              {product.pricing.offer_end && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#78716C]">Ends in:</span>
                  <CountdownTimer
                    endsAt={product.pricing.offer_end}
                    compact
                    className="text-[#B45309]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Quantity + Add to cart */}
          {isCustomer && (
            <div className="flex items-center gap-4 flex-wrap">
              {/* Quantity selector */}
              <div className="flex items-center border border-[#E7E5E4] rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2.5 text-[#78716C] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold text-[#1C1917] border-x border-[#E7E5E4] min-w-[48px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2.5 text-[#78716C] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock || addToCart.isPending}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                  outOfStock
                    ? 'bg-[#FAF9F6] text-[#78716C] border border-[#E7E5E4] cursor-not-allowed'
                    : 'bg-[#065F46] text-white hover:bg-[#047857] shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <ShoppingCart size={16} />
                {addToCart.isPending ? 'Adding...' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => toggleItem(product.id)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              wishlisted ? 'text-red-500' : 'text-[#78716C] hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Description */}
          {product.description && (
            <div className="border-t border-[#E7E5E4] pt-5">
              <h3 className="text-sm font-semibold text-[#1C1917] mb-2">Description</h3>
              <p className="text-sm text-[#78716C] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="border-t border-[#E7E5E4] pt-4 space-y-1.5 text-xs text-[#78716C]">
            {product.category_name && (
              <p>Category: <Link to={`/categories/${product.category_slug}`} className="text-[#065F46] hover:underline">{product.category_name}</Link></p>
            )}
            {product.brand_name && (
              <p>Brand: <Link to={`/brands/${product.brand_slug}`} className="text-[#065F46] hover:underline">{product.brand_name}</Link></p>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#1C1917] mb-6">You may also like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
