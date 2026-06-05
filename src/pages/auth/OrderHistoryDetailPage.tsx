import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Check, X, Clock, ChefHat, Package,
    CalendarDays, Hash, Utensils, Receipt, RefreshCw
} from "lucide-react"
import { orderApi } from "@/features/order/api/orderApi"
import type { Order, OrderStatus } from "@/types/order.types"
import OrderDetailLayout from "@/layout/OrderDetailLayout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RefreshButton } from "@/components/ui/RefreshButton"
import { useCartStore } from "@/store/cartStore"

// ── Status config (sama dengan OrderHistory) ──────────────────────────────────
const statusConfig: Record<OrderStatus, {
    icon: React.ReactNode
    iconColor: string
    bgColor: string
    label: string
    textClass: string
    badgeClass: string
}> = {
    completed: {
        icon: <Check size={16} />,
        iconColor: "#05df72",
        bgColor: "#D3FFE4",
        label: "Completed",
        textClass: "text-green-600",
        badgeClass: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    },
    cancelled: {
        icon: <X size={16} />,
        iconColor: "#ef4444",
        bgColor: "#FEE2E2",
        label: "Cancelled",
        textClass: "text-red-500",
        badgeClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    },
    pending: {
        icon: <Clock size={16} />,
        iconColor: "#3b82f6",
        bgColor: "#DBEAFE",
        label: "Pending",
        textClass: "text-blue-500",
        badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    },
    preparing: {
        icon: <ChefHat size={16} />,
        iconColor: "#f97316",
        bgColor: "#FFEDD5",
        label: "Preparing",
        textClass: "text-orange-500",
        badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    },
    ready: {
        icon: <Check size={16} />,
        iconColor: "#10b981",
        bgColor: "#D1FAE5",
        label: "Ready",
        textClass: "text-emerald-600",
        badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price: number | string) =>
    `Rp. ${Number(price).toLocaleString("id-ID")}`

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrderHistoryDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)
    const clearCart = useCartStore((state) => state.clearCart)

    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrder = async (showLoading = true) => {
        if (!id) return
        if (showLoading) setIsLoading(true)
        setError(null)
        try {
            const res = await orderApi.getOrderById(Number(id))
            setOrder(res.data)
        } catch {
            setError("Order tidak ditemukan atau gagal dimuat.")
        } finally {
            if (showLoading) setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [id])

    // Order again — pindahkan item ke cart lalu buka halaman order
    const handleOrderAgain = () => {
        if (!order) return
        clearCart()
        order.items.forEach((item) => {
            addItem({
                id: item.product_id,
                product_id: item.product_id,
                name: item.name,
                price: Number(item.price),
                notes: item.notes ?? null,
            })
            // Tambah kuantitas jika > 1
            for (let i = 1; i < item.quantity; i++) {
                addItem({
                    id: item.product_id,
                    product_id: item.product_id,
                    name: item.name,
                    price: Number(item.price),
                })
            }
        })
        navigate("/customer/new-order")
    }

    // Hitung summary
    const subtotal = order ? order.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity, 0
    ) : 0
    const tax = Math.round(subtotal * 0.08)
    const serviceFee = Math.round(subtotal * 0.05)
    const total = subtotal + tax + serviceFee

    const config = order ? (statusConfig[order.status] ?? statusConfig.pending) : null

    return (
        <OrderDetailLayout
            title={order ? `Detail ${order.order_number}` : "Detail Order"}
            backLabel="Orders"
            backTo="/customer/history"
            rightAction={<RefreshButton onRefresh={() => fetchOrder(true)} colorClass="text-orange-600" />}
        >
            {/* ── Loading ── */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
                    <p className="text-muted-foreground text-sm">Memuat detail order...</p>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div className="flex items-center justify-center py-32 px-4">
                    <Card className="w-full max-w-sm text-center">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Receipt className="w-8 h-8 text-destructive" />
                            </div>
                            <p className="text-destructive font-medium">{error}</p>
                            <Button variant="link" onClick={() => navigate("/customer/history")}>
                                Kembali ke History
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── Content ── */}
            {!isLoading && !error && order && config && (
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* ───── LEFT: Order Info + Items ───── */}
                    <div className="flex-1 flex flex-col gap-5">

                        {/* Order Info Card */}
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base md:text-lg">
                                            Order Detail
                                        </CardTitle>
                                        <p className="text-sm text-primary font-medium mt-0.5">
                                            {order.order_number}
                                        </p>
                                    </div>
                                    {/* Badges */}
                                    <div className="flex gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.badgeClass}`}>
                                            <span style={{ color: config.iconColor }}>{config.icon}</span>
                                            {config.label}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${order.is_paid ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}>
                                            {order.is_paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Date */}
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tanggal</p>
                                        <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <Utensils className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Meja</p>
                                        <p className="text-sm font-medium">Table {order.table_number}</p>
                                    </div>
                                </div>

                                {/* Items count */}
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <Hash className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Item</p>
                                        <p className="text-sm font-medium">{order.items.length} menu</p>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Notes */}
                            {order.notes && (
                                <>
                                    <Separator />
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs text-muted-foreground mb-1.5">Catatan Pesanan</p>
                                        <p className="text-sm text-foreground/80 italic">"{order.notes}"</p>
                                    </CardContent>
                                </>
                            )}
                        </Card>

                        {/* Items List Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Your Items</CardTitle>
                            </CardHeader>
                            <Separator />

                            <CardContent className="pt-0 pb-0 divide-y divide-border">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={item.id ?? idx}
                                        className="flex items-start gap-4 py-4"
                                    >
                                        {/* Thumbnail placeholder */}
                                        <div className="w-16 h-14 rounded-xl bg-muted shrink-0 flex items-center justify-center overflow-hidden">
                                            <Package className="w-6 h-6 text-muted-foreground/40" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold text-foreground truncate">
                                                    {item.name}
                                                </p>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {formatPrice(Number(item.price) * item.quantity)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.quantity}×
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Per unit price */}
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {formatPrice(item.price)} / item
                                            </p>

                                            {/* Item note */}
                                            {item.notes && (
                                                <p className="mt-1.5 text-xs text-primary/80 italic flex items-center gap-1">
                                                    <span className="text-primary">✎</span>
                                                    Note: {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ───── RIGHT: Payment Summary ───── */}
                    <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-5">

                        {/* Payment Summary Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Payment Summary</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p className="font-medium">{formatPrice(subtotal)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">Tax (8%)</p>
                                    <p className="font-medium">{formatPrice(tax)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">Service Fee (5%)</p>
                                    <p className="font-medium">{formatPrice(serviceFee)}</p>
                                </div>
                            </CardContent>
                            <Separator />
                            <CardFooter className="pt-4 justify-between">
                                <p className="font-bold text-base">Total</p>
                                <p className="font-bold text-base text-primary">{formatPrice(total)}</p>
                            </CardFooter>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full h-12 rounded-xl font-semibold gap-2"
                                onClick={handleOrderAgain}
                                disabled={order.status === "cancelled"}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Order Again
                            </Button>
                        </div>
                    </div>

                </div>
            )}
        </OrderDetailLayout>
    )
}
