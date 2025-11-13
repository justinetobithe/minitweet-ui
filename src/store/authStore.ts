import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/User";

type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User | null, token: string | null) => void;
    setUser: (user: User | null) => void;
    reset: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: !!user && !!token,
                }),

            setUser: (user) =>
                set((state) => ({
                    user,
                    isAuthenticated: !!user && !!state.token,
                })),

            reset: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "minitweet-auth",  
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
