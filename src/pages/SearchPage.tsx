import { useSearchParams, Link } from 'react-router-dom';
import { Search, PackageSearch } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  const { data, isLoading, error } = useProducts({
    search: query,
    page,
    page_size: pageSize,
  });

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Search size={22} className="text-[#065F46]" />
        <div>
          {query ? (
            <>
              <h1 className="text-2xl font-bold text-[#1C1917]">
                Results for "{query}"
              </h1>
              {!isLoading && (
                <p className="text-sm text-[#78716C] mt-0.5">
                  {data?.count || 0} products found
                </p>
              )}
            </>
          ) : (
            <h1 className="text-2xl font-bold text-[#1C1917]">Search Products</h1>
          )}
        </div>
      </div>

      {!query && (
        <div className="text-center py-20">
          <Search size={48} className="text-[#E7E5E4] mx-auto mb-4" />
          <p className="text-[#78716C]">Enter a search term in the search bar above to find products.</p>
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-[#DC2626]">Search failed. Please try again.</div>
      )}

      {query && !error && (
        <>
          <ProductGrid products={data?.results} loading={isLoading} skeletonCount={pageSize} />

          {!isLoading && data?.results?.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
              <PackageSearch size={48} className="text-[#E7E5E4] mb-4" />
              <h3 className="font-semibold text-[#1C1917] mb-2">No results found</h3>
              <p className="text-sm text-[#78716C] mb-5">
                We couldn't find any products matching "{query}".
              </p>
              <Link to="/shop" className="text-sm text-[#065F46] font-medium hover:underline">
                Browse all products →
              </Link>
            </div>
          )}

          {data && data.count > pageSize && (
            <Pagination count={data.count} page={page} pageSize={pageSize} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
