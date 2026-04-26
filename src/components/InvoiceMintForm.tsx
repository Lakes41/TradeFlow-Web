"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Calendar, DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import Button from "./ui/Button";
import { useMintInvoice } from "@/hooks/useMintInvoice";
import Icon from "./ui/Icon";

const invoiceSchema = z.object({
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
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceMintFormProps {
  onClose: () => void;
  onSuccess?: (txStatus: string) => void;
}

export default function InvoiceMintForm({ onClose, onSuccess }: InvoiceMintFormProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file.name);
      setValue("invoiceFile", file);
    }
  };

  const onFormSubmit = async (data: InvoiceFormData) => {
    const publicKey = (session?.user as any)?.publicKey;
    if (!publicKey) {
      alert("Please connect your Stellar wallet first.");
      return;
    }

    // Convert dollar amount to stroops (1 XLM = 10,000,000 stroops)
    const amountInStroops = BigInt(Math.round(data.amount * 10_000_000));
    const invoiceId = `INV-${Date.now()}`;

    try {
      const status = await mint({
        invoiceId,
        amount: amountInStroops,
        recipient: publicKey,
        callerPublicKey: publicKey,
      });

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
          <h2 className="text-xl font-semibold text-white">Mint Invoice NFT</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <Icon icon={X} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={DollarSign} dense className="inline mr-1" />
              Invoice Amount ($)
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Calendar} dense className="inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.dueDate && <p className="mt-2 text-sm text-red-400">{errors.dueDate.message}</p>}
          </div>

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
            disabled={busy}
            className="w-full py-3 px-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {busy ? "Submitting to Stellar..." : "Mint Invoice NFT"}
          </Button>
        </form>
      </div>
    </div>
  );
}