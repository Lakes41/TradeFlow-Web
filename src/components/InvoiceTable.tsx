"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PaginationControls from './PaginationControls';
import SkeletonRow from './SkeletonRow';
import DataUnavailable from './DataUnavailable';
import { useBackendHealth } from '../contexts/BackendHealthContext';
import { isBackendHealthError } from '../lib/apiHealth';

interface Invoice {
  id: string;
  riskScore: number;
  status: string;
  amount: number;
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

const InvoiceTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { reportError, reportSuccess } = useBackendHealth();

  const {
    data: invoicesData,
    isLoading,
    isFetching,
    error,
  } = useQuery<InvoicesResponse>({
    queryKey: ['invoices', currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/invoices?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        reportSuccess('/api/invoices');
        return data;
      } catch (err) {
        const error = err as Error;
        if (isBackendHealthError(error)) {
          reportError(error, '/api/invoices');
        }
        throw error;
      }
    },
    keepPreviousData: true, // Prevents UI from flashing empty while fetching next page
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <DataUnavailable
        title="Unable to Load Invoices"
        message={error.message}
        type="table"
        onRetry={() => window.location.reload()}
      />
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
