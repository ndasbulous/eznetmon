'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  }

  // Make last item not clickable
  if (breadcrumbs.length > 1) {
    breadcrumbs[breadcrumbs.length - 1].href = undefined;
  }

  return breadcrumbs;
}

export function Breadcrumb(): ReactNode {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="px-6 py-4">
        <ol className="flex items-center gap-2" aria-label="Breadcrumb">
          {breadcrumbs.map((item: BreadcrumbItem, index: number) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              ) : null}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
