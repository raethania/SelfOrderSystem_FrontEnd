import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
    CreateProductPayload,
    Product,
    ProductQueryParams,
    UpdateProductPayload
} from "@/types/product.types";

function buildProductFormData(
    payload: CreateProductPayload | UpdateProductPayload
): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        formData.append(key, value instanceof File ? value : String(value));
    });

    return formData;
}

export const productApi = {
    getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
        return apiClient.get(ENDPOINTS.products.list, { params });
    },

    getProductById(id: number): Promise<ApiResponse<Product>> {
        return apiClient.get(ENDPOINTS.products.detail(id));
    },

    createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
        const formData = buildProductFormData(payload);

        return apiClient.post(ENDPOINTS.products.create, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    updateProduct(
        id: number,
        payload: UpdateProductPayload
    ): Promise<ApiResponse<Product>> {
        const formData = buildProductFormData(payload);
        formData.append("_method", "PUT");

        return apiClient.post(ENDPOINTS.products.update(id), formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },

    deleteProduct(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete(ENDPOINTS.products.delete(id));
    }
};