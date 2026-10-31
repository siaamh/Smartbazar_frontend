import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../services/api/products.api';
import { getImageUrl } from '../../utils/image';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['search-overlay', debouncedQuery],
    queryFn: () => productsApi.getProducts({ search: debouncedQuery, page_size: 6 }),
    enabled: debouncedQuery.length > 1,
    staleTime: 30000,
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const results = data?.results || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl z-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-[#E7E5E4]">
              <Search size={20} className="text-[#78716C] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 text-[#1C1917] bg-transparent outline-none text-base placeholder:text-[#78716C]"
                autoComplete="off"
              />
              {isLoading && <Loader2 size={16} className="animate-spin text-[#78716C]" />}
              <button type="button" onClick={onClose} className="text-[#78716C] hover:text-[#1C1917]" aria-label="Close search">
                <X size={20} />
              </button>
            </form>

            {debouncedQuery.length > 1 && (
              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs text-[#78716C] font-medium border-b border-[#FAF9F6]">
                      {data?.count} results for "{debouncedQuery}"
                    </div>
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF9F6] transition-colors group"
                      >
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1C1917] truncate group-hover:text-[#065F46]">
                            {product.name}
                          </p>
                          {product.brand_name && (
                            <p className="text-xs text-[#78716C]">{product.brand_name}</p>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-[#065F46]">
                          ৳{parseFloat(product.pricing.final_price).toFixed(0)}
                        </div>
                      </Link>
                    ))}
                    {(data?.count || 0) > 6 && (
                      <button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          onClose();
                        }}
                        className="w-full px-4 py-3 text-sm text-[#065F46] font-medium hover:bg-[#FAF9F6] text-center border-t border-[#E7E5E4]"
                      >
                        View all {data?.count} results →
                      </button>
                    )}
                  </>
                ) : !isLoading ? (
                  <div className="px-4 py-8 text-center text-[#78716C]">
                    <p className="text-sm">No results for "{debouncedQuery}"</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                ) : null}
              </div>
            )}

            {!debouncedQuery && (
              <div className="px-4 py-4 text-center text-sm text-[#78716C]">
                Start typing to search...
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
