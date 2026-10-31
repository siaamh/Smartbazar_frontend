import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useCategory } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { getImageUrl } from '../utils/image';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import SortSelect from '../components/products/SortSelect';
import Pagination from '../components/ui/Pagination';
import type { ProductFilterParams } from '../types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: category, isLoading: catLoading } = useCategory(slug!);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;
  const activeSubcat = searchParams.get('subcategory') || '';

  const params: ProductFilterParams = {
    category: slug,
    page,
    page_size: pageSize,
    ordering: (searchParams.get('ordering') as ProductFilterParams['ordering']) || '-created_at',
  };
  if (activeSubcat) params.subcategory = activeSubcat;
  if (searchParams.get('brand')) params.brand = searchParams.get('brand')!;
  if (searchParams.get('min_price')) params.min_price = parseFloat(searchParams.get('min_price')!);
  if (searchParams.get('max_price')) params.max_price = parseFloat(searchParams.get('max_price')!);

  const { data, isLoading } = useProducts(params);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcat = (subcatSlug: string) => {
    const next = new URLSearchParams(searchParams);
    if (activeSubcat === subcatSlug) {
      next.delete('subcategory');
    } else {
      next.set('subcategory', subcatSlug);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div>
      {/* Category Banner */}
      {!catLoading && category && (
        <div className="relative h-40 sm:h-56 bg-[#D1FAE5] overflow-hidden">
          {category.image && (
            <img
              src={getImageUrl(category.image)}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#065F46]/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 mt-2 text-sm max-w-lg line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
          <Link to="/" className="hover:text-[#065F46]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/categories" className="hover:text-[#065F46]">Categories</Link>
          <ChevronRight size={12} />
          <span className="text-[#1C1917] font-medium">{category?.name || slug}</span>
        </nav>

        {/* Subcategory tabs */}
        {category?.children && category.children.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => handleSubcat('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !activeSubcat
                  ? 'bg-[#065F46] text-white'
                  : 'bg-white border border-[#E7E5E4] text-[#78716C] hover:border-[#065F46] hover:text-[#065F46]'
              }`}
            >
              All
            </button>
            {category.children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleSubcat(child.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSubcat === child.slug
                    ? 'bg-[#065F46] text-white'
                    : 'bg-white border border-[#E7E5E4] text-[#78716C] hover:border-[#065F46] hover:text-[#065F46]'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start gap-8">
          <FilterSidebar
            mobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />
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
                <p className="text-[#78716C]">No products in this category yet.</p>
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
