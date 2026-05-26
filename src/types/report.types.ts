export type ReportGroupBy = "daily" | "weekly" | "monthly";

export interface SalesSummary {
    total_revenue: number;
    total_orders: number;
    avg_order_value: number;
}

export interface SalesBreakdownItem {
    date: string;
    revenue: number;
    orders: number;
}

export interface SalesReport {
    summary: SalesSummary;
    breakdown: SalesBreakdownItem[];
}

export interface TopProduct {
    product_id: number;
    name: string;
    quantity_sold: number;
    revenue: number;
}

export interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    status: string;
}

export interface SalesReportQueryParams {
    start_date?: string;
    end_date?: string;
    group_by?: ReportGroupBy;
}

export interface TopProductsQueryParams {
    start_date?: string;
    end_date?: string;
    limit?: number;
}

export interface LowStockQueryParams {
    threshold?: number;
    limit?: number;
}