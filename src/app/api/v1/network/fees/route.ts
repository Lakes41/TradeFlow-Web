import { NextRequest, NextResponse } from 'next/server';

// Mock response that simulates network congestion
// In production, this would call Stellar RPC or a monitoring service
const MOCK_BASELINE_FEE = 100; // stroops
const MOCK_CURRENT_FEE = 350; // stroops (3.5x baseline = congested)

export async function GET(request: NextRequest) {
  // Simulate occasional high congestion for demo purposes
  // You can adjust this value to test the banner
  const shouldSimulateCongestion = request.nextUrl.searchParams.get('congested') === 'true';
  const estimatedTotal = shouldSimulateCongestion ? MOCK_CURRENT_FEE : MOCK_BASELINE_FEE;

  return NextResponse.json({
    estimatedTotal,
    // Optional: add more fields for future UI enhancements
    minFee: 100,
    maxFee: 500,
    p50: 120,
    p95: shouldSimulateCongestion ? 400 : 180,
  });
}
