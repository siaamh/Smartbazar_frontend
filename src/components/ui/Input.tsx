import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1C1917]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-white border rounded-lg px-3 py-2.5 text-sm text-[#1C1917]
              placeholder:text-[#78716C] transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#065F46]/30 focus:border-[#065F46]
              disabled:bg-[#FAF9F6] disabled:cursor-not-allowed
              ${error ? 'border-[#DC2626] focus:ring-[#DC2626]/20' : 'border-[#E7E5E4]'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[#DC2626] mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#78716C] mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
