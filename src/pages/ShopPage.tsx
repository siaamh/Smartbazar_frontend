import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, PackageSearch } from 'lucide-react';
import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import SortSelect from '../components/products/SortSelect';
import Pagination from '../components/ui/Pagination';
import type { ProductFilterParams } from '../types';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  const params: ProductFilterParams = {
    page,
    page_size: pageSize,
    ordering: (searchParams.get('ordering') as ProductFilterParams['ordering']) || '-created_at',
  };
  if (searchParams.get('search')) params.search = searchParams.get('search')!;
  if (searchParams.get('category')) params.category = searchParams.get('category')!;
  if (searchParams.get('subcategory')) params.subcategory = searchParams.get('subcategory')!;
  if (searchParams.get('brand')) params.brand = searchParams.get('brand')!;
  if (searchParams.get('is_featured')) params.is_featured = true;
  if (searchParams.get('discounted')) params.discounted = true;
  if (searchParams.get('min_price')) params.min_price = parseFloat(searchParams.get('min_price')!);
  if (searchParams.get('max_price')) params.max_price = parseFloat(searchParams.get('max_price')!);

  const { data, isLoading, error } = useProducts(params);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/" className="hover:text-[#065F46]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">Shop</span>
      </nav>

      <div className="flex items-start gap-8">
        {/* Sidebar */}
        <FilterSidebar
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 text-sm border border-[#E7E5E4] rounded-lg px-3 py-2 text-[#78716C] hover:border-[#065F46] hover:text-[#065F46] transition-colors"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <h1 className="text-lg font-semibold text-[#1C1917]">
                {isLoading ? 'Loading...' : `${data?.count || 0} Products`}
              </h1>
            </div>
            <SortSelect />
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center py-16">
              <p className="text-[#DC2626] font-medium">Failed to load products.</p>
              <p className="text-sm text-[#78716C] mt-1">Please check your connection and try again.</p>
            </div>
          )}

          {/* Products */}
          {!error && (
            <>
              <ProductGrid products={data?.results} loading={isLoading} skeletonCount={pageSize} />

              {/* Empty state */}
              {!isLoading && data?.results?.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                  <PackageSearch size={48} className="text-[#E7E5E4] mb-4" />
                  <h3 className="font-semibold text-[#1C1917] mb-2">No products found</h3>
                  <p className="text-sm text-[#78716C] mb-5">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Link
                    to="/shop"
                    className="text-sm text-[#065F46] font-medium hover:underline"
                  >
                    Clear all filters
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {data && data.count > pageSize && (
                <Pagination
                  count={data.count}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
