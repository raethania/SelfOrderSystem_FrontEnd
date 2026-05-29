import { MenuCard } from "./MenuCard"
import type { Product } from "@/types/product.types"

type MenuGridProps = {
    items: Product[]
}

export function MenuGrid({ items }: MenuGridProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">No menu items found</p>
                <p className="text-sm">Try changing your search or filter</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {items.map((product) => (
                <MenuCard key={product.id} product={product} />
            ))}
        </div>
    )
}