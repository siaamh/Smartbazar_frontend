import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBrands } from '../hooks/useBrands';
import { getImageUrl } from '../utils/image';
import { Skeleton } from '../components/ui/Skeleton';

export default function BrandsPage() {
  const { data, isLoading, error } = useBrands({ page_size: 50 });
  const brands = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/" className="hover:text-[#065F46]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">Brands</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1917]">All Brands</h1>
        <p className="text-[#78716C] mt-2">Discover products from our partner brands</p>
      </div>

      {error && <div className="text-center py-16 text-[#DC2626]">Failed to load brands.</div>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-28" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <p className="text-center py-16 text-[#78716C]">No brands found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group bg-white rounded-xl border border-[#E7E5E4] p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-[#065F46]/30 transition-all"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#FAF9F6] flex items-center justify-center">
                {brand.logo ? (
                  <img
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-[#065F46]/40">{brand.name.charAt(0)}</span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#1C1917] group-hover:text-[#065F46] transition-colors">
                  {brand.name}
                </p>
                {brand.description && (
                  <p className="text-xs text-[#78716C] mt-0.5 line-clamp-2">{brand.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
