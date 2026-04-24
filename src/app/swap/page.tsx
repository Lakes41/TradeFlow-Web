"use client";

import React from "react";
import SwapInterface from "../../components/SwapInterface";
import Footer from "../../components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Swap <span className="text-blue-400">Assets</span>
          </h1>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-8">
        <SwapInterface />
      </main>

      <Footer />
    </div>
  );
}
