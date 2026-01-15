'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Settings, BarChart3, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
  },
  {
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
  },
];

export function Sidebar(): ReactNode {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const toggleMinimize = (): void => {
    setIsMinimized((prev: boolean) => !prev);
  };

  return (
    <aside
      className={`
        flex flex-col border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${isMinimized ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isMinimized ? (
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            EZNetMon
          </h1>
        ) : null}
        <button
          onClick={toggleMinimize}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          {isMinimized ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item: NavItem) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title={isMinimized ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!isMinimized ? (
              <span className="text-sm font-medium">{item.label}</span>
            ) : null}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 p-2">
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Logout"
        >
          <span className="flex-shrink-0">
            <LogOut className="w-5 h-5" />
          </span>
          {!isMinimized ? (
            <span className="text-sm font-medium">Logout</span>
          ) : null}
        </button>
      </footer>
    </aside>
  );
}
