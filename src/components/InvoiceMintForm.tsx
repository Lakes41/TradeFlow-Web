"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Calendar, DollarSign, Building, FileText, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import Button from "./ui/Button";
import { useMintInvoice } from "@/hooks/useMintInvoice";
import Icon from "./ui/Icon";

// Enhanced validation schema with sanitization
const sanitizeString = (str: string) => str.trim().replace(/[<>"'&]/g, '');

const invoiceSchema = z.object({
  debtorName: z
    .string()
    .min(2, "Debtor name must be at least 2 characters")
    .max(100, "Debtor name cannot exceed 100 characters")
    .transform(sanitizeString),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed $1,000,000"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, "Due date must be in the future"),
  invoiceFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .optional(),
  supportingDocumentUri: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceMintFormProps {
  onClose: () => void;
  onSuccess?: (txStatus: string) => void;
}

interface FeeEstimate {
  networkFee: number;
  protocolFee: number;
  totalFee: number;
}

export default function InvoiceMintForm({ onClose, onSuccess }: InvoiceMintFormProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [feeEstimate, setFeeEstimate] = useState<FeeEstimate>({
    networkFee: 0,
    protocolFee: 0,
    totalFee: 0
  });
  const { data: session } = useSession();
  const { mint, loading: minting, error: mintError, txStatus } = useMintInvoice();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  // Calculate fees whenever amount changes
  const watchedAmount = watch("amount");
  
  useEffect(() => {
    if (watchedAmount && watchedAmount > 0) {
      // Network fee: ~0.01 XLM per transaction (converted to USD)
      // Protocol fee: 0.5% of invoice amount
      const networkFeeXLM = 0.01;
      const xlmPrice = 0.10; // Approximate XLM price in USD (should come from oracle)
      const networkFeeUSD = networkFeeXLM * xlmPrice;
      const protocolFee = watchedAmount * 0.005; // 0.5% protocol fee
      
      setFeeEstimate({
        networkFee: networkFeeUSD,
        protocolFee: protocolFee,
        totalFee: networkFeeUSD + protocolFee
      });
    } else {
      setFeeEstimate({
        networkFee: 0,
        protocolFee: 0,
        totalFee: 0
      });
    }
  }, [watchedAmount]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file.name);
      setValue("invoiceFile", file);
    }
  };

  // Format payload for Soroban smart contract
  const formatContractPayload = (data: InvoiceFormData) => {
    const publicKey = (session?.user as any)?.publicKey;
    const amountInStroops = BigInt(Math.round(data.amount * 10_000_000));
    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      invoiceId,
      amount: amountInStroops,
      recipient: publicKey,
      callerPublicKey: publicKey,
      metadata: {
        debtorName: data.debtorName,
        dueDate: data.dueDate,
        supportingDocumentUri: data.supportingDocumentUri || null,
        timestamp: Date.now()
      }
    };
  };

  const onFormSubmit = async (data: InvoiceFormData) => {
    const publicKey = (session?.user as any)?.publicKey;
    if (!publicKey) {
      alert("Please connect your Stellar wallet first.");
      return;
    }

    // Validate that at least one document is provided
    if (!data.invoiceFile && !data.supportingDocumentUri) {
      alert("Please provide either an invoice file or a supporting document URI.");
      return;
    }

    try {
      const contractPayload = formatContractPayload(data);
      const status = await mint(contractPayload);

      reset();
      setFilePreview(null);
      onSuccess?.(status);
      onClose();
    } catch {
      // mintError state handles display below
    }
  };

  const busy = isSubmitting || minting;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Mint Invoice NFT</h2>
            <p className="text-sm text-slate-400 mt-1">Submit your invoice for factoring</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <Icon icon={X} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Debtor Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Building} dense className="inline mr-1" />
              Debtor Name *
            </label>
            <input
              type="text"
              placeholder="Enter debtor company or individual name"
              {...register("debtorName")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.debtorName && <p className="mt-2 text-sm text-red-400">{errors.debtorName.message}</p>}
          </div>

          {/* Invoice Amount Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={DollarSign} dense className="inline mr-1" />
              Invoice Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Due Date Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Calendar} dense className="inline mr-1" />
              Due Date *
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.dueDate && <p className="mt-2 text-sm text-red-400">{errors.dueDate.message}</p>}
          </div>

          {/* Invoice File Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Upload} dense className="inline mr-1" />
              Invoice Document (PDF)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="invoice-file"
              />
              <label
                htmlFor="invoice-file"
                className="flex items-center justify-center w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <Icon icon={Upload} dense className="mr-2 text-slate-400" />
                <span className="text-slate-300">{filePreview || "Choose PDF file"}</span>
              </label>
            </div>
            {errors.invoiceFile && (
              <p className="mt-2 text-sm text-red-400">{errors.invoiceFile.message}</p>
            )}
          </div>

          {/* Supporting Document URI Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={FileText} dense className="inline mr-1" />
              Supporting Document URI
            </label>
            <input
              type="url"
              placeholder="https://example.com/invoice-doc.pdf"
              {...register("supportingDocumentUri")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.supportingDocumentUri && (
              <p className="mt-2 text-sm text-red-400">{errors.supportingDocumentUri.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Optional: Provide a link to additional documentation</p>
          </div>

          {/* Fee Breakdown */}
          {feeEstimate.totalFee > 0 && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon icon={Info} dense className="mr-2 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Fee Breakdown</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Network Fee:</span>
                  <span>${feeEstimate.networkFee.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Protocol Fee (0.5%):</span>
                  <span>${feeEstimate.protocolFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-600">
                  <span className="font-medium">Total Fees:</span>
                  <span className="font-medium">${feeEstimate.totalFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contract error feedback */}
          {mintError && (
            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{mintError}</p>
          )}
          {txStatus && (
            <p className="text-sm text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
              On-chain: {txStatus}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy || !watch("debtorName") || !watch("amount") || !watch("dueDate")}
            className="w-full py-3 px-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {busy ? "Submitting to Stellar..." : "Mint Invoice NFT"}
          </Button>
        </form>
      </div>
    </div>
  );
}