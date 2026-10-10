// Abstrekkt Design System — Navbar.tsx
import React, { useState } from 'react';
import classNames from 'classnames';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavbarProps {
  logo: string;
  items: NavItem[];
  onNavClick?: (href: string) => void;
  userMenu?: React.ReactNode;
}

function Navbar({ logo, items, onNavClick, userMenu }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-display font-bold text-primary-700 tracking-tight">
            {logo}
          </span>

          <div className="hidden md:flex items-center gap-8" role="list">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                role="listitem"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick?.(item.href);
                }}
                className={classNames(
                  'text-sm font-semi transition-colors duration-fast',
                  item.isActive
                    ? 'text-primary-700 border-b-2 border-primary-400 pb-0.5'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {userMenu}
            <button
              className="md:hidden p-2 rounded-base text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-neutral-200" role="list">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                role="listitem"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick?.(item.href);
                  setMobileMenuOpen(false);
                }}
                className={classNames(
                  'block px-4 py-3 text-sm font-semi transition-colors duration-fast',
                  item.isActive
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
export type { NavbarProps, NavItem };
