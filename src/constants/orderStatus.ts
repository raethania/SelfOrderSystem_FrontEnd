import type { OrderStatus } from "@/types/order.types";

export const ORDER_STATUS = {
    PENDING: "pending",
    PREPARING: "preparing",
    READY: "ready",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
} as const satisfies Record<string, OrderStatus>;

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled"
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
    pending: "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
    ready: "bg-green-100 text-green-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700"
};