import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-[#D1FAE5] mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#1C1917] mb-3">Page not found</h1>
        <p className="text-[#78716C] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#065F46] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-[#E7E5E4] text-[#78716C] px-6 py-3 rounded-xl font-semibold text-sm hover:border-[#065F46] hover:text-[#065F46] transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
