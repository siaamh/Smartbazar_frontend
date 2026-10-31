type BadgeVariant = 'discount' | 'featured' | 'new' | 'outOfStock' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  discount: 'bg-red-100 text-red-700 border border-red-200',
  featured: 'bg-amber-100 text-amber-800 border border-amber-200',
  new: 'bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/20',
  outOfStock: 'bg-gray-100 text-gray-600 border border-gray-200',
  default: 'bg-[#FAF9F6] text-[#78716C] border border-[#E7E5E4]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
