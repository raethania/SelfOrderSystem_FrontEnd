import type { Category } from "./category.types";

export type ProductStatus = "available" | "unavailable";

export interface Product {
    id: number;
    category_id: number;
    category?: Category;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    image?: string | null;
    status: ProductStatus;
    created_at?: string;
    updated_at?: string;
}

export interface ProductQueryParams {
    category_id?: number;
    search?: string;
    status?: ProductStatus;
    limit?: number;
    page?: number;
}

export interface CreateProductPayload {
    category_id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: File | null;
    status?: ProductStatus;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;