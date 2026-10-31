import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ count, page, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E7E5E4] text-[#78716C] hover:border-[#065F46] hover:text-[#065F46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#78716C]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? 'page' : undefined}
            className={`
              flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors
              ${
                p === page
                  ? 'bg-[#065F46] text-white border border-[#065F46]'
                  : 'border border-[#E7E5E4] text-[#78716C] hover:border-[#065F46] hover:text-[#065F46]'
              }
            `}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#E7E5E4] text-[#78716C] hover:border-[#065F46] hover:text-[#065F46] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
