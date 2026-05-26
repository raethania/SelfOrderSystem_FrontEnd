import type { PaymentMethod } from "@/types/transaction.types";

export const PAYMENT_METHODS: Array<{
    label: string;
    value: PaymentMethod;
}> = [
        {
            label: "Cash",
            value: "cash"
        },
        {
            label: "Card",
            value: "card"
        },
        {
            label: "QRIS",
            value: "qris"
        }
    ];