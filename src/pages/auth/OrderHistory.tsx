import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import CustomerLayout from "@/layout/CustomerLayout"
import { Check, X, Clock, ChefHat, Receipt } from "lucide-react"
import { orderApi } from "@/features/order/api/orderApi"
import { RefreshButton } from "@/components/ui/RefreshButton"
import type { Order, OrderStatus } from "@/types/order.types"

const statusConfig: Record<OrderStatus, {
    icon: React.ReactNode
    iconColor: string
    bgColor: string
    label: string
    textClass: string
}> = {
    completed: {
        icon: <Check size={20} />,
        iconColor: "#05df72",
        bgColor: "#D3FFE4",
        label: "Completed",
        textClass: "text-green-500",
    },
    cancelled: {
        icon: <X size={20} />,
        iconColor: "#ef4444",
        bgColor: "#FEE2E2",
        label: "Cancelled",
        textClass: "text-red-500",
    },
    pending: {
        icon: <Clock size={20} />,
        iconColor: "#3b82f6",
        bgColor: "#DBEAFE",
        label: "Pending",
        textClass: "text-blue-500",
    },
    preparing: {
        icon: <ChefHat size={20} />,
        iconColor: "#f97316",
        bgColor: "#FFEDD5",
        label: "Preparing",
        textClass: "text-orange-500",
    },
    ready: {
        icon: <Check size={20} />,
        iconColor: "#10b981",
        bgColor: "#D1FAE5",
        label: "Ready",
        textClass: "text-emerald-500",
    },
}

export default function OrderHistory() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const fetchOrders = async (pageNum: number, append = false) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await orderApi.getOrders({ page: pageNum, limit: 10 })
            const data = response.data

            if (append) {
                setOrders((prev) => [...prev, ...data])
            } else {
                setOrders(data)
            }

            // If fewer items than limit, no more pages
            setHasMore(data.length >= 10)
        } catch {
            setError("Failed to load order history.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders(1)
    }, [])

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchOrders(nextPage, true)
    }

    const formatPrice = (price: number) => {
        return `Rp. ${Number(price).toLocaleString("id-ID")}`
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <CustomerLayout title="Order History" subtitle="View all your orders">
            {/* Action Bar */}
            <div className="flex justify-end mb-4">
                <RefreshButton onRefresh={() => {
                    setPage(1)
                    return fetchOrders(1, false)
                }} colorClass="text-orange-600" />
            </div>

            {/* Loading (initial) */}
            {isLoading && orders.length === 0 && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <button
                        onClick={() => fetchOrders(1)}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && orders.length === 0 && (
                <div className="text-center py-16">
                    <Receipt size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground">Your order history will appear here</p>
                </div>
            )}

            {/* Order list */}
            {orders.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {orders.map((order) => {
                            const config = statusConfig[order.status] || statusConfig.pending

                            return (
                                <Card
                                    key={order.id}
                                    className="flex-row px-4 py-3 items-center hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/customer/history/${order.id}`)}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: config.bgColor,
                                            color: config.iconColor,
                                        }}
                                    >
                                        {config.icon}
                                    </div>
                                    <CardHeader className="flex-1 min-w-0">
                                        <CardTitle className="text-sm md:text-base truncate">
                                            Order {order.order_number}
                                        </CardTitle>
                                        <CardDescription className="text-xs md:text-sm">
                                            Table {order.table_number} · {order.items?.length || 0} items<br />
                                            {formatDate(order.created_at)}
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${order.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {order.is_paid ? 'PAID' : 'UNPAID'}
                                                </span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 text-right shrink-0">
                                        <p className={`text-xs md:text-sm font-medium ${config.textClass}`}>
                                            {config.label}
                                        </p>
                                        <p className="text-sm md:text-base text-primary font-bold">
                                            {formatPrice(order.total)}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Load more */}
                    {hasMore && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </CustomerLayout>
    )
}
