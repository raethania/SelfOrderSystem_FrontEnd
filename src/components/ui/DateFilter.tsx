import { cn } from "@/lib/utils";

type DateFilterProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
};

/**
 * Single date filter input
 */
export function DateFilter({ value, onChange, label, className }: DateFilterProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {label && (
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {label}
                </label>
            )}
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 px-3 rounded-lg border border-input bg-transparent text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
            />
        </div>
    );
}

type DateRangeFilterProps = {
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    className?: string;
};

/**
 * Date range filter with start and end date inputs
 */
export function DateRangeFilter({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className,
}: DateRangeFilterProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            <DateFilter
                value={startDate}
                onChange={onStartDateChange}
                label="From"
            />
            <DateFilter
                value={endDate}
                onChange={onEndDateChange}
                label="To"
            />
        </div>
    );
}
