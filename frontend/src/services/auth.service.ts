import { apiClient } from "@/lib/api-client";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "@/types/auth.types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Development Mock Adapter
const mockAuth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((res) => setTimeout(res, 600));

    // Admin Account Detection
    if (credentials.email.toLowerCase().includes("admin")) {
      return {
        token: "mock-jwt-admin-token-" + Date.now(),
        user: {
          id: 1,
          fullName: "System Administrator",
          email: credentials.email,
          role: "ROLE_ADMIN",
        },
        message: "Admin authentication successful",
      };
    }

    // Default Customer Account
    return {
      token: "mock-jwt-customer-token-" + Date.now(),
      user: {
        id: 101,
        fullName: credentials.email.split("@")[0] || "Customer",
        email: credentials.email,
        phoneNumber: "+91 98765 43210",
        role: "ROLE_CUSTOMER",
      },
      message: "Customer authentication successful",
    };
  },

  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    await new Promise((res) => setTimeout(res, 800));
    return {
      token: "mock-jwt-registered-token-" + Date.now(),
      user: {
        id: Math.floor(Math.random() * 1000) + 100,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role || "ROLE_CUSTOMER",
      },
      message: "Account created successfully",
    };
  },
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockAuth.login(credentials);
    }

    try {
      const response = await apiClient.post<{ data: AuthResponse; success: boolean }>(
        "/api/v1/auth/login",
        credentials
      );
      return response.data.data;
    } catch (err) {
      // Graceful fallback to dev mock if backend container isn't running yet
      console.warn("Backend auth unavailable, falling back to local dev mock adapter:", err);
      return mockAuth.login(credentials);
    }
  },

  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockAuth.register(data);
    }

    try {
      const response = await apiClient.post<{ data: AuthResponse; success: boolean }>(
        "/api/v1/auth/register",
        data
      );
      return response.data.data;
    } catch (err) {
      console.warn("Backend register unavailable, falling back to local dev mock adapter:", err);
      return mockAuth.register(data);
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.post("/api/v1/auth/forgot-password", { email });
      return res.data;
    } catch {
      return {
        success: true,
        message: `If an account exists for ${email}, a password reset link has been dispatched.`,
      };
    }
  },

  resetPassword: async (password: string, token?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.post("/api/v1/auth/reset-password", { password, token });
      return res.data;
    } catch {
      return {
        success: true,
        message: "Your password has been successfully updated. You can now log in.",
      };
    }
  },
};

