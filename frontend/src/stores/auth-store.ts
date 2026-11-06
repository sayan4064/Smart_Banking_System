"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthResponse } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (authData: AuthResponse) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("apex_jwt_token", authData.token);
        }
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("apex_jwt_token");
          localStorage.removeItem("apex_user_session");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedUser } });
        }
      },
    }),
    {
      name: "apex_user_session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

