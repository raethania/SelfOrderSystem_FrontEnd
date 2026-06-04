import { useEffect, useState } from "react";
import AdminLayout from "@/layout/AdminLayout";
import { DateRangeFilter } from "@/components/ui/DateFilter";
import { DataTable } from "@/components/ui/DataTable";
import { PaginationControl } from "@/components/ui/PaginationControl";
import { transactionApi } from "@/features/transaction/api/transactionApi";
import { formatRupiah } from "@/lib/formatCurrency";
import { formatDateTime, todayApiDate, daysAgoApiDate } from "@/lib/formatDate";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import type { Transaction, PaymentMethod } from "@/types/transaction.types";

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [startDate, setStartDate] = useState(daysAgoApiDate(30));
    const [endDate, setEndDate] = useState(todayApiDate());
    const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: Record<string, unknown> = {
                page: currentPage,
                limit: 10,
                start_date: startDate,
                end_date: endDate,
            };
            if (paymentFilter) params.payment_method = paymentFilter;

            const res = await transactionApi.getTransactions(params as any);
            setTransactions(res.data);
            if ("meta" in res && (res as any).meta) {
                setLastPage((res as any).meta.last_page);
            }
        } catch {
            setError("Failed to load transactions.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate, paymentFilter, currentPage]);

    const paymentMethodBadge = (method: PaymentMethod) => {
        const colorMap: Record<PaymentMethod, string> = {
            cash: "bg-green-100 text-green-700",
            card: "bg-blue-100 text-blue-700",
            qris: "bg-purple-100 text-purple-700",
        };
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${colorMap[method]}`}
            >
                {method}
            </span>
        );
    };

    const columns = [
        {
            key: "order_number",
            header: "Order",
            render: (t: Transaction) => (
                <span className="font-medium text-foreground">
                    {t.order_number}
                </span>
            ),
        },
        {
            key: "payment_method",
            header: "Payment",
            render: (t: Transaction) => paymentMethodBadge(t.payment_method),
        },
        {
            key: "total",
            header: "Total",
            render: (t: Transaction) => (
                <span className="font-semibold text-primary">
                    {formatRupiah(t.total)}
                </span>
            ),
        },
        {
            key: "amount_paid",
            header: "Paid",
            render: (t: Transaction) => formatRupiah(t.amount_paid),
        },
        {
            key: "change",
            header: "Change",
            render: (t: Transaction) => formatRupiah(t.change),
        },
        {
            key: "processed_by",
            header: "Processed By",
            render: (t: Transaction) => (
                <span className="text-muted-foreground">
                    {t.processed_by?.name || "—"}
                </span>
            ),
        },
        {
            key: "created_at",
            header: "Date",
            render: (t: Transaction) => (
                <span className="text-muted-foreground text-xs">
                    {formatDateTime(t.created_at)}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Transactions"
            subtitle="Transaction history and audit log"
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
                <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(v) => {
                        setStartDate(v);
                        setCurrentPage(1);
                    }}
                    onEndDateChange={(v) => {
                        setEndDate(v);
                        setCurrentPage(1);
                    }}
                />

                {/* Payment method chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => {
                            setPaymentFilter("");
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                            paymentFilter === ""
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                    >
                        All Methods
                    </button>
                    {PAYMENT_METHODS.map((pm) => (
                        <button
                            key={pm.value}
                            onClick={() => {
                                setPaymentFilter(pm.value);
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                paymentFilter === pm.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                        >
                            {pm.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <button
                        onClick={fetchTransactions}
                        className="text-primary underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Transactions table */}
            {!isLoading && !error && (
                <>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        keyExtractor={(t) => t.id}
                        emptyMessage="No transactions found for the selected period."
                    />

                    <PaginationControl
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </AdminLayout>
    );
}
