'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
  duration?: number;
}

let toastCount = 0;

let listeners: Array<(toast: Toast) => void> = [];

function dispatchToast(toast: Omit<Toast, 'id'>) {
  const id = String(++toastCount);
  const newToast = { ...toast, id };
  listeners.forEach((listener) => listener(newToast));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = String(++toastCount);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 3000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (props: Omit<Toast, 'id'>) => addToast(props),
    [addToast]
  );

  const success = useCallback(
    (description: string, title = 'Success') => addToast({ title, description, variant: 'success' }),
    [addToast]
  );

  const error = useCallback(
    (description: string, title = 'Error') => addToast({ title, description, variant: 'destructive' }),
    [addToast]
  );

  return { toasts, toast, success, error, removeToast };
}

export { dispatchToast };
