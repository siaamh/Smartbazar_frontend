import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

export function CategoriesDropdown() {
  const { data } = useCategories();
  const categories = data?.results || [];

  if (categories.length === 0) return null;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-[#E7E5E4] rounded-xl shadow-lg z-50 min-w-[480px] p-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        {categories.map((cat) => (
          <div key={cat.id}>
            <Link
              to={`/categories/${cat.slug}`}
              className="block text-sm font-semibold text-[#1C1917] hover:text-[#065F46] py-1 transition-colors"
            >
              {cat.name}
            </Link>
            {cat.children.length > 0 && (
              <div className="pl-3 space-y-0.5 mb-2">
                {cat.children.slice(0, 4).map((child) => (
                  <Link
                    key={child.id}
                    to={`/shop?category=${cat.slug}&subcategory=${child.slug}`}
                    className="block text-xs text-[#78716C] hover:text-[#065F46] py-0.5 transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
                {cat.children.length > 4 && (
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="block text-xs text-[#B45309] hover:underline py-0.5"
                  >
                    +{cat.children.length - 4} more
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#E7E5E4]">
        <Link
          to="/categories"
          className="text-xs text-[#065F46] font-medium hover:underline"
        >
          View all categories →
        </Link>
      </div>
    </div>
  );
}

export default CategoriesDropdown;
