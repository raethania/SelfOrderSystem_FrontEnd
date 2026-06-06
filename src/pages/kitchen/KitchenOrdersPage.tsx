import { useEffect, useState, useRef, useCallback } from "react";
import {
    Clock,
    ChefHat,
    CheckCircle2,
    X,
    Utensils,
    Hash,
    CalendarDays,
    StickyNote,
    Package,
} from "lucide-react";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { PaginationControl } from "@/components/ui/PaginationControl";
import KitchenLayout from "@/layout/KitchenLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DateFilter } from "@/components/ui/DateFilter";
import { orderApi } from "@/features/order/api/orderApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { formatDateTime, todayApiDate } from "@/lib/formatDate";
import type { Order, OrderStatus } from "@/types/order.types";

// ── Status filter options ────────────────────────────────────────────────
const STATUS_OPTIONS: { label: string; value: OrderStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

// ── Board column config ──────────────────────────────────────────────────
const BOARD_COLUMNS: {
    status: OrderStatus;
    label: string;
    icon: React.ReactNode;
    headerClass: string;
    dotClass: string;
}[] = [
        {
            status: "pending",
            label: "Pending",
            icon: <Clock size={16} />,
            headerClass: "bg-orange-50 text-orange-700 border-orange-200",
            dotClass: "bg-orange-500",
        },
        {
            status: "preparing",
            label: "Preparing",
            icon: <ChefHat size={16} />,
            headerClass: "bg-blue-50 text-blue-700 border-blue-200",
            dotClass: "bg-blue-500",
        },
        {
            status: "ready",
            label: "Ready",
            icon: <CheckCircle2 size={16} />,
            headerClass: "bg-green-50 text-green-700 border-green-200",
            dotClass: "bg-green-500",
        },
    ];

export default function KitchenOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
    const [dateFilter, setDateFilter] = useState(todayApiDate());
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Detail panel
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Status update
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Toast
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const isFetchingRef = useRef(false);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Fetch orders list (Only for List View) ────────────────────────────────────────────────
    const fetchOrders = useCallback(
        async (showLoading = true) => {
            // Check if board view is active
            const isBoard = statusFilter === "" || statusFilter === "pending" || statusFilter === "preparing" || statusFilter === "ready";
            
            if (isBoard) {
                // If board view, the BoardColumn components will fetch their own data
                if (showLoading) setIsLoading(false);
                return;
            }

            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            if (showLoading) setIsLoading(true);
            setError(null);
            try {
                const params: Record<string, unknown> = {
                    page: currentPage,
                    limit: 20, 
                    date: dateFilter,
                };
                if (statusFilter) params.status = statusFilter;

                const res = await orderApi.getOrders(params as any);
                setOrders(res.data);
                if ("meta" in res && (res as any).meta) {
                    setLastPage((res as any).meta.last_page);
                }
            } catch {
                setError("Failed to load orders. Please try again.");
            } finally {
                if (showLoading) setIsLoading(false);
                isFetchingRef.current = false;
            }
        },
        [statusFilter, dateFilter, currentPage]
    );

    // Initial + filter change
    useEffect(() => {
        fetchOrders(true);
    }, [fetchOrders, currentPage]);

    // Polling every 15 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchOrders(false);
            setRefreshTrigger(prev => prev + 1);
        }, 15000);
        return () => clearInterval(intervalId);
    }, [fetchOrders]);

    // ── Fetch order detail ───────────────────────────────────────────────
    const openDetail = async (order: Order) => {
        setSelectedOrder(null);
        setDetailLoading(true);
        try {
            const res = await orderApi.getOrderById(order.id);
            setSelectedOrder(res.data);
        } catch {
            showToast("Failed to load order detail.", "error");
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedOrder(null);
        setDetailLoading(false);
    };

    // ── Status update ────────────────────────────────────────────────────
    const handleStatusUpdate = async (
        orderId: number,
        newStatus: OrderStatus
    ) => {
        setUpdatingStatus(true);
        try {
            await orderApi.updateOrderStatus(orderId, newStatus);
            showToast(
                newStatus === "preparing"
                    ? "Order sedang diproses!"
                    : "Order telah ditandai siap!",
                "success"
            );
            // Refresh list and detail
            await fetchOrders(false);
            setRefreshTrigger(prev => prev + 1);
            // Refresh detail if same order
            if (selectedOrder && selectedOrder.id === orderId) {
                const res = await orderApi.getOrderById(orderId);
                setSelectedOrder(res.data);
            }
        } catch {
            showToast("Gagal mengubah status order.", "error");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ── Group orders by status for board ─────────────────────────────────

    // Check if board view is active (no specific status filter, or filter is one of the 3 columns)
    const isBoardView =
        statusFilter === "" ||
        statusFilter === "pending" ||
        statusFilter === "preparing" ||
        statusFilter === "ready";

    return (
        <KitchenLayout
            title="Kitchen Queue"
            subtitle="Pantau dan proses pesanan dapur"
        >
            {/* ── Filters ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-3 w-full lg:w-auto flex-1">
                    {/* Status filter - Dropdown (Mobile/Tablet) & Chips (Desktop) */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {/* Mobile/Tablet Dropdown */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as OrderStatus | "");
                                setCurrentPage(1);
                            }}
                            className="w-full lg:hidden h-11 px-4 rounded-xl border border-border bg-card text-sm font-medium outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 appearance-none"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    Status: {opt.label}
                                </option>
                            ))}
                        </select>

                        {/* Desktop Chips */}
                        <div className="hidden lg:flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setStatusFilter(opt.value);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${statusFilter === opt.value
                                        ? "bg-orange-600 text-white"
                                        : "bg-card border border-border text-foreground hover:bg-accent"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Refresh Button - Mobile/Tablet */}
                        <div className="lg:hidden shrink-0">
                            <RefreshButton
                                onRefresh={() => {
                                    fetchOrders(true);
                                    setRefreshTrigger(prev => prev + 1);
                                }}
                                colorClass="text-orange-600"
                            />
                        </div>
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

                {/* Refresh Button - Desktop */}
                <div className="hidden lg:block shrink-0">
                    <RefreshButton
                        onRefresh={() => {
                            fetchOrders(true);
                            setRefreshTrigger(prev => prev + 1);
                        }}
                        colorClass="text-orange-600"
                    />
                </div>
            </div>

            {/* ── Loading ── */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full" />
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">
                        {error}
                    </p>
                    <button
                        onClick={() => {
                            fetchOrders(true);
                            setRefreshTrigger(prev => prev + 1);
                        }}
                        className="text-orange-600 underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Content ── */}
            {!isLoading && !error && (
                <div className="relative">
                    {orders.length === 0 && !isBoardView ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <ChefHat
                                size={48}
                                className="mx-auto mb-4 text-muted-foreground/30"
                            />
                            <p className="text-lg font-medium mb-1">
                                Tidak ada pesanan
                            </p>
                            <p className="text-sm">
                                Pesanan akan muncul di sini saat tersedia
                            </p>
                        </div>
                    ) : isBoardView ? (
                        /* ── Board View ── */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {BOARD_COLUMNS.map((col) => {
                                // If a specific status is filtered, only show that column
                                if (
                                    statusFilter !== "" &&
                                    statusFilter !== col.status
                                )
                                    return null;

                                return (
                                    <BoardColumn 
                                        key={col.status}
                                        col={col}
                                        dateFilter={dateFilter}
                                        refreshTrigger={refreshTrigger}
                                        onOpenDetail={openDetail}
                                        selectedOrderId={selectedOrder?.id}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        /* ── List View (for completed/cancelled) ── */
                        <div className="flex flex-col gap-3">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onClick={() => openDetail(order)}
                                    isSelected={
                                        selectedOrder?.id === order.id
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {!isBoardView && orders.length > 0 && (
                        <div className="mt-6">
                            <PaginationControl
                                currentPage={currentPage}
                                lastPage={lastPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}

                    {/* ── Detail Panel (slide-in) ── */}
                    {(selectedOrder || detailLoading) && (
                        <DetailPanel
                            order={selectedOrder}
                            isLoading={detailLoading}
                            isUpdating={updatingStatus}
                            onClose={closeDetail}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    )}
                </div>
            )}

            {/* ── Toast ── */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 ${toast.type === "success"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                        }`}
                >
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}
        </KitchenLayout>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ── Sub-components ──
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Individual Board Column with independent fetching and pagination
 */
function BoardColumn({
    col,
    dateFilter,
    refreshTrigger,
    onOpenDetail,
    selectedOrderId
}: {
    col: typeof BOARD_COLUMNS[0];
    dateFilter: string;
    refreshTrigger: number;
    onOpenDetail: (order: Order) => void;
    selectedOrderId?: number;
}) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const isFetchingRef = useRef(false);

    const fetchColumnOrders = useCallback(async (showLoading = true) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        if (showLoading) setIsLoading(true);
        try {
            const res = await orderApi.getOrders({
                status: col.status,
                date: dateFilter,
                page: currentPage,
                limit: 5 // 5 items per page in column view is manageable
            });
            setOrders(res.data);
            if ("meta" in res && (res as any).meta) {
                setLastPage((res as any).meta.last_page);
                setTotalItems((res as any).meta.total || res.data.length);
            } else {
                setTotalItems(res.data.length);
            }
        } catch {
            // silent fail for column
        } finally {
            if (showLoading) setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [col.status, dateFilter, currentPage]);

    useEffect(() => {
        fetchColumnOrders(true);
    }, [fetchColumnOrders]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchColumnOrders(false);
        }
    }, [refreshTrigger, fetchColumnOrders]);

    return (
        <div className="flex flex-col h-full bg-accent/20 rounded-2xl p-2 border border-border/50">
            {/* Column header */}
            <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border mb-3 ${col.headerClass}`}
            >
                <span
                    className={`w-2.5 h-2.5 rounded-full ${col.dotClass} animate-pulse`}
                />
                <span className="font-semibold text-sm">
                    {col.label}
                </span>
                <span className="ml-auto text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">
                    {totalItems}
                </span>
            </div>

            {/* Column orders */}
            <div className="flex flex-col gap-3 min-h-[120px] flex-1 relative">
                {isLoading && orders.length === 0 ? (
                    <div className="flex justify-center items-center py-10">
                        <div className={`animate-spin w-6 h-6 border-2 border-t-transparent rounded-full border-${col.dotClass.split('-')[1]}-500`} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground/50 text-xs">
                        Tidak ada pesanan
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => onOpenDetail(order)}
                            isSelected={selectedOrderId === order.id}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && lastPage > 1 && (
                <div className="mt-4 pt-3 border-t border-border/50">
                    <PaginationControl
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Order card shown in board columns and list view
 */
function OrderCard({
    order,
    onClick,
    isSelected,
}: {
    order: Order;
    onClick: () => void;
    isSelected: boolean;
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-card rounded-xl ring-1 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected
                ? "ring-orange-400 shadow-md shadow-orange-100"
                : "ring-foreground/10 hover:ring-orange-300"
                }`}
        >
            {/* Row 1: order number */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-bold text-foreground">
                    {order.order_number}
                </p>
                <div className="flex gap-1.5 items-center shrink-0">
                    {order.is_paid !== undefined && (
                        <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.is_paid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {order.is_paid ? "PAID" : "UNPAID"}
                        </span>
                    )}
                    <StatusBadge status={order.status} />
                </div>
            </div>

            {/* Row 2: table + time */}
            <p className="text-xs text-muted-foreground mb-2">
                <span className="font-medium text-foreground/70">
                    Table {order.table_number}
                </span>{" "}
                · {formatDateTime(order.created_at)}
            </p>

            {/* Row 3: items + total */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {order.items?.length || 0} items
                </span>
                <span className="text-sm font-semibold text-orange-600">
                    {formatRupiah(order.total)}
                </span>
            </div>
        </div>
    );
}

/**
 * Slide-in detail panel
 */
function DetailPanel({
    order,
    isLoading,
    isUpdating,
    onClose,
    onStatusUpdate,
}: {
    order: Order | null;
    isLoading: boolean;
    isUpdating: boolean;
    onClose: () => void;
    onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}) {
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-card border-l border-border shadow-2xl z-[100] animate-in slide-in-from-right duration-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">
                        Detail Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full" />
                        </div>
                    )}

                    {!isLoading && order && (
                        <div className="space-y-5">
                            {/* ── Order info ── */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-base font-bold text-foreground">
                                            {order.order_number}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatDateTime(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                        {order.is_paid !== undefined && (
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${order.is_paid
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {order.is_paid
                                                    ? "PAID"
                                                    : "UNPAID"}
                                            </span>
                                        )}
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 bg-accent/50 rounded-lg p-2.5">
                                        <Utensils
                                            size={14}
                                            className="text-muted-foreground shrink-0"
                                        />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Meja
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {order.table_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-accent/50 rounded-lg p-2.5">
                                        <Hash
                                            size={14}
                                            className="text-muted-foreground shrink-0"
                                        />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Items
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {order.items?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-accent/50 rounded-lg p-2.5">
                                        <CalendarDays
                                            size={14}
                                            className="text-muted-foreground shrink-0"
                                        />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">
                                                Total
                                            </p>
                                            <p className="text-sm font-bold text-orange-600">
                                                {formatRupiah(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Order notes ── */}
                            {order.notes && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <StickyNote
                                            size={14}
                                            className="text-amber-600"
                                        />
                                        <p className="text-xs font-semibold text-amber-700">
                                            Catatan Pesanan
                                        </p>
                                    </div>
                                    <p className="text-sm text-amber-900 italic">
                                        "{order.notes}"
                                    </p>
                                </div>
                            )}

                            {/* ── Items list ── */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Package
                                        size={14}
                                        className="text-muted-foreground"
                                    />
                                    Daftar Item
                                </h3>
                                <div className="space-y-2">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-accent/30 rounded-xl p-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {item.quantity}×{" "}
                                                        {formatRupiah(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-foreground shrink-0">
                                                    {formatRupiah(
                                                        item.quantity *
                                                        item.price
                                                    )}
                                                </p>
                                            </div>
                                            {/* Item notes — emphasized */}
                                            {item.notes && (
                                                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-amber-800 italic flex items-center gap-1">
                                                        <span className="text-amber-600 font-bold">
                                                            ✎
                                                        </span>
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Total ── */}
                            <div className="bg-accent/50 rounded-xl px-4 py-3 flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    Grand Total
                                </span>
                                <span className="text-lg font-bold text-orange-600">
                                    {formatRupiah(order.total)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Action footer ── */}
                {!isLoading && order && (
                    <div className="px-6 py-4 border-t border-border shrink-0">
                        {order.status === "pending" && (
                            <button
                                onClick={() =>
                                    onStatusUpdate(order.id, "preparing")
                                }
                                disabled={isUpdating}
                                className="w-full h-12 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <ChefHat size={18} />
                                {isUpdating
                                    ? "Memproses..."
                                    : "Mulai Proses"}
                            </button>
                        )}

                        {order.status === "preparing" && (
                            <button
                                onClick={() =>
                                    onStatusUpdate(order.id, "ready")
                                }
                                disabled={isUpdating}
                                className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                {isUpdating
                                    ? "Memproses..."
                                    : "Tandai Siap"}
                            </button>
                        )}

                        {order.status === "ready" && (
                            <div className="w-full h-12 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold flex items-center justify-center gap-2 text-sm">
                                <CheckCircle2 size={16} />
                                Pesanan siap diambil
                            </div>
                        )}

                        {(order.status === "completed" ||
                            order.status === "cancelled") && (
                                <div className="w-full h-12 rounded-xl bg-accent/50 text-muted-foreground font-medium flex items-center justify-center gap-2 text-sm">
                                    {order.status === "completed"
                                        ? "Pesanan telah selesai"
                                        : "Pesanan dibatalkan"}
                                </div>
                            )}
                    </div>
                )}
            </div>
        </>
    );
}
