import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CashierLayout from "@/layout/CashierLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { orderApi } from "@/features/order/api/orderApi";
import { transactionApi } from "@/features/transaction/api/transactionApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { formatDateTime } from "@/lib/formatDate";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import type { Order } from "@/types/order.types";
import type { PaymentMethod } from "@/types/transaction.types";

export default function CashierOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // Toast Notification
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Cancel Modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Payment Modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [amountPaidStr, setAmountPaidStr] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

    const handleCancelOrder = async () => {
        if (!order) return;
        setUpdatingStatus(true);
        try {
            await orderApi.updateOrderStatus(order.id, "cancelled");
            setIsCancelModalOpen(false);
            await fetchOrder();
            showToast("Order cancelled successfully.", "success");
        } catch {
            showToast("Failed to cancel order.", "error");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!order) return;
        setUpdatingStatus(true);
        try {
            await orderApi.updateOrderStatus(order.id, "completed");
            await fetchOrder();
            showToast("Order completed successfully.", "success");
        } catch {
            showToast("Failed to complete order.", "error");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleProcessPayment = async () => {
        if (!order || !paymentMethod) return;

        const amountPaid = paymentMethod === "cash" ? Number(amountPaidStr) : order.total;

        if (paymentMethod === "cash" && amountPaid < order.total) {
            showToast("Amount paid is less than the total.", "error");
            return;
        }

        setIsProcessingPayment(true);
        try {
            await transactionApi.createTransaction({
                order_id: order.id,
                payment_method: paymentMethod,
                amount_paid: amountPaid,
            });

            // Depending on backend, order might automatically become completed.
            // If not, we might need an explicit status update here.
            // Let's assume backend handles it. If it doesn't, we can add a fallback.
            setIsPaymentModalOpen(false);
            
            // Re-fetch to see the updated status
            await fetchOrder();
            
            showToast("Payment successful!", "success");
            setTimeout(() => navigate("/cashier/orders"), 1500); // Redirect after brief delay
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to process payment.", "error");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const isCancellable = order && (order.status === "pending" || order.status === "preparing" || order.status === "ready");
    const isPayable = order && order.status === "pending" && !order.is_paid;
    const isCompletable = order && order.status === "ready";

    // Computed payment values
    const amountPaidNum = Number(amountPaidStr);
    const change = Math.max(0, amountPaidNum - (order?.total || 0));
    const isValidPayment = paymentMethod && (paymentMethod !== "cash" || amountPaidNum >= (order?.total || 0));

    return (
        <CashierLayout title="Order Detail" subtitle="View and process order">
            {/* Header actions */}
            <div className="flex items-center justify-between mb-6">
                {/* Back button */}
                <button
                    onClick={() => navigate("/cashier/orders")}
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
                            <div className="flex gap-2">
                                {order.is_paid && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        PAID
                                    </span>
                                )}
                                <StatusBadge
                                    status={order.status}
                                    className="text-sm px-4 py-1.5"
                                />
                            </div>
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

                    {/* Action Buttons */}
                    {(isCancellable || isPayable || isCompletable) && (
                        <div className="flex gap-4 pt-4">
                            {isCancellable && (
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                            {isPayable && (
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Process Payment
                                </button>
                            )}
                            {isCompletable && (
                                <button
                                    onClick={handleCompleteOrder}
                                    disabled={updatingStatus}
                                    className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {updatingStatus ? "Processing..." : "Complete Order"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Cancel Modal */}
            <ConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmLabel="Yes, Cancel Order"
                isLoading={updatingStatus}
            />

            {/* Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    setPaymentMethod(null);
                    setAmountPaidStr("");
                }}
                title="Process Payment"
                maxWidth="max-w-md"
            >
                {order && (
                    <div className="space-y-6">
                        <div className="bg-accent/50 p-4 rounded-xl text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Tagihan</p>
                            <p className="text-3xl font-bold text-primary">{formatRupiah(order.total)}</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Metode Pembayaran</label>
                            <div className="grid grid-cols-3 gap-2">
                                {([
                                    { id: "cash", label: "Tunai" },
                                    { id: "qris", label: "QRIS" },
                                    { id: "card", label: "Kartu" },
                                ] as const).map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => {
                                            setPaymentMethod(method.id);
                                            if (method.id !== "cash") setAmountPaidStr(order.total.toString());
                                            else setAmountPaidStr("");
                                        }}
                                        className={`py-3 px-2 rounded-xl border font-medium transition-all ${
                                            paymentMethod === method.id
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-card border-border hover:bg-accent text-foreground"
                                        }`}
                                    >
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {paymentMethod === "cash" && (
                            <div className="space-y-3 animate-in slide-in-from-top-2">
                                <label className="text-sm font-semibold text-foreground">Uang Diterima (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={amountPaidStr}
                                    onChange={(e) => setAmountPaidStr(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-input bg-transparent text-lg font-medium outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Masukkan nominal"
                                />

                                {amountPaidStr && (
                                    <div className={`p-4 rounded-xl flex justify-between items-center ${
                                        amountPaidNum < order.total ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                                    }`}>
                                        <span className="font-semibold">Kembalian</span>
                                        <span className="text-xl font-bold">
                                            {amountPaidNum < order.total ? "Uang Kurang" : formatRupiah(change)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleProcessPayment}
                            disabled={!isValidPayment || isProcessingPayment}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isProcessingPayment ? "Memproses..." : "Konfirmasi Pembayaran"}
                        </button>
                    </div>
                )}
            </Modal>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 ${
                    toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}
        </CashierLayout>
    );
}
