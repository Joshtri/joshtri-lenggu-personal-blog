import axios, { AxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "@/types/common";

const instance = axios.create({
  baseURL: "/api", // internal CMS route handler
  withCredentials: true, // penting kalau auth pakai cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor token
instance.interceptors.request.use((config) => {
  // const token = getToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Error wrapper dengan interface
interface DetailedError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

const handleError = (error: unknown): never => {
  const axiosError = error as { response?: { data?: unknown } };
  const apiError = axiosError.response?.data as ApiErrorResponse | undefined;

  const message =
    apiError?.message || (error as Error).message || "Terjadi kesalahan tak dikenal";

  const detailedError: DetailedError = {
    message,
    statusCode: apiError?.statusCode,
    errors: apiError?.errors,
  };

  console.error("[API ERROR]", detailedError);

  throw new Error(message); // You can throw apiError if needed
};

export const api = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const res = await instance.get<T>(url, config);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const res = await instance.post<T>(url, data, config);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },
  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const res = await instance.put<T>(url, data, config);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const res = await instance.delete<T>(url, config);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },

  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const res = await instance.patch<T>(url, data, config);
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },

};
