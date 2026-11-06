"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthResponse } from "@/types/auth.types";

export const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour (3600 seconds)

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  checkSessionExpiry: () => boolean;
  extendSession: () => void;
  getRemainingSessionSeconds: () => number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,

      login: (authData: AuthResponse) => {
        const sessionDuration = authData.expiresIn
          ? authData.expiresIn * 1000
          : SESSION_DURATION_MS;
        const expiresAt = authData.expiresAt || Date.now() + sessionDuration;

        if (typeof window !== "undefined") {
          localStorage.setItem("apex_jwt_token", authData.token);
          localStorage.setItem("apex_session_expires_at", expiresAt.toString());
        }

        set({
          user: authData.user,
          token: authData.token,
          expiresAt,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("apex_jwt_token");
          localStorage.removeItem("apex_user_session");
          localStorage.removeItem("apex_session_expires_at");
        }
        set({
          user: null,
          token: null,
          expiresAt: null,
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

      checkSessionExpiry: () => {
        const state = get();
        if (!state.isAuthenticated || !state.expiresAt) {
          return false;
        }

        if (Date.now() >= state.expiresAt) {
          get().logout();
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login?expired=true";
          }
          return true;
        }
        return false;
      },

      extendSession: () => {
        const newExpiry = Date.now() + SESSION_DURATION_MS;
        if (typeof window !== "undefined") {
          localStorage.setItem("apex_session_expires_at", newExpiry.toString());
        }
        set({ expiresAt: newExpiry });
      },

      getRemainingSessionSeconds: () => {
        const { expiresAt, isAuthenticated } = get();
        if (!isAuthenticated || !expiresAt) return 0;
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        return remaining;
      },
    }),
    {
      name: "apex_user_session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
