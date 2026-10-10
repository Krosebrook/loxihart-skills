// Abstrekkt Design System — Toast.tsx
// Includes: Toast, ToastContainer, useToast hook
import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, 0 = persistent
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

const typeConfig: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: 'bg-success-50', border: 'border-success-400', text: 'text-success-700', icon: '✓' },
  error:   { bg: 'bg-error-50',   border: 'border-error-400',   text: 'text-error-700',   icon: '✕' },
  warning: { bg: 'bg-warning-50', border: 'border-warning-400', text: 'text-warning-700', icon: '!' },
  info:    { bg: 'bg-info-50',    border: 'border-info-400',    text: 'text-info-700',    icon: 'i' },
};

function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const { bg, border, text, icon } = typeConfig[type];

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 200);
  }, [id, onClose]);

  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  return (
    <div
      className={classNames(
        'flex items-center gap-3 px-4 py-3 rounded-md border-l-4 shadow-base min-w-[280px] max-w-sm',
        bg, border, text,
        isExiting ? 'animate-slideOut' : 'animate-slideIn'
      )}
      role="status"
      aria-live="polite"
      aria-label={`${type}: ${message}`}
    >
      <span className="text-base font-bold flex-shrink-0 w-5 text-center" aria-hidden="true">
        {icon}
      </span>
      <span className="font-body text-sm flex-1">{message}</span>
      <button
        onClick={dismiss}
        className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-fast focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1 rounded-sm"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: string) => void }) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// Hook for toast management
function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]); // max 5 visible
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => add({ type: 'success', message, duration }), [add]);
  const error = useCallback((message: string, duration?: number) => add({ type: 'error', message, duration }), [add]);
  const warning = useCallback((message: string, duration?: number) => add({ type: 'warning', message, duration }), [add]);
  const info = useCallback((message: string, duration?: number) => add({ type: 'info', message, duration }), [add]);

  return { toasts, add, remove, success, error, warning, info };
}

export { Toast, ToastContainer, useToast };
export type { ToastMessage, ToastType };
