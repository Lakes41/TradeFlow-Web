"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Trade', href: '/swap' },
    { name: 'Markets', href: '/markets' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'History', href: '/history' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">TF</div>
            <span className="text-xl font-bold tracking-tight">TradeFlow</span>
          </div>

          {/* Desktop Navigation - Hidden on sm/mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            <ConnectWallet />
          </div>

          {/* Hamburger Icon - Visible only on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white p-2 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-800 z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-slate-300 hover:text-white text-lg font-medium py-2 border-b border-slate-800/50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;