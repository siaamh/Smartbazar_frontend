import { Link } from 'react-router-dom';
import { ChevronRight, FolderOpen } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { getImageUrl } from '../utils/image';
import { Skeleton } from '../components/ui/Skeleton';

export default function CategoriesPage() {
  const { data, isLoading, error } = useCategories();
  const categories = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/" className="hover:text-[#065F46]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">Categories</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1C1917]">All Categories</h1>
        <p className="text-[#78716C] mt-2">Browse all product categories</p>
      </div>

      {error && (
        <div className="text-center py-16 text-[#DC2626]">Failed to load categories.</div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <Skeleton variant="image" className="w-full h-44" />
              <Skeleton variant="text" className="w-1/2 h-4 mt-2" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <FolderOpen size={48} className="text-[#E7E5E4] mb-4" />
          <p className="text-[#78716C]">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-[#E7E5E4] hover:shadow-md hover:border-[#065F46]/30 transition-all"
            >
              <div className="h-44 bg-[#D1FAE5] relative overflow-hidden flex items-center justify-center">
                {cat.image ? (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-[#065F46]/20 text-5xl font-bold">{cat.name.charAt(0)}</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1C1917] group-hover:text-[#065F46] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-[#78716C] mt-1 line-clamp-2">{cat.description}</p>
                )}
                {cat.children.length > 0 && (
                  <p className="text-xs text-[#B45309] mt-2 font-medium">
                    {cat.children.length} sub-categories
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
