import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
    CreateTransactionPayload,
    Transaction,
    TransactionQueryParams
} from "@/types/transaction.types";

export const transactionApi = {
    getTransactions(
        params?: TransactionQueryParams
    ): Promise<ApiResponse<Transaction[]>> {
        return apiClient.get(ENDPOINTS.transactions.list, { params });
    },

    createTransaction(
        payload: CreateTransactionPayload
    ): Promise<ApiResponse<Transaction>> {
        return apiClient.post(ENDPOINTS.transactions.create, payload);
    }
};