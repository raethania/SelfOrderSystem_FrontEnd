import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from "axios";
import { getToken, removeToken } from "./tokenService";
import type { ApiErrorResponse } from "@/types/api.types";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
            removeToken();
            window.location.href = "/login";
        }

        return Promise.reject(error.response?.data ?? error);
    }
);

export default apiClient;