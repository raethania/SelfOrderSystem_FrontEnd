import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { useCartStore } from "@/store/cartStore"
import type { CartItem } from "@/store/cartStore"
import { MessageSquare, ChevronDown } from "lucide-react"

type OrderCardProps = {
    item: CartItem
}

export default function OrderCard({ item }: OrderCardProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const updateItemNotes = useCartStore((state) => state.updateItemNotes)
    const [showNotes, setShowNotes] = useState(!!item.notes)

    const formatPrice = (price: number) => {
        return `Rp. ${(Number(price) * item.quantity).toLocaleString("id-ID")}`
    }

    const hasNotes = !!item.notes && item.notes.trim().length > 0

    return (
        <Card size="sm" className="mx-auto w-full max-w-full md:max-w-none px-3 md:px-4 py-3 hover:shadow-md transition-shadow">
            {/* Top row: image + info + quantity */}
            <div className="flex gap-4 md:gap-5 items-center">
                <div className="w-20 h-16 md:w-28 md:h-20 rounded-lg bg-[url('https://i.pinimg.com/1200x/0d/0c/0c/0d0c0c995466027dc3c8999184b7730f.jpg')] bg-cover bg-center shrink-0" />

                <CardContent className="flex-1 min-w-0 p-0">
                    <CardTitle className="text-sm md:text-base truncate">{item.name}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        {formatPrice(item.price)}
                    </CardDescription>
                </CardContent>

                <div className="flex gap-2.5 md:gap-3 items-center shrink-0">
                    <Button
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full"
                        variant="secondary"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                        -
                    </Button>
                    <p className="text-sm md:text-base font-medium w-4 text-center">{item.quantity}</p>
                    <Button
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>

            {/* Notes toggle button */}
            <button
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-1.5 mt-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    hasNotes
                        ? "text-primary bg-primary/8 hover:bg-primary/12"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
            >
                <MessageSquare size={13} />
                <span>{hasNotes ? "Edit note" : "Add note"}</span>
                <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${showNotes ? "rotate-180" : ""}`}
                />
            </button>

            {/* Notes input (collapsible) */}
            <div
                className={`grid transition-all duration-200 ease-in-out ${
                    showNotes ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="relative">
                        <textarea
                            value={item.notes || ""}
                            onChange={(e) => updateItemNotes(item.product_id, e.target.value)}
                            placeholder="e.g. No onions, extra cheese, less spicy..."
                            rows={2}
                            className="w-full text-xs md:text-sm bg-accent/40 border border-border rounded-xl px-3 py-2.5 resize-none outline-none placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        {hasNotes && (
                            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/50">
                                {item.notes!.length}/100
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
