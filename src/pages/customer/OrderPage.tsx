import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import OrderCard from "@/features/order/components/OrderCard"
import Price from "@/features/order/components/Price"
import SpecialIntruction from "@/features/order/components/SpecialIntruction"
import CustomerLayout from "@/layout/CustomerLayout"
import { useCartStore } from "@/store/cartStore"
import { orderApi } from "@/features/order/api/orderApi"

export default function OrderPage() {
    const navigate = useNavigate()
    const items = useCartStore((state) => state.items)
    const notes = useCartStore((state) => state.notes)
    const tableNumber = useCartStore((state) => state.tableNumber)
    const getSubtotal = useCartStore((state) => state.getSubtotal)
    const clearCart = useCartStore((state) => state.clearCart)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const subtotal = getSubtotal()

    const handlePayment = async () => {
        if (items.length === 0) return

        if (!tableNumber) {
            setError("Please enter your table number before making payment.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await orderApi.createOrder({
                table_number: tableNumber,
                notes: notes || null,
                items: items.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    notes: item.notes || null,
                })),
            })

            clearCart()
            navigate("/customer/history")
        } catch (err: any) {
            setError(err?.message || "Failed to create order. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <CustomerLayout title="Order Summary" subtitle="Review items before making payment.">
                <div className="text-center py-16">
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                        Your cart is empty
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Add some items from the menu first
                    </p>
                    <Button variant="outline" onClick={() => navigate("/customer/home")}>
                        Browse Menu
                    </Button>
                </div>
            </CustomerLayout>
        )
    }

    return (
        <CustomerLayout title="Order Summary" subtitle="Review items before making payment.">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Order items */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-3 hidden lg:block">Your Items</h2>
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <OrderCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Right: Summary & Payment */}
                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
                    <h2 className="text-lg font-semibold mb-3 hidden lg:block">Details</h2>
                    <SpecialIntruction />
                    <Price subtotal={subtotal} />

                    {error && (
                        <p className="text-destructive text-sm mb-3 font-medium">{error}</p>
                    )}

                    <Button
                        className="w-full py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        onClick={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Payment"}
                    </Button>
                </div>
            </div>
        </CustomerLayout>
    )
}
