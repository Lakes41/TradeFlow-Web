"use client";

import React from 'react';
import { formatCurrency, formatDate } from '../lib/format';

// --- Types & Interfaces ---
type LoanStatus = 'Active' | 'Overdue' | 'Repaid';

interface Loan {
  id: string;
  invoiceId: string;
  amountBorrowed: number;
  interestRate: number; // Annual rate in percentage (e.g., 5 for 5%)
  startDate: string;    // ISO string date
  status: LoanStatus;
}

// --- Mock Data ---
const MOCK_LOANS: Loan[] = [
  { id: 'L-001', invoiceId: 'INV-8821', amountBorrowed: 5000, interestRate: 10, startDate: '2026-01-10T00:00:00Z', status: 'Active' },
  { id: 'L-002', invoiceId: 'INV-9942', amountBorrowed: 12000, interestRate: 12, startDate: '2025-11-01T00:00:00Z', status: 'Overdue' },
  { id: 'L-003', invoiceId: 'INV-7731', amountBorrowed: 3500, interestRate: 8, startDate: '2026-02-01T00:00:00Z', status: 'Repaid' },
];

// --- Helper Functions ---

// Calculates interest based on time elapsed: (Amount * Rate) * (DaysElapsed / 365)
const calculateInterest = (amount: number, rate: number, startDateStr: string): number => {
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const interest = (amount * (rate / 100)) * (diffDays / 365);
  return interest;
};

// Returns the correct Tailwind classes based on the status
const StatusBadge = ({ status }: { status: LoanStatus }) => {
  switch (status) {
    case 'Repaid':
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Repaid</span>;
    case 'Overdue':
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Overdue</span>;
    case 'Active':
    default:
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Active</span>;
  }
};

// --- Main Component ---
export default function LoanTable() {
  const handleRepay = (loanId: string) => {
    console.log(`Initiating repayment for loan: ${loanId}`);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700/50">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Invoice ID</th>
            <th scope="col" className="px-6 py-4 font-semibold">Amount Borrowed</th>
            <th scope="col" className="px-6 py-4 font-semibold">Interest Accrued</th>
            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {MOCK_LOANS.map((loan) => (
            <tr key={loan.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-blue-300 font-mono">
                {loan.invoiceId}
              </td>
              <td className="px-6 py-4 text-slate-200">
                {formatCurrency(loan.amountBorrowed, false)}
              </td>
              <td className="px-6 py-4 text-slate-200">
                {formatCurrency(calculateInterest(loan.amountBorrowed, loan.interestRate, loan.startDate), false)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={loan.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleRepay(loan.id)}
                  disabled={loan.status === 'Repaid'}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${loan.status === 'Repaid'
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-tradeflow-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    }`}
                >
                  Repay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Inconsequential change for repo health
