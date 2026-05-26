import type { User } from "@/types/auth.types";

const TOKEN_KEY = "self_order_token";
const USER_KEY = "self_order_user";

export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser) as User;
    } catch {
        removeToken();
        return null;
    }
}