import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getApiBaseUrl } from "./env";
import type { ApiErrorDetails, ApiStatusCode } from "../../types/api";

const AUTH_TOKEN_STORAGE_KEY = "tradeflow_auth_token";

let inMemoryAuthToken: string | null = null;

export interface SetAuthTokenOptions {
  persist?: "memory" | "session";
}

export function setAuthToken(token: string | null, options: SetAuthTokenOptions = {}): void {
  const { persist = "session" } = options;
  inMemoryAuthToken = token;

  if (typeof window === "undefined") return;

  try {
    if (persist === "session") {
      if (token) window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      else window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } else {
      if (!token) window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch {
    return;
  }
}

export function getAuthToken(): string | null {
  if (inMemoryAuthToken) return inMemoryAuthToken;
  if (typeof window === "undefined") return null;

  try {
    const token = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    return token || null;
  } catch {
    return null;
  }
}

export function clearAuthToken(): void {
  setAuthToken(null);
}

export interface HttpClientOptions {
  baseURL?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

type RetryableConfig = AxiosRequestConfig & { __retryCount?: number };

function isIdempotentMethod(method?: string): boolean {
  const m = (method || "GET").toUpperCase();
  return m === "GET" || m === "HEAD" || m === "OPTIONS";
}

function shouldRetry(error: AxiosError, config: RetryableConfig, maxRetries: number): boolean {
  const retryCount = config.__retryCount ?? 0;
  if (retryCount >= maxRetries) return false;
  if (!isIdempotentMethod(config.method)) return false;
  if (config.signal?.aborted) return false;

  const status = error.response?.status;
  if (!status) return true;
  if (status === 429) return true;
  return status >= 500 && status <= 599;
}

function getBackoffDelayMs(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s for 429 status codes
  const base = 1000 * Math.pow(2, retryCount);
  const jitter = Math.floor(Math.random() * 200);
  return Math.min(base + jitter, 8000);
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Request aborted", "AbortError"));
    };

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };

    signal?.addEventListener("abort", onAbort);
  });
}

function toPlainHeaders(headers: AxiosResponse["headers"]): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers) return out;
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) out[key] = value.join(", ");
    else if (typeof value === "string") out[key] = value;
    else if (typeof value === "number") out[key] = String(value);
    else if (typeof value === "boolean") out[key] = value ? "true" : "false";
  }
  return out;
}

export function normalizeHttpError(error: unknown): {
  status?: ApiStatusCode;
  error: ApiErrorDetails;
  headers?: Record<string, string>;
} {
  if (!axios.isAxiosError(error)) {
    return { error: { message: error instanceof Error ? error.message : "Unknown error" } };
  }

  const axiosError = error as AxiosError;
  const status = axiosError.response?.status as ApiStatusCode | undefined;
  const headers = axiosError.response ? toPlainHeaders(axiosError.response.headers) : undefined;

  const message =
    (typeof axiosError.response?.data === "object" &&
      axiosError.response?.data &&
      "error" in (axiosError.response.data as any) &&
      (axiosError.response.data as any).error?.message) ||
    axiosError.message ||
    "Request failed";

  return {
    status,
    headers,
    error: {
      message: String(message),
      details: axiosError.response?.data,
    },
  };
}

export function createHttpClient(options: HttpClientOptions = {}): AxiosInstance {
  const baseURL = options.baseURL ?? getApiBaseUrl();
  const timeout = options.timeoutMs ?? 15000;
  const maxRetries = options.maxRetries ?? 3;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    transformResponse: [
      ...(axios.defaults.transformResponse as any),
      (data: any) => {
        if (typeof data !== "string") return data;
        const trimmed = data.trim();
        if (!trimmed) return data;
        try {
          return JSON.parse(trimmed);
        } catch {
          return data;
        }
      },
    ],
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("X-Requested-With", "XMLHttpRequest");

    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const config = (error.config || {}) as RetryableConfig;

      // Show user-friendly error toast when retries are exhausted for 429
      if (error.response?.status === 429 &&
        (config.__retryCount ?? 0) >= maxRetries) {
        // Dynamic import to avoid server-side rendering issues
        if (typeof window !== 'undefined') {
          import('sonner').then(({ toast }) => {
            toast.error('Server is busy, please try again later', {
              description: 'The server is experiencing high traffic. Please wait a moment and retry.',
              duration: 5000,
            });
          });
        }
      }

      if (!shouldRetry(error, config, maxRetries)) {
        return Promise.reject(error);
      }

      config.__retryCount = (config.__retryCount ?? 0) + 1;
      await sleep(getBackoffDelayMs(config.__retryCount), config.signal as AbortSignal);
      return instance.request(config);
    },
  );

  return instance;
}

export const httpClient = createHttpClient();
