import { MenuCard } from "./MenuCard"

type MenuGridProps = {
    items: any[]
}

export function MenuGrid({ items }: MenuGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {items.map((item, i) => (
                <MenuCard key={i} {...item} />
            ))}
        </div>
    )
}