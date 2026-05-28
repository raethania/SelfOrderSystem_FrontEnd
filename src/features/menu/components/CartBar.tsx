import { Button } from "@/components/ui/button"

type CartBarProps = {
    itemCount: number
    itemName: string
    total: string
}

export function CartBar({ itemCount, itemName, total }: CartBarProps) {
    return (
        <Button className="justify-between z-20 py-10 fixed bottom-0 right-10 left-10 w-auto opacity-100">
            <div className="text-left">
                <p>{itemCount} Items</p>
                <p>{itemName}</p>
            </div>
            <p>{total}</p>
        </Button>
    )
}