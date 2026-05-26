import type { UserRole } from "@/types/auth.types";

export const ROLES = {
    ADMIN: "admin",
    CASHIER: "cashier",
    KITCHEN: "kitchen",
    CUSTOMER: "customer"
} as const satisfies Record<string, UserRole>;