export const ENDPOINTS = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        logout: "/auth/logout"
    },

    categories: {
        list: "/categories",
        detail: (id: number) => `/categories/${id}`,
        create: "/categories",
        update: (id: number) => `/categories/${id}`,
        delete: (id: number) => `/categories/${id}`
    },

    products: {
        list: "/products",
        detail: (id: number) => `/products/${id}`,
        create: "/products",
        update: (id: number) => `/products/${id}`,
        delete: (id: number) => `/products/${id}`
    },

    orders: {
        list: "/orders",
        detail: (id: number) => `/orders/${id}`,
        create: "/orders",
        updateStatus: (id: number) => `/orders/${id}/status`
    },

    transactions: {
        list: "/transactions",
        create: "/transactions"
    },

    reports: {
        sales: "/reports/sales",
        salesExport: "/reports/sales/export",
        topProducts: "/reports/top-products",
        topProductsExport: "/reports/top-products/export",
        lowStock: "/reports/low-stock",
        lowStockExport: "/reports/low-stock/export"
    }
} as const;