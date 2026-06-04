import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Column<T> = {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    className?: string;
};

/**
 * Responsive data table that degrades to card layout on mobile.
 */
export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = "No data found.",
    className,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <>
            {/* Desktop table */}
            <div className={cn("hidden md:block overflow-x-auto", className)}>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cn("py-3 px-4", col.className)}
                                    >
                                        {col.render(item)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card layout */}
            <div className="md:hidden flex flex-col gap-3">
                {data.map((item) => (
                    <div
                        key={keyExtractor(item)}
                        className="bg-card rounded-xl ring-1 ring-foreground/10 p-4 space-y-2"
                    >
                        {columns.map((col) => (
                            <div
                                key={col.key}
                                className="flex items-start justify-between gap-2"
                            >
                                <span className="text-xs font-medium text-muted-foreground shrink-0">
                                    {col.header}
                                </span>
                                <span className="text-sm text-right">
                                    {col.render(item)}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
