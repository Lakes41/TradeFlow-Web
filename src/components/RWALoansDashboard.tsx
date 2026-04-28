"use client";

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, FileText, Building, DollarSign, Percent, Calendar, CheckCircle, Clock, Wallet } from 'lucide-react';

// --- Types & Interfaces ---
type LoanStatus = 'Funding' | 'Active' | 'Repaid';

interface RWALoan {
  id: string;
  invoiceId: string;
  debtor: string;
  amount: number;
  apy: number;
  maturityDate: string; // ISO string date
  status: LoanStatus;
}

interface SortConfig {
  key: keyof RWALoan | null;
  direction: 'asc' | 'desc';
}

// --- Mock Data ---
const MOCK_RWA_LOANS: RWALoan[] = [
  {
    id: 'RWA-001',
    invoiceId: 'INV-8821',
    debtor: 'Acme Corporation',
    amount: 50000,
    apy: 8.5,
    maturityDate: '2026-06-15T00:00:00Z',
    status: 'Active'
  },
  {
    id: 'RWA-002',
    invoiceId: 'INV-9942',
    debtor: 'Global Industries Ltd',
    amount: 120000,
    apy: 10.2,
    maturityDate: '2026-04-20T00:00:00Z',
    status: 'Funding'
  },
  {
    id: 'RWA-003',
    invoiceId: 'INV-7731',
    debtor: 'Tech Solutions Inc',
    amount: 35000,
    apy: 7.8,
    maturityDate: '2026-03-10T00:00:00Z',
    status: 'Repaid'
  },
  {
    id: 'RWA-004',
    invoiceId: 'INV-6521',
    debtor: 'Manufacturing Co',
    amount: 85000,
    apy: 9.3,
    maturityDate: '2026-08-30T00:00:00Z',
    status: 'Active'
  },
  {
    id: 'RWA-005',
    invoiceId: 'INV-4482',
    debtor: 'Retail Chain LLC',
    amount: 65000,
    apy: 11.5,
    maturityDate: '2026-05-25T00:00:00Z',
    status: 'Funding'
  },
];

// --- Helper Functions ---

// Format currency with proper formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable format
const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Returns the correct Tailwind classes based on the status
const StatusBadge = ({ status }: { status: LoanStatus }) => {
  switch (status) {
    case 'Repaid':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          <CheckCircle size={12} />
          Repaid
        </span>
      );
    case 'Funding':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          <Clock size={12} />
          Funding
        </span>
      );
    case 'Active':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Wallet size={12} />
          Active
        </span>
      );
  }
};

// --- Main Component ---
export default function RWALoansDashboard() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [loans] = useState<RWALoan[]>(MOCK_RWA_LOANS);

  // Handle sorting
  const handleSort = (key: keyof RWALoan) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the loans based on the current sort configuration
  const sortedLoans = useMemo(() => {
    let sortableLoans = [...loans];
    if (sortConfig.key) {
      sortableLoans.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLoans;
  }, [loans, sortConfig]);

  // Get sort icon for column headers
  const getSortIcon = (columnKey: keyof RWALoan) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} className="text-slate-500" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="text-blue-400" /> : 
      <ArrowDown size={14} className="text-blue-400" />;
  };

  // Check if there are any active loans
  const hasActiveLoans = loans.length > 0;

  if (!hasActiveLoans) {
    return (
      <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Active RWA Loans</h2>
        </div>
        <div className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Loans</h3>
            <p className="text-slate-400 text-sm max-w-md mb-6">
              There are currently no active RWA loans in the system. Check back later or create a new invoice to get started.
            </p>
            <button
              onClick={() => console.log('Create new invoice')}
              className="bg-tradeflow-accent hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Create New Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active RWA Loans</h2>
          <div className="text-sm text-slate-400">
            {loans.length} {loans.length === 1 ? 'loan' : 'loans'} available
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  Invoice ID
                </div>
              </th>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Building size={16} />
                  Debtor
                </div>
              </th>
              <th className="p-4 font-semibold">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <DollarSign size={16} />
                  Amount
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="p-4 font-semibold">
                <button
                  onClick={() => handleSort('apy')}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Percent size={16} />
                  APY
                  {getSortIcon('apy')}
                </button>
              </th>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Maturity Date
                </div>
              </th>
              <th className="p-4 font-semibold">
                <div className="flex items-center gap-2">
                  Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tradeflow-muted/20">
            {sortedLoans.map((loan) => (
              <tr
                key={loan.id}
                className="hover:bg-tradeflow-muted/10 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-blue-300">
                      #{loan.invoiceId.slice(-6)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({loan.id})
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-white">
                    {loan.debtor}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-lg text-white">
                    {formatCurrency(loan.amount)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-green-400">
                    {loan.apy.toFixed(2)}%
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-300">
                    {formatDate(loan.maturityDate)}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={loan.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-tradeflow-muted/20 bg-tradeflow-dark/30">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div>
            Showing {sortedLoans.length} of {loans.length} loans
          </div>
          <div>
            Total Value: {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
