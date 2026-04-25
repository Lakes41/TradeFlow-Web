"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PaginationControls from './PaginationControls';
import SkeletonRow from './SkeletonRow';

interface Invoice {
  id: string;
  riskScore: number;
  status: string;
  amount: number;
  apy?: number;
  riskTier?: 'A' | 'B' | 'C' | 'D';
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface InvoicesResponse {
  data: Invoice[];
  pagination: PaginationInfo;
}

interface InvoiceTableProps {
  filters?: {
    minApy: number;
    maxApy: number;
    tiers: string[];
  };
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ filters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Build query string from filters
  const queryString = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    ...(filters?.minApy !== undefined && { minApy: filters.minApy.toString() }),
    ...(filters?.maxApy !== undefined && { maxApy: filters.maxApy.toString() }),
    ...(filters?.tiers && filters.tiers.length > 0 && { tiers: filters.tiers.join(',') }),
  }).toString();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useQuery<InvoicesResponse>({
    queryKey: ['invoices', currentPage, itemsPerPage, filters],
    queryFn: async () => {
      const response = await fetch(`/api/invoices?${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      return response.json();
    },
    keepPreviousData: true, // Prevents UI from flashing empty while fetching next page
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        <p className="font-medium">Error loading invoices</p>
        <p className="text-sm opacity-80">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Verified Asset Pipeline</h2>
      </div>

      <div className="relative">
        <table className="w-full text-left">
          <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase sticky top-0 z-10">
            <tr>
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Risk Score</th>
              <th className="p-4">Risk Tier</th>
              <th className="p-4">APY</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading && !invoicesData ? (
              // Show skeleton rows on initial load
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <SkeletonRow key={`skeleton-${index}`} />
              ))
            ) : (
              invoicesData?.data.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={`border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition ${isFetching ? 'opacity-60' : ''
                    }`}
                >
                  <td className="p-4 font-mono text-sm text-blue-300">
                    #{invoice.id.slice(-6)}
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-tradeflow-muted h-2 rounded-full max-w-25">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${invoice.riskScore}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4">
                    {invoice.riskTier && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          invoice.riskTier === 'A' ? 'bg-green-500/20 text-green-400' :
                          invoice.riskTier === 'B' ? 'bg-blue-500/20 text-blue-400' :
                          invoice.riskTier === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {invoice.riskTier}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-green-400">
                    {invoice.apy ? `${invoice.apy.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    <span
                      className={`px-3 py-1 rounded-full ${invoice.status === "Approved"
                          ? "bg-tradeflow-success/20 text-tradeflow-success"
                          : "bg-tradeflow-warning/20 text-tradeflow-warning"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-lg">${invoice.amount.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Loading overlay for page changes */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center z-20">
            <div className="text-blue-400 text-sm font-medium">Loading...</div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {invoicesData && (
        <PaginationControls
          pagination={invoicesData.pagination}
          onPageChange={handlePageChange}
          isLoading={isFetching}
        />
      )}
    </div>
  );
};

export default InvoiceTable;
