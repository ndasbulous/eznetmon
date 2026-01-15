import type { ReactNode } from 'react';
import { Sidebar } from '@/src/components/Sidebar';
import { Breadcrumb } from '@/src/components/Breadcrumb';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Breadcrumb Header */}
        <Breadcrumb />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <article className="p-6">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
