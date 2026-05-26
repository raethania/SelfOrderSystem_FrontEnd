export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    success: true;
    message: string;
    data: T[];
    meta: {
        current_page: number,
        per_page: number,
        total: number,
        last_page: number
    };
    links: {
        first: string,
        last: string,
        prev: string | null,
        next: string | null
    };

}

export interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
}