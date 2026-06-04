import { cn } from "@/lib/utils";
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL } from "@/constants/orderStatus";
import type { OrderStatus } from "@/types/order.types";

type StatusBadgeProps = {
    status: OrderStatus;
    className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide capitalize transition-colors",
                ORDER_STATUS_CLASS[status],
                className
            )}
        >
            {ORDER_STATUS_LABEL[status]}
        </span>
    );
}
