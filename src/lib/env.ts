import { z } from "zod";

const urlSchema = z.string().url();

export interface PublicEnvConfig {
  apiUrl?: string;
}

/**
 * Reads and validates NEXT_PUBLIC_API_URL.
 *
 * - If unset or empty, returns undefined.
 * - If set but invalid, throws an Error.
 */
export function getPublicEnvConfig(): PublicEnvConfig {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return {};

  const parsed = urlSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid NEXT_PUBLIC_API_URL. Expected an absolute URL.");
  }

  return { apiUrl: parsed.data.replace(/\/+$/, "") };
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
