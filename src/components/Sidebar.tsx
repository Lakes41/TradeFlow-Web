"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Copy,
  Check,
  CreditCard
} from "lucide-react";
import { showError, showSuccess } from "../lib/toast";

// Import existing components
import NetworkSelector from "./NetworkSelector";
import FiatOnRampModal from "./FiatOnRampModal";
import NetworkFeeIndicator from "./ui/NetworkFeeIndicator";

interface SidebarProps {
  address?: string;
  onConnect?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar({ address, onConnect }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFiatModalOpen, setIsFiatModalOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      name: "Marketplace",
      href: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showSuccess("Address copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy address:', err);
        showError("Failed to copy address");
      }
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Focus trapping for mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen && mobileDrawerRef.current) {
      const focusableElements = mobileDrawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };

      mobileDrawerRef.current.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        mobileDrawerRef.current?.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isMobileMenuOpen]);

  const NavItemComponent = ({ item, isMobile = false }: { item: NavItem; isMobile?: boolean }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
            ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-400"
            : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
      >
        {item.icon}
        {!isCollapsed || isMobile ? (
          <span className={`font-medium ${isMobile ? "text-lg" : "text-sm"}`}>
            {item.name}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold tracking-tight">
            TradeFlow <span className="text-blue-400">RWA</span>
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={mobileDrawerRef}
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-slate-900 border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <h1 className="text-xl font-bold tracking-tight">
              TradeFlow <span className="text-blue-400">RWA</span>
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} isMobile={true} />
            ))}
          </nav>

          {/* Mobile Wallet Section */}
          <div className="p-4 border-t border-slate-700/50 space-y-3">
            <div className="flex items-center gap-2">
              <NetworkSelector />
              <NetworkFeeIndicator />
            </div>

            <button
              onClick={() => setIsFiatModalOpen(true)}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
            >
              <CreditCard size={18} />
              Buy Crypto
            </button>

            {address ? (
              <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                <Wallet size={18} />
                <span className="text-sm truncate">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="ml-auto p-1 hover:bg-blue-500 rounded transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check size={16} className="text-green-300" />
                  ) : (
                    <Copy size={16} className="text-white" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onConnect?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition animate-pulse"
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <div className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700/50 transition-all duration-300 z-30 ${isCollapsed ? "w-20" : "w-64"
          }`}>
          <div className="flex flex-col h-full">
            {/* Desktop Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              {!isCollapsed && (
                <h1 className="text-lg font-bold tracking-tight">
                  TradeFlow <span className="text-blue-400">RWA</span>
                </h1>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </nav>

            {/* Desktop Wallet Section */}
            <div className="p-4 border-t border-slate-700/50 space-y-3">
              {!isCollapsed && (
                <>
                  <div className="flex items-center gap-2">
                    <NetworkSelector />
                    <NetworkFeeIndicator />
                  </div>

                  <button
                    onClick={() => setIsFiatModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                  >
                    <CreditCard size={18} />
                    Buy Crypto
                  </button>
                </>
              )}

              {address ? (
                <div className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition ${isCollapsed ? "justify-center" : ""
                  }`}>
                  <Wallet size={18} />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm truncate">
                        {`${address.slice(0, 6)}...${address.slice(-4)}`}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="ml-auto p-1 hover:bg-blue-500 rounded transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check size={16} className="text-green-300" />
                        ) : (
                          <Copy size={16} className="text-white" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onConnect}
                  className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition animate-pulse ${isCollapsed ? "justify-center" : ""
                    }`}
                >
                  <Wallet size={18} />
                  {!isCollapsed && <span>Connect Wallet</span>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area Spacer */}
        <div className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`} />
      </div>

      {/* Fiat On-Ramp Modal */}
      <FiatOnRampModal
        isOpen={isFiatModalOpen}
        onClose={() => setIsFiatModalOpen(false)}
      />
    </>
  );
}
