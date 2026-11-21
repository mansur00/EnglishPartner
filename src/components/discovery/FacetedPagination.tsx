"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { getPageNumbers } from "@/lib/pagination/faceted-pagination";

export interface FacetedPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function FacetedPagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  className,
}: FacetedPaginationProps) {
  if (totalPages <= 1 && totalItems <= 0) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border",
        className
      )}
    >
      {/* Items range display */}
      <div className="text-chip text-muted-foreground">
        Showing <span className="text-foreground">{startIndex}</span>–
        <span className="text-foreground">{endIndex}</span> of{" "}
        <span className="text-foreground">{totalItems}</span> items
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
            className="rounded-control gap-1 text-chip"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          {/* Number Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-chip text-muted-foreground select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = p === currentPage;
              return (
                <Button
                  key={`page-${p}`}
                  variant={isCurrent ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => onPageChange(p)}
                  aria-label={`Page ${p}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "rounded-control text-chip font-mono",
                    isCurrent && "shadow-xs"
                  )}
                >
                  {p}
                </Button>
              );
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
            className="rounded-control gap-1 text-chip"
          >
            <span className="hidden sm:inline">Next</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </div>
      )}
    </nav>
  );
}
