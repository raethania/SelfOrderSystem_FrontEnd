import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateFilter } from "@/components/ui/DateFilter";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { orderApi } from "@/features/order/api/orderApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { formatDateTime, todayApiDate } from "@/lib/formatDate";
import type { Order, OrderStatus } from "@/types/order.types";

const STATUS_OPTIONS: { label: string; value: OrderStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
    const [dateFilter, setDateFilter] = useState(todayApiDate());
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: Record<string, unknown> = {
                page: currentPage,
                limit: 10,
                date: dateFilter,
            };
            if (statusFilter) params.status = statusFilter;

            const res = await orderApi.getOrders(params as any);
            setOrders(res.data);
            // Handle pagination meta if present
            if ("meta" in res && (res as any).meta) {
                setLastPage((res as any).meta.last_page);
            }
        } catch {
            setError("Failed to load orders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, dateFilter, currentPage]);

    const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await orderApi.updateOrderStatus(orderId, newStatus);
            fetchOrders(); // Refresh
        } catch {
            alert("Failed to update order status.");
        }
    };

    const getNextStatusOptions = (current: OrderStatus): OrderStatus[] => {
        // Only allow moving forward, no 'completed' allowed for Admin
        if (current === "pending") return ["preparing", "cancelled"];
        if (current === "preparing") return ["ready", "cancelled"];
        if (current === "ready") return ["cancelled"];
        return [];
    };

    return (
        <AdminLayout title="Orders" subtitle="Monitor and manage all orders">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                {/* Status chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setStatusFilter(opt.value);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${statusFilter === opt.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Date filter */}
                <DateFilter
                    value={dateFilter}
                    onChange={(v) => {
                        setDateFilter(v);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Orders list */}
            {!isLoading && !error && (
                <>
                    {orders.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-lg font-medium mb-1">No orders found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-card rounded-xl ring-1 ring-foreground/10 p-4 hover:ring-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/admin/orders/${order.id}`)
                                    }
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {order.order_number}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Table {order.table_number} •{" "}
                                                {formatDateTime(order.created_at)}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {order.items?.length || 0} items
                                            </span>
                                            <span className="text-sm font-semibold text-primary">
                                                {formatRupiah(order.total)}
                                            </span>
                                        </div>

                                        {/* Quick status actions */}
                                        <div
                                            className="flex gap-1.5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {getNextStatusOptions(order.status)
                                                .slice(0, 2)
                                                .map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                order.id,
                                                                s
                                                            )
                                                        }
                                                        className="px-2.5 py-1 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors capitalize"
                                                    >
                                                        → {s}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <PaginationControl
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </AdminLayout>
    );
}
