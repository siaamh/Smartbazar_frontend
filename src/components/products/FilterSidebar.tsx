import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import Button from '../ui/Button';

interface FilterSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({ mobileOpen = false, onMobileClose }: FilterSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceMin, setPriceMin] = useState(searchParams.get('min_price') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('max_price') || '');
  const [catOpen, setCatOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands({ page_size: 50 });

  const categories = categoriesData?.results || [];
  const brands = brandsData?.results || [];

  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeBrand = searchParams.get('brand') || '';
  const isFeatured = searchParams.get('is_featured') === 'true';
  const isDiscounted = searchParams.get('discounted') === 'true';

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleParam = (key: string, currentVal: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (currentVal) {
      next.delete(key);
    } else {
      next.set(key, 'true');
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const applyPrice = () => {
    const next = new URLSearchParams(searchParams);
    if (priceMin) next.set('min_price', priceMin); else next.delete('min_price');
    if (priceMax) next.set('max_price', priceMax); else next.delete('max_price');
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSearchParams({ page: '1' });
  };

  const hasActiveFilters =
    activeCategory || activeSubcategory || activeBrand || isFeatured || isDiscounted ||
    searchParams.get('min_price') || searchParams.get('max_price');

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#065F46]" />
          <h2 className="font-semibold text-[#1C1917]">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#DC2626] hover:underline"
            >
              Clear all
            </button>
          )}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden text-[#78716C] hover:text-[#1C1917]"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-5 pr-1">
        {/* Featured / Discounted toggles */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={() => toggleParam('is_featured', isFeatured)}
              className="w-4 h-4 rounded border-[#E7E5E4] text-[#065F46] accent-[#065F46]"
            />
            <span className="text-sm text-[#1C1917] group-hover:text-[#065F46]">Featured only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isDiscounted}
              onChange={() => toggleParam('discounted', isDiscounted)}
              className="w-4 h-4 rounded border-[#E7E5E4] accent-[#065F46]"
            />
            <span className="text-sm text-[#1C1917] group-hover:text-[#065F46]">On sale</span>
          </label>
        </div>

        <div className="border-t border-[#E7E5E4]" />

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#1C1917] mb-2"
            >
              Categories
              {catOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <button
                          onClick={() => {
                            setParam('category', activeCategory === cat.slug ? '' : cat.slug);
                            setParam('subcategory', '');
                          }}
                          className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${
                            activeCategory === cat.slug
                              ? 'bg-[#D1FAE5] text-[#065F46] font-medium'
                              : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          {cat.name}
                        </button>
                        {activeCategory === cat.slug && cat.children.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {cat.children.map((child) => (
                              <button
                                key={child.id}
                                onClick={() =>
                                  setParam(
                                    'subcategory',
                                    activeSubcategory === child.slug ? '' : child.slug
                                  )
                                }
                                className={`w-full text-left text-xs px-2 py-1 rounded-md transition-colors ${
                                  activeSubcategory === child.slug
                                    ? 'text-[#065F46] font-medium'
                                    : 'text-[#78716C] hover:text-[#1C1917]'
                                }`}
                              >
                                → {child.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="border-t border-[#E7E5E4]" />

        {/* Brands */}
        {brands.length > 0 && (
          <div>
            <button
              onClick={() => setBrandOpen((v) => !v)}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#1C1917] mb-2"
            >
              Brands
              {brandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {brandOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() =>
                          setParam('brand', activeBrand === brand.slug ? '' : brand.slug)
                        }
                        className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${
                          activeBrand === brand.slug
                            ? 'bg-[#D1FAE5] text-[#065F46] font-medium'
                            : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="border-t border-[#E7E5E4]" />

        {/* Price range */}
        <div>
          <p className="text-sm font-semibold text-[#1C1917] mb-2">Price Range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="flex-1 text-sm border border-[#E7E5E4] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#065F46]"
            />
            <span className="text-[#78716C]">–</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="flex-1 text-sm border border-[#E7E5E4] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#065F46]"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={applyPrice}
            className="mt-2 w-full"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">{content}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-72 bg-white h-full shadow-xl p-5 z-10 overflow-y-auto"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FilterSidebar;
