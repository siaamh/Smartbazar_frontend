import { Truck, Sparkles } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#065F46] text-white text-xs py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Truck size={13} />
          Free shipping on orders over ৳999
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Sparkles size={13} />
          New arrivals every week
        </span>
      </div>
    </div>
  );
}

export default AnnouncementBar;
