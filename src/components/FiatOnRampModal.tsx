"use client";

import React from "react";
import { X, ExternalLink, CreditCard, ShieldCheck, Zap } from "lucide-react";
import Card from "./Card";
import Icon from "./ui/Icon";

interface FiatOnRampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FiatOnRampModal({ isOpen, onClose }: FiatOnRampModalProps) {
  if (!isOpen) return null;

  const providers = [
    {
      name: "MoonPay",
      description: "Fast and easy with credit card or bank transfer.",
      fee: "Starting at 1.0%",
      speed: "Minutes",
      badge: "Most Popular",
      color: "blue"
    },
    {
      name: "Transak",
      description: "Competitive rates and global support.",
      fee: "Starting at 0.5%",
      speed: "10-30 min",
      badge: "Lower Fees",
      color: "green"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <Card className="w-full max-w-lg shadow-2xl bg-slate-950 border-slate-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Buy Crypto</h2>
            <p className="text-slate-400 text-sm">On-ramp fiat currency to the Stellar network</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-900 rounded-full"
          >
            <Icon icon={X} />
          </button>
        </div>

        <div className="grid gap-4 mb-8">
          {providers.map((p) => (
            <button
              key={p.name}
              className="group text-left p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon icon={CreditCard} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{p.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                         <Icon icon={ShieldCheck} dense className="text-green-500" /> Secure
                       </span>
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                         <Icon icon={Zap} dense className="text-orange-500" /> {p.speed}
                       </span>
                    </div>
                  </div>
                </div>
                {p.badge && (
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4">{p.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Processing Fee: <span className="text-slate-300">{p.fee}</span></span>
                <span className="text-blue-400 font-medium flex items-center gap-1">
                  Continue to {p.name} <Icon icon={ExternalLink} dense />
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          By continuing, you will be redirected to a third-party provider. TradeFlow does not process your fiat payments and is not responsible for any issues with third-party services.
        </p>
      </Card>
    </div>
  );
}