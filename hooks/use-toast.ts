'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notify() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const toast = { id, ...props };
  toasts = [...toasts, toast];
  notify();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 5000);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);

  useCallback(() => {
    const listener = (newToasts: Toast[]) => setLocalToasts(newToasts);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [])();

  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, []);

  return { toasts: localToasts, dismiss };
}
