import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import Icon from "../../components/ui/Icon";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <Icon icon={Home} />
          Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-400 text-lg">
          Learn more about TradeFlow and how our RWA protocol works.
        </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* FAQ Item 1 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            What is TradeFlow?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            TradeFlow is a Real World Asset (RWA) protocol built on the Stellar blockchain that enables 
            tokenization and trading of invoice-based assets. Our platform allows businesses to convert 
            their invoices into digital tokens, creating liquidity and enabling new financing opportunities 
            in the DeFi ecosystem.
          </p>
        </div>

        {/* FAQ Item 2 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            How does invoice tokenization work?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            When a business submits an invoice to TradeFlow, our risk engine analyzes the invoice 
            quality, debtor creditworthiness, and payment history. Approved invoices are minted as 
            NFT tokens on the Stellar blockchain, representing ownership of the future cash flow. 
            These tokens can then be traded on our secondary market or used as collateral for loans.
          </p>
        </div>

        {/* FAQ Item 3 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            What are the fees for using TradeFlow?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            TradeFlow charges a 1% fee on invoice tokenization and a 0.5% fee on secondary market 
            trades. There are no upfront costs for submitting invoices for evaluation. Borrowers 
            pay interest rates ranging from 5-12% APR depending on the invoice quality and risk score, 
            significantly lower than traditional factoring rates.
          </p>
        </div>

        {/* FAQ Item 4 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            What wallets are supported?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Currently, TradeFlow supports Freighter wallet, the most popular wallet in the Stellar 
            ecosystem. We&apos;re working on adding support for additional wallets including MetaMask and 
            WalletConnect in future updates. All wallet connections are secured by Stellar&apos;s built-in 
            encryption and multi-signature support.
          </p>
        </div>

        {/* FAQ Item 5 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            How is risk assessed for invoices?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Our proprietary risk engine analyzes multiple factors including debtor credit history, 
            payment patterns, invoice age, industry risk, and macroeconomic conditions. Each invoice 
            receives a risk score from 0-100, which determines eligibility and pricing. Higher risk 
            scores result in better rates and higher tokenization limits.
          </p>
        </div>

        {/* FAQ Item 6 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Can I trade tokens before the invoice is paid?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Yes, invoice tokens can be traded on our secondary market at any time before maturity. 
            The token price reflects the remaining time to payment and perceived risk. This provides 
            liquidity to invoice holders and investment opportunities for traders seeking yield from 
            short-term credit instruments.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-700">
        <p className="text-slate-400 text-center">
          Still have questions? Contact our support team or check our documentation.
        </p>
      </div>
    </div>
  );
}

// Inconsequential change for repo health
