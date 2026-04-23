interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

/**
 * Formats a path segment into a readable title
 * - Converts kebab-case to Title Case
 * - Converts snake_case to Title Case
 * - Handles special cases like IDs and common abbreviations
 */
export function formatPathSegment(segment: string): string {
  // Handle empty segments
  if (!segment) return '';

  // Special cases for common path segments
  const specialCases: Record<string, string> = {
    'rwa': 'RWA',
    'nft': 'NFT',
    'id': 'ID',
    'faq': 'FAQ',
    'usdc': 'USDC',
    'yxml': 'yXLM',
    'api': 'API',
    'ui': 'UI',
    'ux': 'UX',
  };

  // Check if segment matches a special case (case insensitive)
  const lowerSegment = segment.toLowerCase();
  if (specialCases[lowerSegment]) {
    return specialCases[lowerSegment];
  }

  // Handle INV-123 pattern (invoice IDs)
  if (/^inv-\d+$/i.test(segment)) {
    return segment.toUpperCase();
  }

  // Handle UUID patterns or long alphanumeric strings
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(segment)) {
    return segment.slice(0, 8).toUpperCase();
  }

  // Handle pure numbers (likely IDs)
  if (/^\d+$/.test(segment)) {
    return `#${segment}`;
  }

  // Convert kebab-case and snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates breadcrumb items from a pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading/trailing slashes and split by slash
  const segments = pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
  
  // If we're at the root, return home breadcrumb
  if (segments.length === 0) {
    return [{
      label: 'Marketplace',
      href: '/',
      isActive: true,
    }];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add home as first breadcrumb
  breadcrumbs.push({
    label: 'Marketplace',
    href: '/',
    isActive: false,
  });

  // Build up the path incrementally
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label: formatPathSegment(segment),
      href: currentPath,
      isActive: isLast,
    });
  });

  return breadcrumbs;
}

/**
 * Gets a page title from breadcrumbs
 */
export function getPageTitle(breadcrumbs: BreadcrumbItem[]): string {
  if (breadcrumbs.length === 0) return 'TradeFlow';
  
  const activeBreadcrumb = breadcrumbs.find(b => b.isActive);
  return activeBreadcrumb?.label || 'TradeFlow';
}
