/**
 * Format a date string to a human-readable format.
 * Example: formatDate("2026-06-04T08:00:00") → "4 Jun 2026"
 */
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Format a date string to include time.
 * Example: formatDateTime("2026-06-04T08:00:00") → "4 Jun 2026, 08:00"
 */
export function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Convert a Date to YYYY-MM-DD format for API queries.
 */
export function toApiDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/**
 * Get today's date in YYYY-MM-DD format.
 */
export function todayApiDate(): string {
    return toApiDate(new Date());
}

/**
 * Get a date N days ago in YYYY-MM-DD format.
 */
export function daysAgoApiDate(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toApiDate(d);
}
