export type UserRole = "ROLE_CUSTOMER" | "ROLE_ADMIN";

export interface User {
  id: string | number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

