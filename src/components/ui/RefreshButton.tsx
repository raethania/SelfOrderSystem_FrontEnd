import { useState } from "react";
import { RefreshCw } from "lucide-react";

type RefreshButtonProps = {
    onRefresh: () => Promise<void> | void;
    /** Optional label shown next to the icon on desktop */
    label?: string;
    /** Primary accent color class — defaults to "text-primary" */
    colorClass?: string;
};

/**
 * A reusable refresh button that re-fetches data for the current page
 * without doing a full browser reload.
 *
 * Shows a spinning animation while loading and prevents rapid double-clicks.
 */
export function RefreshButton({
    onRefresh,
    label = "Refresh",
    colorClass = "text-primary",
}: RefreshButtonProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleClick = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            // Brief minimum duration so the animation is visible
            setTimeout(() => setIsRefreshing(false), 400);
        }
    };

    return (
        <button
            id="refresh-data-btn"
            onClick={handleClick}
            disabled={isRefreshing}
            title="Refresh data halaman ini"
            className={`
                group inline-flex items-center gap-2 h-10 px-4 rounded-xl
                border border-border bg-card
                text-sm font-medium
                transition-all duration-200
                hover:bg-accent hover:border-ring hover:shadow-sm
                active:scale-[0.97]
                disabled:opacity-60 disabled:pointer-events-none
                ${colorClass}
            `}
        >
            <RefreshCw
                size={16}
                className={`
                    transition-transform duration-500 ease-in-out
                    ${isRefreshing ? "animate-spin" : "group-hover:rotate-90"}
                `}
            />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
