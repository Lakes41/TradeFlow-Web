"use client";

import React from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import Icon from "../components/ui/Icon";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-blue-400 mb-2">404</h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">This pool doesn&apos;t exist</h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            The trading pool or page you&apos;re looking for seems to have vanished into the void. 
            Let&apos;s get you back to the dashboard where the action is.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full transition-colors text-white font-medium"
          >
            <Icon icon={Home} />
            Back to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-3 rounded-full transition-colors text-white font-medium"
          >
            <Icon icon={Search} />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-16 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-medium mb-3 text-blue-400">Looking for something specific?</h3>
          <ul className="text-slate-400 space-y-2 text-sm">
            <li>• Check the URL for typos</li>
            <li>• Browse our active trading pools</li>
            <li>• Visit the documentation for guidance</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}
