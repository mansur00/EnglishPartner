/**
 * Pure Faceted Pagination Engine
 * Complies with Framework §5 and Milestone 1D / KI-10.
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/**
 * Paginates an array of items with safe boundary clamping.
 */
export function paginateItems<T>(
  items: T[],
  options: PaginationOptions = {}
): PaginatedResult<T> {
  const totalItems = items.length;
  const pageSize = Math.max(1, options.pageSize ?? 6);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Safe page clamping between 1 and totalPages
  const requestedPage = options.page ?? 1;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = totalItems === 0 ? [] : items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    startIndex: totalItems === 0 ? 0 : startIndex + 1,
    endIndex,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

export type PageItem = number | "...";

/**
 * Computes the visible page numbers array with ellipses.
 * Example for 10 pages when on page 5: [1, "...", 4, 5, 6, "...", 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
