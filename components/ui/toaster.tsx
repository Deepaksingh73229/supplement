'use client';

import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[420px] px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${
              toast.variant === 'destructive'
                ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-100'
                : toast.variant === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-100'
                : 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {toast.title && <p className="font-medium">{toast.title}</p>}
                {toast.description && (
                  <p className="text-sm opacity-90">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 opacity-60 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
