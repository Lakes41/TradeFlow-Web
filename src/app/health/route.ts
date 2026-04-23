import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "../../lib/env";

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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) });
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  const apiUrl = getApiBaseUrl();
  if (!apiUrl) {
    return NextResponse.json(
      {
        status: "ok",
        service: "tradeflow-web",
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders },
    );
  }

  const upstreamUrl = `${apiUrl}/health`;
  const auth = request.headers.get("authorization") || undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const upstreamRes = await fetch(upstreamUrl, {
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
        ? "Upstream /health request timed out"
        : error instanceof Error
          ? error.message
          : "Upstream /health request failed";

    return NextResponse.json({ error: { message } }, { status: 502, headers: corsHeaders });
  } finally {
    clearTimeout(timeout);
  }
}
