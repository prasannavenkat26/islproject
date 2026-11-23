import { useToast } from '@/context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-strong toast-enter flex items-center gap-3 px-5 py-4 min-w-[280px]"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />}
          <p className="text-sm text-primary flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-primary transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
