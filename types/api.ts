export type ApiStatusCode =
  | 200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500
  | 502
  | 503
  | 504;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A normalized API error payload used throughout the frontend.
 *
 * - message: Human-readable error message suitable for UI display
 * - code: Optional machine-readable error identifier
 * - details: Optional opaque details (e.g. backend error object) for debugging
 */
export interface ApiErrorDetails {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Standard backend error response shape.
 */
export interface ApiErrorResponse {
  error: ApiErrorDetails;
}

/**
 * Standard success result returned by API wrapper functions.
 */
export interface ApiSuccess<TData> {
  ok: true;
  status: ApiStatusCode;
  data: TData;
  headers: Record<string, string>;
}

/**
 * Standard failure result returned by API wrapper functions.
 */
export interface ApiFailure {
  ok: false;
  status?: ApiStatusCode;
  error: ApiErrorDetails;
  headers?: Record<string, string>;
}

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

/**
 * GET /health response.
 *
 * status values:
 * - ok: service is healthy
 * - degraded: service is partially degraded
 * - error: service is unhealthy
 */
export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  service?: string;
  version?: string;
  timestamp?: string;
  uptimeSeconds?: number;
  [key: string]: unknown;
}

/**
 * Parameters for GET /v1/risk.
 */
export interface GetRiskScoreParams {
  invoiceId: string;
}

/**
 * GET /v1/risk response.
 *
 * - riskScore is expected to be a numeric score (typically 0-100).
 * - factors is an optional map of contributing factor names to weights/scores.
 */
export interface RiskScoreResponse {
  invoiceId: string;
  riskScore: number;
  scoreRange?: {
    min: number;
    max: number;
  };
  grade?: string;
  factors?: Record<string, number>;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Minimal invoice summary used by the dashboard table.
 */
export interface InvoiceSummary {
  id: string;
  riskScore: number;
  status: string;
  amount: number | string;
  apy?: number;
  riskTier?: 'A' | 'B' | 'C' | 'D';
  [key: string]: unknown;
}

export type InvoicesResponse = InvoiceSummary[];

/**
 * A single PnL chart point.
 */
export interface PnlPoint {
  date: string;
  value: number;
}

export type PnlResponse = PnlPoint[];

/**
 * Narrowly validates that an unknown value is a plain object (and not null/array).
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Runtime validator for ApiErrorResponse.
 */
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value)) return false;
  if (!("error" in value)) return false;
  const err = value.error;
  return isRecord(err) && typeof err.message === "string";
}

/**
 * Runtime validator for HealthResponse.
 */
export function isHealthResponse(value: unknown): value is HealthResponse {
  if (!isRecord(value)) return false;
  const status = value.status;
  return status === "ok" || status === "degraded" || status === "error";
}

/**
 * Runtime validator for RiskScoreResponse.
 */
export function isRiskScoreResponse(value: unknown): value is RiskScoreResponse {
  if (!isRecord(value)) return false;
  return typeof value.invoiceId === "string" && typeof value.riskScore === "number";
}

/**
 * Runtime validator for InvoicesResponse.
 */
export function isInvoicesResponse(value: unknown): value is InvoicesResponse {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      typeof item.id === "string" &&
      typeof item.riskScore === "number" &&
      typeof item.status === "string" &&
      (typeof item.amount === "number" || typeof item.amount === "string")
    );
  });
}

/**
 * Runtime validator for PnlResponse.
 */
export function isPnlResponse(value: unknown): value is PnlResponse {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return typeof item.date === "string" && typeof item.value === "number";
  });
}
