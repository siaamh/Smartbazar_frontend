import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'created_at', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export function SortSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('ordering') || '-created_at';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('ordering', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-[#78716C] whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={current}
        onChange={handleChange}
        className="text-sm border border-[#E7E5E4] rounded-lg px-3 py-2 bg-white text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#065F46]/30 focus:border-[#065F46]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortSelect;
