import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/layout/AdminLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { orderApi } from "@/features/order/api/orderApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { formatDateTime } from "@/lib/formatDate";
import type { Order, OrderStatus } from "@/types/order.types";

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrder = async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await orderApi.getOrderById(Number(id));
            setOrder(res.data);
        } catch {
            setError("Failed to load order details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        if (!order) return;
        setUpdatingStatus(true);
        try {
            await orderApi.updateOrderStatus(order.id, newStatus);
            await fetchOrder();
        } catch {
            alert("Failed to update order status.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <AdminLayout title="Order Detail" subtitle="View and manage order">
            {/* Header actions */}
            <div className="flex items-center justify-between mb-6">
                {/* Back button */}
                <button
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Orders
                </button>
                <RefreshButton onRefresh={fetchOrder} />
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
                        onClick={fetchOrder}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Order detail */}
            {!isLoading && !error && order && (
                <div className="space-y-6">
                    {/* Header card */}
                    <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    {order.order_number}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatDateTime(order.created_at)}
                                </p>
                            </div>
                            <StatusBadge
                                status={order.status}
                                className="text-sm px-4 py-1.5"
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Table Number
                                </p>
                                <p className="text-sm font-semibold">
                                    {order.table_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total Items
                                </p>
                                <p className="text-sm font-semibold">
                                    {order.items?.length || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total
                                </p>
                                <p className="text-sm font-bold text-primary">
                                    {formatRupiah(order.total)}
                                </p>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="mt-4 p-3 bg-accent/50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">
                                    Order Notes
                                </p>
                                <p className="text-sm text-foreground">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Order Items
                            </h3>
                        </div>

                        <div className="divide-y divide-border/50">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="px-6 py-4 flex items-center justify-between gap-4"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {item.name}
                                        </p>
                                        {item.notes && (
                                            <p className="text-xs text-muted-foreground mt-0.5 italic">
                                                "{item.notes}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm text-foreground">
                                            {item.quantity}x{" "}
                                            {formatRupiah(item.price)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatRupiah(
                                                item.quantity * item.price
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="px-6 py-4 bg-accent/30 border-t border-border flex justify-between items-center">
                            <span className="text-sm font-semibold text-foreground">
                                Grand Total
                            </span>
                            <span className="text-lg font-bold text-primary">
                                {formatRupiah(order.total)}
                            </span>
                        </div>
                    </div>

                    {/* Status Update Actions */}
                    {order.status !== "completed" && order.status !== "cancelled" && (
                        <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6">
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                                Update Status
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    // Determine allowed next statuses (move forward only, no 'completed')
                                    let allowedNext: OrderStatus[] = [];
                                    if (order.status === "pending") {
                                        allowedNext = ["preparing", "cancelled"];
                                    } else if (order.status === "preparing") {
                                        allowedNext = ["ready", "cancelled"];
                                    } else if (order.status === "ready") {
                                        allowedNext = ["cancelled"]; // Cannot move to completed per requirement
                                    }

                                    return allowedNext.map((status) => {
                                        const colorMap: Record<string, string> = {
                                            preparing:
                                                "border-orange-200 hover:bg-orange-50 text-orange-700",
                                            ready: "border-green-200 hover:bg-green-50 text-green-700",
                                            cancelled:
                                                "border-red-200 hover:bg-red-50 text-red-700",
                                        };

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(status)}
                                                disabled={updatingStatus}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors capitalize disabled:opacity-50 ${colorMap[status]}`}
                                            >
                                                → {status}
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
