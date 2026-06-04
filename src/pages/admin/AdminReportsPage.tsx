import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Download,
} from "lucide-react";
import AdminLayout from "@/layout/AdminLayout";
import { DateRangeFilter } from "@/components/ui/DateFilter";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { reportApi } from "@/features/report/api/reportApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { todayApiDate, daysAgoApiDate } from "@/lib/formatDate";
import type {
    SalesReport,
    TopProduct,
    LowStockProduct,
    ReportGroupBy,
} from "@/types/report.types";

type TabKey = "sales" | "top-products" | "low-stock";

// Helper to trigger download from Blob
const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
};

class ReportsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-red-500 bg-red-50 min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">UI Crashed!</h1>
                    <p className="mb-4">Please share this error message:</p>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-red-200">
                        {this.state.error?.stack || this.state.error?.message || "Unknown error"}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function AdminReportsPage() {
    return (
        <ReportsErrorBoundary>
            <AdminReportsContent />
        </ReportsErrorBoundary>
    );
}

function AdminReportsContent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const validTabs: TabKey[] = ["sales", "top-products", "low-stock"];
    const tabParam = searchParams.get("tab") as TabKey;
    const tab = validTabs.includes(tabParam) ? tabParam : "sales";

    const updateParams = (newParams: Record<string, string | number | undefined>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });
        setSearchParams(params, { replace: true });
    };

    const handleTabChange = (newTab: TabKey) => {
        // Reset params when switching tabs to avoid mixing them up
        const params = new URLSearchParams();
        params.set("tab", newTab);
        setSearchParams(params, { replace: true });
    };

    // --- State ---
    // Sales
    const salesStartDate = searchParams.get("start_date") || daysAgoApiDate(7);
    const salesEndDate = searchParams.get("end_date") || todayApiDate();
    const salesGroupBy = (searchParams.get("group_by") as ReportGroupBy) || "daily";
    const [salesData, setSalesData] = useState<SalesReport | null>(null);

    // Top Products
    const topStartDate = searchParams.get("start_date") || daysAgoApiDate(30);
    const topEndDate = searchParams.get("end_date") || todayApiDate();
    const topLimit = Number(searchParams.get("limit")) || 10;
    const topPage = Number(searchParams.get("page")) || 1;
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [topLastPage, setTopLastPage] = useState(1);

    // Low Stock
    const lowThreshold = Number(searchParams.get("threshold")) || 10;
    const lowLimit = Number(searchParams.get("limit")) || 10;
    const lowPage = Number(searchParams.get("page")) || 1;
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
    const [lowLastPage, setLowLastPage] = useState(1);

    // Common State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // --- Fetching Logic ---
    const fetchSales = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getSalesReport({
                start_date: salesStartDate,
                end_date: salesEndDate,
                group_by: salesGroupBy,
            });
            // If backend returns empty array [] instead of object, handle it safely
            if (Array.isArray(res?.data)) {
                setSalesData(null);
            } else {
                setSalesData(res?.data || null);
            }
        } catch {
            setError("Failed to load sales report.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTopProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getTopProducts({
                start_date: topStartDate,
                end_date: topEndDate,
                limit: topLimit,
                page: topPage,
            });

            // Handle if data is wrapped in a pagination object or is a direct array
            const resData = res?.data;
            let items: TopProduct[] = [];
            if (Array.isArray(resData)) {
                items = resData;
            } else if (resData && typeof resData === 'object' && 'data' in resData && Array.isArray((resData as any).data)) {
                items = (resData as any).data;
            }
            setTopProducts(items);

            if (res && "meta" in res && (res as any).meta) {
                setTopLastPage((res as any).meta?.last_page || 1);
            } else if (resData && typeof resData === 'object' && 'last_page' in resData) {
                setTopLastPage((resData as any).last_page || 1);
            }
        } catch {
            setError("Failed to load top products.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLowStock = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getLowStock({
                threshold: lowThreshold,
                limit: lowLimit,
                page: lowPage,
            });

            // Handle if data is wrapped in a pagination object or is a direct array
            const resData = res?.data;
            let items: LowStockProduct[] = [];
            if (Array.isArray(resData)) {
                items = resData;
            } else if (resData && typeof resData === 'object' && 'data' in resData && Array.isArray((resData as any).data)) {
                items = (resData as any).data;
            }
            setLowStockProducts(items);

            if (res && "meta" in res && (res as any).meta) {
                setLowLastPage((res as any).meta?.last_page || 1);
            } else if (resData && typeof resData === 'object' && 'last_page' in resData) {
                setLowLastPage((resData as any).last_page || 1);
            }
        } catch {
            setError("Failed to load low stock report.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tab === "sales") fetchSales();
        if (tab === "top-products") fetchTopProducts();
        if (tab === "low-stock") fetchLowStock();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tab,
        salesStartDate,
        salesEndDate,
        salesGroupBy,
        topStartDate,
        topEndDate,
        topLimit,
        topPage,
        lowThreshold,
        lowLimit,
        lowPage,
    ]);

    // --- Export Logic ---
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            let blob: Blob;
            let filename = "";

            if (tab === "sales") {
                blob = await reportApi.exportSalesReport({
                    start_date: salesStartDate,
                    end_date: salesEndDate,
                    group_by: salesGroupBy,
                });
                filename = `sales_report_${salesStartDate}_to_${salesEndDate}.csv`;
            } else if (tab === "top-products") {
                blob = await reportApi.exportTopProducts({
                    start_date: topStartDate,
                    end_date: topEndDate,
                    limit: topLimit,
                });
                filename = `top_products_${topStartDate}_to_${topEndDate}.csv`;
            } else {
                blob = await reportApi.exportLowStock({
                    threshold: lowThreshold,
                    limit: lowLimit,
                });
                filename = `low_stock_report.csv`;
            }

            // Fallback for missing filename, API might return excel or csv
            // Fallback for missing filename, API might return excel, csv, or pdf
            if (blob.type.includes("pdf")) {
                filename = filename.replace(".csv", ".pdf");
            } else if (blob.type.includes("excel") || blob.type.includes("spreadsheet")) {
                filename = filename.replace(".csv", ".xlsx");
            } else if (!blob.type.includes("csv")) {
                // If it's none of the above, we keep the original extension or fallback to pdf/xlsx depending on backend default.
                // Assuming backend default is pdf if it's not explicitly csv/excel.
                filename = filename.replace(".csv", ".pdf");
            }

            downloadBlob(blob, filename);
        } catch (err) {
            alert("Failed to download report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Subtitles ---
    const subtitles: Record<TabKey, string> = {
        sales: "Sales performance overview",
        "top-products": "Best selling products",
        "low-stock": "Low stock monitoring",
    };

    // Helpers for charts/tables
    const maxBreakdownRevenue = salesData?.breakdown && Array.isArray(salesData.breakdown) && salesData.breakdown.length > 0
        ? Math.max(...salesData.breakdown.map((b) => b?.revenue || 0), 1)
        : 1;
    const maxTopQuantity = topProducts && Array.isArray(topProducts) && topProducts.length > 0
        ? Math.max(...topProducts.map((p) => p?.quantity_sold || 0), 1)
        : 1;

    return (
        <AdminLayout
            title="Reports"
            subtitle={subtitles[tab] || ""}
        >
            {/* Header Right Actions (Injected via negative margin on desktop, or normal flow) */}
            <div className="flex justify-end md:-mt-14 mb-6">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading || isLoading || !!error}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Download size={18} />
                    {isDownloading ? "Preparing..." : "Download"}
                </button>
            </div>

            {/* Submenu Reports = Horizontal Chip Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6 p-1 bg-transparent">
                {/* Chip Group A — Jenis Report */}
                <button
                    onClick={() => handleTabChange("sales")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tab === "sales"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                >
                    Sales
                </button>
                <button
                    onClick={() => handleTabChange("top-products")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tab === "top-products"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                >
                    Top Products
                </button>
                <button
                    onClick={() => handleTabChange("low-stock")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tab === "low-stock"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                >
                    Low Stock
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>

                {/* Chip Group B — Quick Filter */}
                {tab === "sales" && (
                    <>
                        {["daily", "weekly", "monthly"].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateParams({ group_by: opt })}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors capitalize ${salesGroupBy === opt
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </>
                )}

                {tab === "top-products" && (
                    <>
                        {[10, 20, 50].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateParams({ limit: opt, page: 1 })}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${topLimit === opt
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                                    }`}
                            >
                                Top {opt}
                            </button>
                        ))}
                    </>
                )}

                {tab === "low-stock" && (
                    <>
                        {[10, 20, 50].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateParams({ threshold: opt, page: 1 })}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${lowThreshold === opt
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                                    }`}
                            >
                                &le;{opt}
                            </button>
                        ))}
                    </>
                )}
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl ring-1 ring-red-100 flex flex-col items-center justify-center text-center">
                    <p className="font-medium mb-2">{error}</p>
                    <button
                        onClick={() => {
                            if (tab === "sales") fetchSales();
                            if (tab === "top-products") fetchTopProducts();
                            if (tab === "low-stock") fetchLowStock();
                        }}
                        className="text-red-700 underline text-sm hover:text-red-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State Skeleton */}
            {isLoading && !error && (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-accent/50 rounded-2xl w-full"></div>
                    <div className="h-64 bg-accent/50 rounded-2xl w-full"></div>
                </div>
            )}

            {/* ============ SALES TAB ============ */}
            {tab === "sales" && !isLoading && !error && (
                <div className="space-y-6">
                    {/* Date Range Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <DateRangeFilter
                            startDate={salesStartDate}
                            endDate={salesEndDate}
                            onStartDateChange={(v) => updateParams({ start_date: v })}
                            onEndDateChange={(v) => updateParams({ end_date: v })}
                        />
                    </div>

                    {salesData && salesData.summary ? (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-green-100">
                                            <DollarSign size={24} className="text-green-600" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                                            Total Revenue
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-foreground tracking-tight">
                                        {formatRupiah(salesData.summary?.total_revenue || 0)}
                                    </p>
                                </div>
                                <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-blue-100">
                                            <ShoppingCart size={24} className="text-blue-600" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                                            Total Orders
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-foreground tracking-tight">
                                        {salesData.summary?.total_orders || 0}
                                    </p>
                                </div>
                                <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-purple-100">
                                            <TrendingUp size={24} className="text-purple-600" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                                            Avg Order Value
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-foreground tracking-tight">
                                        {formatRupiah(salesData.summary?.avg_order_value || 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Breakdown Chart */}
                            <div className="bg-card rounded-2xl ring-1 ring-foreground/10 p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-foreground mb-6">
                                    Revenue Breakdown
                                </h3>
                                {salesData.breakdown && Array.isArray(salesData.breakdown) && salesData.breakdown.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground bg-accent/30 rounded-xl">
                                        <p className="font-medium">No data found for selected filters</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {salesData.breakdown?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span className="text-sm text-muted-foreground w-24 shrink-0 font-medium">
                                                    {item?.date || "-"}
                                                </span>
                                                <div className="flex-1 h-10 bg-accent/40 rounded-xl overflow-hidden relative">
                                                    <div
                                                        className="h-full bg-orange-500/90 rounded-xl transition-all duration-500"
                                                        style={{
                                                            width: `${((item?.revenue || 0) / maxBreakdownRevenue) * 100}%`,
                                                        }}
                                                    />
                                                    <span className="absolute inset-0 flex items-center px-4 text-sm font-semibold text-foreground">
                                                        {formatRupiah(item?.revenue || 0)}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-muted-foreground w-20 shrink-0 text-right">
                                                    {item?.orders || 0} orders
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground bg-card ring-1 ring-foreground/10 rounded-2xl">
                            <p className="font-medium">No data found for selected filters</p>
                        </div>
                    )}
                </div>
            )}

            {/* ============ TOP PRODUCTS TAB ============ */}
            {tab === "top-products" && !isLoading && !error && (
                <div className="space-y-6">
                    {/* Date Range Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <DateRangeFilter
                            startDate={topStartDate}
                            endDate={topEndDate}
                            onStartDateChange={(v) => updateParams({ start_date: v, page: 1 })}
                            onEndDateChange={(v) => updateParams({ end_date: v, page: 1 })}
                        />
                    </div>

                    {!topProducts || (Array.isArray(topProducts) && topProducts.length === 0) ? (
                        <div className="text-center py-20 text-muted-foreground bg-card ring-1 ring-foreground/10 rounded-2xl">
                            <p className="font-medium">No data found for selected filters</p>
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 text-center">Total Sold</th>
                                            <th className="px-6 py-4 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {topProducts.map((product, idx) => {
                                            const rank = (topPage - 1) * topLimit + idx + 1;
                                            return (
                                                <tr key={product?.product_id || idx} className="hover:bg-accent/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${rank === 1
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : rank === 2
                                                                    ? "bg-gray-200 text-gray-700"
                                                                    : rank === 3
                                                                        ? "bg-orange-100 text-orange-800"
                                                                        : "bg-accent text-muted-foreground"
                                                                }`}
                                                        >
                                                            #{rank}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-foreground">
                                                        {product?.name || "Unknown"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium">
                                                        {product?.quantity_sold || 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <span className="font-semibold text-foreground">
                                                                {formatRupiah(product?.revenue || 0)}
                                                            </span>
                                                            <div className="w-24 h-1.5 bg-accent rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-orange-500 rounded-full"
                                                                    style={{
                                                                        width: `${((product?.quantity_sold || 0) / maxTopQuantity) * 100}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <PaginationControl
                        currentPage={topPage}
                        lastPage={topLastPage}
                        onPageChange={(p) => updateParams({ page: p })}
                    />
                </div>
            )}

            {/* ============ LOW STOCK TAB ============ */}
            {tab === "low-stock" && !isLoading && !error && (
                <div className="space-y-6">
                    {!lowStockProducts || (Array.isArray(lowStockProducts) && lowStockProducts.length === 0) ? (
                        <div className="text-center py-20 text-muted-foreground bg-card ring-1 ring-foreground/10 rounded-2xl">
                            <p className="font-medium">No data found for selected filters</p>
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-accent/50 text-muted-foreground text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 text-center">Stock</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {lowStockProducts.map((product, idx) => {
                                            const stockCount = product?.stock || 0;
                                            const statusText = product?.status || "unknown";
                                            const isUrgent = stockCount === 0 || statusText === "unavailable";
                                            const isLow = stockCount <= lowThreshold && !isUrgent;

                                            return (
                                                <tr
                                                    key={product?.id || idx}
                                                    className={`transition-colors ${isUrgent
                                                        ? "bg-red-50/50 hover:bg-red-50"
                                                        : "hover:bg-accent/30"
                                                        }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-foreground">
                                                            {product?.name || "Unknown"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span
                                                                className={`font-bold text-base ${stockCount === 0
                                                                    ? "text-red-600"
                                                                    : isLow
                                                                        ? "text-orange-600"
                                                                        : "text-foreground"
                                                                    }`}
                                                            >
                                                                {stockCount}
                                                            </span>
                                                            {stockCount <= lowThreshold && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                                                                    Low
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span
                                                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${statusText === "available"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <PaginationControl
                        currentPage={lowPage}
                        lastPage={lowLastPage}
                        onPageChange={(p) => updateParams({ page: p })}
                    />
                </div>
            )}
        </AdminLayout>
    );
}
