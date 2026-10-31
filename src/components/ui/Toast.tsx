import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Toast as ToastType } from '../../stores/toastStore';
import { useToastStore } from '../../stores/toastStore';

const iconMap = {
  success: <CheckCircle size={18} className="text-[#065F46]" />,
  error: <AlertCircle size={18} className="text-red-600" />,
  info: <Info size={18} className="text-blue-600" />,
  warning: <AlertTriangle size={18} className="text-amber-600" />,
};

const bgMap = {
  success: 'bg-white border-[#065F46]/30',
  error: 'bg-white border-red-200',
  info: 'bg-white border-blue-200',
  warning: 'bg-white border-amber-200',
};

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md
        min-w-72 max-w-sm pointer-events-auto
        ${bgMap[toast.type]}
      `}
    >
      <span className="flex-shrink-0">{iconMap[toast.type]}</span>
      <p className="text-sm text-[#1C1917] flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-[#78716C] hover:text-[#1C1917] transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export default Toast;
