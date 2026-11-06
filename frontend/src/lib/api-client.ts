import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("apex_jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalized Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errorCode?: string; validationErrors?: any[] }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("apex_jwt_token");
        localStorage.removeItem("apex_user_session");
        window.location.href = "/login?expired=true";
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected banking communication error occurred.";

    return Promise.reject(new Error(message));
  }
);

