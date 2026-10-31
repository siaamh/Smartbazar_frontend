import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#1C1917]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full appearance-none bg-white border rounded-lg px-3 py-2.5 pr-9 text-sm text-[#1C1917]
              transition-colors focus:outline-none focus:ring-2 focus:ring-[#065F46]/30 focus:border-[#065F46]
              disabled:bg-[#FAF9F6] disabled:cursor-not-allowed
              ${error ? 'border-[#DC2626]' : 'border-[#E7E5E4]'}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#DC2626] mt-0.5">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
