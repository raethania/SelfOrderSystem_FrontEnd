import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useCartStore } from "@/store/cartStore"
import type { Product } from "@/types/product.types"

type MenuCardProps = {
    product: Product
}

export function MenuCard({ product }: MenuCardProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAdd = () => {
        addItem({
            id: product.id,
            product_id: product.id,
            name: product.name,
            price: product.price,
        })
    }

    const formatPrice = (price: number) => {
        return `Rp. ${Number(price).toLocaleString("id-ID")}`
    }

    const imageUrl = product.image
        ? product.image
        : "https://avatar.vercel.sh/shadcn1"

    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden group">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35 pointer-events-none" />
            <img
                src={imageUrl}
                alt={product.name}
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-300"
            />
            <CardHeader>
                <CardTitle className="text-sm md:text-base truncate">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs md:text-sm">
                    {product.description || "Delicious menu item"}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <p className="text-sm font-semibold text-primary">
                    {formatPrice(product.price)}
                </p>
                <Button
                    className="rounded-full w-7 h-7 md:w-8 md:h-8"
                    onClick={handleAdd}
                    disabled={product.status === "unavailable"}
                >
                    +
                </Button>
            </CardFooter>
        </Card>
    )
}
