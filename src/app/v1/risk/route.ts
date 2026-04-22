import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "../../../lib/env";

function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowList = (process.env.CORS_ALLOW_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin && (allowList.length === 0 ? origin.startsWith("http://localhost") : allowList.includes(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function isSafeInvoiceId(invoiceId: string): boolean {
  if (!invoiceId) return false;
  if (invoiceId.length > 128) return false;
  return /^[a-zA-Z0-9._:-]+$/.test(invoiceId);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  const invoiceId = request.nextUrl.searchParams.get("invoiceId") || "";

  if (!isSafeInvoiceId(invoiceId)) {
    return NextResponse.json(
      { error: { message: "Invalid invoiceId. Expected 1-128 chars: letters, numbers, . _ : -" } },
      { status: 400, headers: corsHeaders },
    );
  }

  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    const score =
      invoiceId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 101;
    return NextResponse.json(
      {
        invoiceId,
        riskScore: score,
        updatedAt: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders },
    );
  }

  const upstreamUrl = new URL(`${apiUrl}/v1/risk`);
  upstreamUrl.searchParams.set("invoiceId", invoiceId);

  const auth = request.headers.get("authorization") || undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await upstreamRes.text();
    const contentType = upstreamRes.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Upstream /v1/risk request timed out"
        : error instanceof Error
          ? error.message
          : "Upstream /v1/risk request failed";

    return NextResponse.json({ error: { message } }, { status: 502, headers: corsHeaders });
  } finally {
    clearTimeout(timeout);
  }
}
