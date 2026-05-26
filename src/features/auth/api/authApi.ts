import apiClient from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload
} from "@/types/auth.types";

export const authApi = {
    login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
        return apiClient.post(ENDPOINTS.auth.login, payload);
    },

    register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
        return apiClient.post(ENDPOINTS.auth.register, payload);
    },

    logout(): Promise<ApiResponse<null>> {
        return apiClient.post(ENDPOINTS.auth.logout);
    }
};