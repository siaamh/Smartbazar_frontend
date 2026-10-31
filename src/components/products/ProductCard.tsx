import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { getImageUrl } from '../../utils/image';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';
import { useAddToCart } from '../../hooks/useCart';
import PriceDisplay from './PriceDisplay';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const addToCart = useAddToCart();

  const isCustomer = isAuthenticated && user?.role === 'customer';
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCustomer) return;
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  const imageUrl = imgError ? getImageUrl(null) : getImageUrl(product.image);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-[#E7E5E4] transition-shadow duration-200"
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#FAF9F6]" style={{ paddingTop: '75%' }}>
          <img
            src={imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.pricing.is_discounted && (
              <Badge variant="discount">
                Sale
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="featured">Featured</Badge>
            )}
            {outOfStock && <Badge variant="outOfStock">Out of Stock</Badge>}
            {lowStock && !outOfStock && (
              <Badge variant="discount">Only {product.stock} left</Badge>
            )}
          </div>
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`
              absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200
              ${wishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white/80 text-[#78716C] hover:text-red-500 hover:bg-red-50'}
            `}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {product.brand_name && (
            <p className="text-xs text-[#B45309] font-semibold uppercase tracking-wide mb-1">
              {product.brand_name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-[#1C1917] line-clamp-2 mb-2 group-hover:text-[#065F46] transition-colors">
            {product.name}
          </h3>
          <PriceDisplay pricing={product.pricing} size="sm" />
        </div>
      </Link>

      {/* Add to cart */}
      {isCustomer && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || addToCart.isPending}
            className={`
              w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium
              transition-all duration-200
              ${outOfStock
                ? 'bg-[#FAF9F6] text-[#78716C] cursor-not-allowed border border-[#E7E5E4]'
                : 'bg-[#065F46] text-white hover:bg-[#047857] active:scale-[0.98]'}
            `}
          >
            <ShoppingCart size={14} />
            {addToCart.isPending ? 'Adding...' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default ProductCard;
