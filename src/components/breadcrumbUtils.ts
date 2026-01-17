export function generateBreadcrumbs(pathname: string) {
  interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

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
