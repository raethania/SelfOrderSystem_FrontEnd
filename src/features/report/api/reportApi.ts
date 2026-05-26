import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
    LowStockProduct,
    LowStockQueryParams,
    SalesReport,
    SalesReportQueryParams,
    TopProduct,
    TopProductsQueryParams
} from "@/types/report.types";

export const reportApi = {
    getSalesReport(
        params?: SalesReportQueryParams
    ): Promise<ApiResponse<SalesReport>> {
        return apiClient.get(ENDPOINTS.reports.sales, { params });
    },

    getTopProducts(
        params?: TopProductsQueryParams
    ): Promise<ApiResponse<TopProduct[]>> {
        return apiClient.get(ENDPOINTS.reports.topProducts, { params });
    },

    getLowStock(
        params?: LowStockQueryParams
    ): Promise<ApiResponse<LowStockProduct[]>> {
        return apiClient.get(ENDPOINTS.reports.lowStock, { params });
    }
};