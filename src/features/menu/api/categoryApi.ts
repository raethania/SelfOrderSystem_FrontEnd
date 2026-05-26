import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { Category } from "@/types/category.types";

export interface CreateCategoryPayload {
    name: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export const categoryApi = {
    getCategories(params?: {
        name?: string;
        limit?: number;
    }): Promise<ApiResponse<Category[]>> {
        return apiClient.get(ENDPOINTS.categories.list, { params });
    },

    getCategoryById(id: number): Promise<ApiResponse<Category>> {
        return apiClient.get(ENDPOINTS.categories.detail(id));
    },

    createCategory(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
        return apiClient.post(ENDPOINTS.categories.create, payload);
    },

    updateCategory(
        id: number,
        payload: UpdateCategoryPayload
    ): Promise<ApiResponse<Category>> {
        return apiClient.put(ENDPOINTS.categories.update(id), payload);
    },

    deleteCategory(id: number): Promise<ApiResponse<null>> {
        return apiClient.delete(ENDPOINTS.categories.delete(id));
    }
};