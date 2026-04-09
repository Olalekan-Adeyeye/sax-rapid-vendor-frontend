/**
 * Axios API Client
 * Handles base URL, Bearer token injection, and automatic 401 → token refresh.
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { 
  AuthResponse, 
  ApiResponse 
} from "./types/auth.types";

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.saxrapid.com";

// ─── Token Storage Helpers ────────────────────────────────────────────────────

import { cookies } from "../utils/cookies";

const TOKEN_KEY = "sax_access_token";
const REFRESH_TOKEN_KEY = "sax_refresh_token";

export const tokenStorage = {
  getToken: (): string | null => cookies.get(TOKEN_KEY),

  getRefreshToken: (): string | null => cookies.get(REFRESH_TOKEN_KEY),

  setTokens: (token: string, refreshToken: string): void => {
    cookies.set(TOKEN_KEY, token);
    cookies.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    cookies.remove(TOKEN_KEY);
    cookies.remove(REFRESH_TOKEN_KEY);
  },
};

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach Bearer token from storage before every request

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Refresh Token Queue ──────────────────────────────────────────────────────
// Prevents multiple simultaneous refresh calls when several requests 401 at once

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) =>
    token ? resolve(token) : reject(error)
  );
  failedQueue = [];
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401 → attempt silent token refresh → retry original request once

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const refreshToken = tokenStorage.getRefreshToken();
    const is401 = error.response?.status === 401;

    if (is401 && !original._retry && refreshToken) {
      if (isRefreshing) {
        // Queue this request until the refresh resolves
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken) => {
              if (original.headers) {
                original.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(apiClient(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<AuthResponse>>(
          `${BASE_URL}/Auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!data.success || !data.data?.token) {
          throw new Error(data.message || "Failed to refresh token");
        }

        const newToken = data.data.token;
        const newRefreshToken = data.data.refreshToken || refreshToken;
        
        tokenStorage.setTokens(newToken, newRefreshToken);
        
        // Update both instance and the original request
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        flushQueue(null, newToken);

        if (original.headers) {
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(original);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
