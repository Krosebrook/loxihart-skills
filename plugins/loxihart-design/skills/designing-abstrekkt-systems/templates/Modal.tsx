// Abstrekkt Design System — Modal.tsx
// Focus-trapped, portal-rendered, ARIA-complete
import React, { ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: ModalSize;
  isDismissible?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
};

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function Modal({ isOpen, onClose, title, children, actions, size = 'md', isDismissible = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title';

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusable?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDismissible) {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, [isOpen, isDismissible, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="fixed inset-0 bg-surface-overlay animate-fadeIn"
        aria-hidden="true"
        onClick={isDismissible ? onClose : undefined}
      />
      <div
        ref={modalRef}
        className={classNames(
          'relative bg-white rounded-lg shadow-lg p-6',
          'max-h-[90vh] overflow-y-auto',
          'animate-scaleIn',
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between mb-6 gap-4">
          <h2 id={titleId} className="text-2xl font-display font-bold text-neutral-900 leading-tight">
            {title}
          </h2>
          {isDismissible && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 text-neutral-500 hover:text-neutral-900 rounded-base transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="mb-6 text-base font-body text-neutral-700 leading-normal">{children}</div>
        {actions && <div className="flex justify-end gap-3">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
export type { ModalProps, ModalSize };
