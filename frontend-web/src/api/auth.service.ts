import axiosInstance from "./axiosInstance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  role: string;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (email: string): Promise<string> => {
  const response = await axiosInstance.post<string>("/auth/forgot-password", {
    email,
  });
  return response.data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<string> => {
  const response = await axiosInstance.post<string>("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};