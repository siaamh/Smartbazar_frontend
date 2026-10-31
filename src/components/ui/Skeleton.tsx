type SkeletonVariant = 'text' | 'card' | 'image' | 'circle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ variant = 'text', className = '', width, height }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#E7E5E4] rounded';

  const variantClasses: Record<SkeletonVariant, string> = {
    text: 'h-4 rounded',
    card: 'rounded-xl',
    image: 'rounded-lg',
    circle: 'rounded-full',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E7E5E4]">
      <Skeleton variant="image" className="w-full h-52" />
      <div className="p-4 space-y-2">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-3/4 h-4" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <div className="flex gap-2 pt-1">
          <Skeleton variant="text" className="w-16 h-6" />
          <Skeleton variant="text" className="w-12 h-6" />
        </div>
        <Skeleton variant="text" className="w-full h-9 mt-2" />
      </div>
    </div>
  );
}

export default Skeleton;
