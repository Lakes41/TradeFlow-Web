import { z } from "zod";

const urlSchema = z.string().url();

export interface PublicEnvConfig {
  apiUrl?: string;
  wsUrl?: string;
}

/**
 * Reads and validates NEXT_PUBLIC_API_URL.
 *
 * - If unset or empty, returns undefined.
 * - If set but invalid, throws an Error.
 */
export function getPublicEnvConfig(): PublicEnvConfig {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const wsRaw = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (!raw && !wsRaw) return {};

  const out: PublicEnvConfig = {};

  if (raw) {
    const parsed = urlSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid NEXT_PUBLIC_API_URL. Expected an absolute URL.");
    }
    out.apiUrl = parsed.data.replace(/\/+$/, "");
  }

  if (wsRaw) {
    const parsed = urlSchema.safeParse(wsRaw);
    if (!parsed.success) {
      throw new Error("Invalid NEXT_PUBLIC_WS_URL. Expected an absolute URL.");
    }
    out.wsUrl = parsed.data.replace(/\/+$/, "");
  }

  return out;
}

export interface ApiUrlOptions {
  required?: boolean;
}

/**
 * Returns the API base URL to use for outgoing requests.
 *
 * - If NEXT_PUBLIC_API_URL is configured, returns it (without a trailing slash).
 * - Otherwise returns an empty string, so clients can use same-origin paths.
 *
 * If required=true and the variable is missing, throws an Error.
 */
export function getApiBaseUrl(options: ApiUrlOptions = {}): string {
  const { required = false } = options;
  const { apiUrl } = getPublicEnvConfig();

  if (!apiUrl) {
    if (required) {
      throw new Error("NEXT_PUBLIC_API_URL is required but not set.");
    }
    return "";
  }

  return apiUrl;
}

export interface WsUrlOptions {
  required?: boolean;
}

export function getWsBaseUrl(options: WsUrlOptions = {}): string {
  const { required = false } = options;
  const { wsUrl } = getPublicEnvConfig();

  if (wsUrl) return wsUrl;

  const apiUrl = getApiBaseUrl();
  if (apiUrl) {
    const url = new URL(apiUrl);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.origin;
  }

  if (typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}`;
  }

  if (required) {
    throw new Error("NEXT_PUBLIC_WS_URL is required but not set.");
  }

  return "";
}
