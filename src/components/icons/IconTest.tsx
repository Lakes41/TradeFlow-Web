import React from "react";
import { WalletIcon, CloseIcon, ArrowUpIcon, ChevronDownIcon } from "./index";

export default function IconTest() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Icon Test Component</h1>
      
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <WalletIcon className="w-8 h-8 mb-2" />
          <p className="text-sm">WalletIcon</p>
        </div>
        
        <div className="text-center">
          <CloseIcon className="w-8 h-8 mb-2" />
          <p className="text-sm">CloseIcon</p>
        </div>
        
        <div className="text-center">
          <ArrowUpIcon className="w-8 h-8 mb-2" />
          <p className="text-sm">ArrowUpIcon</p>
        </div>
        
        <div className="text-center">
          <ChevronDownIcon className="w-8 h-8 mb-2" />
          <p className="text-sm">ChevronDownIcon</p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded">
        <p className="text-green-800">✅ All icons are properly exported and can be imported!</p>
        <p className="text-green-600 text-sm mt-2">
          Each icon accepts a className prop for custom styling with Tailwind CSS.
        </p>
      </div>
    </div>
  );
}
