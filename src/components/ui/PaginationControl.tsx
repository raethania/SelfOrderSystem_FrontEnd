import { useState } from "react";
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
    const [jumpPage, setJumpPage] = useState("");

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

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault();
        const p = parseInt(jumpPage, 10);
        if (!isNaN(p) && p >= 1 && p <= lastPage) {
            onPageChange(p);
            setJumpPage("");
        }
    };

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("flex flex-col items-center justify-center gap-3 mt-6", className)}
        >
            <div className="flex items-center justify-center gap-1 flex-wrap">
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
            </div>

            {/* Jump to page */}
            <form onSubmit={handleJump} className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Go to page</span>
                <input
                    type="number"
                    min={1}
                    max={lastPage}
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    className="h-9 w-14 rounded-lg border border-border bg-transparent px-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 text-center"
                    placeholder={currentPage.toString()}
                />
            </form>
        </nav>
    );
}
