import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
    CreateOrderPayload,
    Order,
    OrderQueryParams,
    OrderStatus
} from "@/types/order.types";

export const orderApi = {
    getOrders(params?: OrderQueryParams): Promise<ApiResponse<Order[]>> {
        return apiClient.get(ENDPOINTS.orders.list, { params });
    },

    getOrderById(id: number): Promise<ApiResponse<Order>> {
        return apiClient.get(ENDPOINTS.orders.detail(id));
    },

    createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
        return apiClient.post(ENDPOINTS.orders.create, payload);
    },

    updateOrderStatus(
        id: number,
        status: OrderStatus
    ): Promise<ApiResponse<Order>> {
        return apiClient.patch(ENDPOINTS.orders.updateStatus(id), { status });
    }
};