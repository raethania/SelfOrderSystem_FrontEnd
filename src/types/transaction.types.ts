import type { Order } from "./order.types";
import type { User } from "./auth.types";

export type PaymentMethod = "cash" | "card" | "qris";

export interface Transaction {
    id: number;
    order_id: number;
    order_number: string;
    payment_method: PaymentMethod;
    amount_paid: number;
    change: number;
    total: number;
    processed_by: User;
    created_at: string;
    order?: Order;
}

export interface CreateTransactionPayload {
    order_id: number;
    payment_method: PaymentMethod;
    amount_paid: number;
}

export interface TransactionQueryParams {
    start_date?: string;
    end_date?: string;
    payment_method?: PaymentMethod;
    limit?: number;
    page?: number;
}