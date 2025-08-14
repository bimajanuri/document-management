import { useState, useCallback } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, title?: string, duration?: number) => {
    addToast({ type: "success", message, title, duration });
  }, [addToast]);

  const showError = useCallback((message: string, title?: string, duration?: number) => {
    addToast({ type: "error", message, title, duration });
  }, [addToast]);

  const showWarning = useCallback((message: string, title?: string, duration?: number) => {
    addToast({ type: "warning", message, title, duration });
  }, [addToast]);

  const showInfo = useCallback((message: string, title?: string, duration?: number) => {
    addToast({ type: "info", message, title, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
