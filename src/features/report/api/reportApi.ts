import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
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

    exportSalesReport(
        params?: SalesReportQueryParams
    ): Promise<Blob> {
        return apiClient.get(ENDPOINTS.reports.salesExport, { params, responseType: 'blob' });
    },

    getTopProducts(
        params?: TopProductsQueryParams
    ): Promise<PaginatedResponse<TopProduct> | ApiResponse<TopProduct[]>> {
        return apiClient.get(ENDPOINTS.reports.topProducts, { params });
    },

    exportTopProducts(
        params?: TopProductsQueryParams
    ): Promise<Blob> {
        return apiClient.get(ENDPOINTS.reports.topProductsExport, { params, responseType: 'blob' });
    },

    getLowStock(
        params?: LowStockQueryParams
    ): Promise<PaginatedResponse<LowStockProduct> | ApiResponse<LowStockProduct[]>> {
        return apiClient.get(ENDPOINTS.reports.lowStock, { params });
    },

    exportLowStock(
        params?: LowStockQueryParams
    ): Promise<Blob> {
        return apiClient.get(ENDPOINTS.reports.lowStockExport, { params, responseType: 'blob' });
    }
};