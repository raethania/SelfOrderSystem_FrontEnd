import { create } from "zustand";
import type { User } from "@/types/auth.types";
import {
    getToken,
    getUser,
    removeToken,
    saveToken,
    saveUser
} from "@/services/tokenService";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;
    hydrateAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: getUser(),
    token: getToken(),
    isAuthenticated: Boolean(getToken()),

    setAuth: (user, token) => {
        saveUser(user);
        saveToken(token);

        set({
            user,
            token,
            isAuthenticated: true
        });
    },

    logout: () => {
        removeToken();

        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    hydrateAuth: () => {
        const user = getUser();
        const token = getToken();

        set({
            user,
            token,
            isAuthenticated: Boolean(user && token)
        });
    }
}));