import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

export function CartBar() {
    const navigate = useNavigate()
    const items = useCartStore((state) => state.items)
    const getSubtotal = useCartStore((state) => state.getSubtotal)

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = getSubtotal()
    const firstItemName = items.length > 0 ? items[0].name : ""

    const formatPrice = (price: number) => {
        return `Rp. ${Number(price).toLocaleString("id-ID")}`
    }

    if (items.length === 0) return null

    return (
        <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-50 px-5 md:px-10 flex justify-center">
            <Button
                className="justify-between py-10 w-full max-w-5xl rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                onClick={() => navigate("/customer/new-order")}
            >
                <div className="text-left">
                    <p className="font-semibold">{totalItems} Items</p>
                    <p className="text-sm opacity-80 truncate max-w-40">
                        {firstItemName}
                        {items.length > 1 ? ` +${items.length - 1} more` : ""}
                    </p>
                </div>
                <p className="text-lg font-bold">{formatPrice(subtotal)}</p>
            </Button>
        </div>
    )
}