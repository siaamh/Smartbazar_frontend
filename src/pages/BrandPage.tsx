import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useBrand, useBrandProducts } from '../hooks/useBrands';
import { getImageUrl } from '../utils/image';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import SortSelect from '../components/products/SortSelect';
import Pagination from '../components/ui/Pagination';
import type { ProductFilterParams } from '../types';

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: brand, isLoading: brandLoading } = useBrand(slug!);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  const params: ProductFilterParams = {
    page,
    page_size: pageSize,
    ordering: (searchParams.get('ordering') as ProductFilterParams['ordering']) || '-created_at',
  };
  if (searchParams.get('min_price')) params.min_price = parseFloat(searchParams.get('min_price')!);
  if (searchParams.get('max_price')) params.max_price = parseFloat(searchParams.get('max_price')!);

  const { data, isLoading } = useBrandProducts(slug!, params);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Brand hero */}
      {!brandLoading && brand && (
        <div className="bg-white border-b border-[#E7E5E4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF9F6] flex items-center justify-center border border-[#E7E5E4] flex-shrink-0">
              {brand.logo ? (
                <img src={getImageUrl(brand.logo)} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl font-bold text-[#065F46]/30">{brand.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1C1917]">{brand.name}</h1>
              {brand.description && (
                <p className="text-sm text-[#78716C] mt-1 max-w-lg">{brand.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
          <Link to="/" className="hover:text-[#065F46]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/brands" className="hover:text-[#065F46]">Brands</Link>
          <ChevronRight size={12} />
          <span className="text-[#1C1917] font-medium">{brand?.name || slug}</span>
        </nav>

        <div className="flex items-start gap-8">
          <FilterSidebar mobileOpen={mobileFilterOpen} onMobileClose={() => setMobileFilterOpen(false)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm border border-[#E7E5E4] rounded-lg px-3 py-2 text-[#78716C] hover:border-[#065F46] hover:text-[#065F46] transition-colors"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <span className="text-sm text-[#78716C]">
                  {isLoading ? 'Loading...' : `${data?.count || 0} products`}
                </span>
              </div>
              <SortSelect />
            </div>

            <ProductGrid products={data?.results} loading={isLoading} skeletonCount={pageSize} />

            {!isLoading && data?.results?.length === 0 && (
              <div className="text-center py-20 flex flex-col items-center">
                <PackageSearch size={48} className="text-[#E7E5E4] mb-4" />
                <p className="text-[#78716C]">No products from this brand yet.</p>
              </div>
            )}

            {data && data.count > pageSize && (
              <Pagination count={data.count} page={page} pageSize={pageSize} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
