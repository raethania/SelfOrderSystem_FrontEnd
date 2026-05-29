import { Card, CardContent, CardFooter } from "@/components/ui/card"

type PriceProps = {
    subtotal: number
}

export default function Price({ subtotal }: PriceProps) {
    const taxRate = 0.08
    const serviceRate = 0.05

    const tax = Math.round(subtotal * taxRate)
    const serviceFee = Math.round(subtotal * serviceRate)
    const total = subtotal + tax + serviceFee

    const formatPrice = (price: number) => {
        return `Rp. ${price.toLocaleString("id-ID")}`
    }

    return (
        <Card className="mb-4 p-4 md:p-6">
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>{formatPrice(subtotal)}</p>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                    <p className="text-muted-foreground">Tax (8%)</p>
                    <p>{formatPrice(tax)}</p>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                    <p className="text-muted-foreground">Service Fee (5%)</p>
                    <p>{formatPrice(serviceFee)}</p>
                </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
                <p className="font-semibold md:text-lg">Total</p>
                <p className="font-bold text-primary md:text-lg">{formatPrice(total)}</p>
            </CardFooter>
        </Card>
    )
}
