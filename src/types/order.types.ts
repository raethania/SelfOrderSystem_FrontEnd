export type OrderStatus =
    | "pending"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

export interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    notes?: string | null;
}

export interface Order {
    id: number;
    order_number: string;
    table_number: number;
    status: OrderStatus;
    notes?: string | null;
    items: OrderItem[];
    total: number;
    created_at: string;
    updated_at?: string;
}

export interface CreateOrderItemPayload {
    product_id: number;
    quantity: number;
    notes?: string | null;
}

export interface CreateOrderPayload {
    table_number: number;
    notes?: string | null;
    items: CreateOrderItemPayload[];
}

export interface OrderQueryParams {
    status?: OrderStatus;
    date?: string;
    limit?: number;
    page?: number;
}

export interface UpdateOrderStatusPayload {
    status: OrderStatus;
}