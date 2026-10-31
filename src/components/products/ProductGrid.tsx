import type { Product } from '../../types';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({ products, loading = false, skeletonCount = 8 }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
