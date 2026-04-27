import { NextRequest, NextResponse } from 'next/server';

// Mock data generator for demonstration
const generateMockInvoices = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const riskScore = Math.floor(Math.random() * 40) + 60; // 60-100
    // Determine risk tier based on risk score
    let riskTier: 'A' | 'B' | 'C' | 'D';
    if (riskScore >= 90) riskTier = 'A';
    else if (riskScore >= 80) riskTier = 'B';
    else if (riskScore >= 70) riskTier = 'C';
    else riskTier = 'D';
    
    // APY correlates inversely with risk (higher risk = higher yield)
    const apy = Number((5 + (100 - riskScore) * 0.2 + Math.random() * 5).toFixed(2));
    
    return {
      id: `INV-${String(index + 1).padStart(4, '0')}`,
      riskScore,
      status: Math.random() > 0.3 ? 'Approved' : 'Pending',
      amount: Math.floor(Math.random() * 50000) + 1000, // $1,000 - $51,000
      apy,
      riskTier,
    };
  });
};

// Generate 10,000 mock invoices
const ALL_INVOICES = generateMockInvoices(10000);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // Parse filter parameters
  const minApy = parseFloat(searchParams.get('minApy') || '0');
  const maxApy = parseFloat(searchParams.get('maxApy') || '100');
  const tiers = searchParams.get('tiers')?.split(',').filter(Boolean) || [];
  
  // Validate parameters
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page
  
  // Apply filters
  let filteredInvoices = ALL_INVOICES.filter((invoice) => {
    // APY filter
    if (invoice.apy && (invoice.apy < minApy || invoice.apy > maxApy)) {
      return false;
    }
    
    // Risk tier filter
    if (tiers.length > 0 && invoice.riskTier && !tiers.includes(invoice.riskTier)) {
      return false;
    }
    
    return true;
  });
  
  // Calculate pagination
  const offset = (validPage - 1) * validLimit;
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / validLimit);
  
  // Get paginated data
  const invoices = filteredInvoices.slice(offset, offset + validLimit);
  
  // Return paginated response
  return NextResponse.json({
    data: invoices,
    pagination: {
      currentPage: validPage,
      totalPages,
      totalItems,
      itemsPerPage: validLimit,
      hasNextPage: validPage < totalPages,
      hasPreviousPage: validPage > 1,
    },
  });
}
