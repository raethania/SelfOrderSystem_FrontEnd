import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationControlProps = {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    className?: string;
};

export function PaginationControl({
    currentPage,
    lastPage,
    onPageChange,
    className,
}: PaginationControlProps) {
    if (lastPage <= 1) return null;

    // Generate page numbers to show
    const pages: (number | "ellipsis")[] = [];
    const delta = 1; // pages around current to show

    for (let i = 1; i <= lastPage; i++) {
        if (
            i === 1 ||
            i === lastPage ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            pages.push(i);
        } else if (
            pages[pages.length - 1] !== "ellipsis"
        ) {
            pages.push("ellipsis");
        }
    }

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("flex items-center justify-center gap-1 mt-6", className)}
        >
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center justify-center size-9 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {pages.map((page, i) =>
                page === "ellipsis" ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="inline-flex items-center justify-center size-9 text-sm text-muted-foreground"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "inline-flex items-center justify-center size-9 rounded-lg text-sm font-medium transition-colors",
                            page === currentPage
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-accent"
                        )}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="inline-flex items-center justify-center size-9 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}
