import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ToasterProvider from "../components/general/ToasterProvider";
import { SlippageProvider } from "../contexts/SlippageContext";
import { NetworkCongestionProvider } from "../contexts/NetworkCongestionContext";
import { BackendHealthProvider } from "../contexts/BackendHealthContext";
import Footer from "../components/layout/Footer";
import NetworkCongestionBanner from "../components/NetworkCongestionBanner";
import DegradedPerformanceBanner from "../components/DegradedPerformanceBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import PageTransition from "../components/PageTransition";
import QueryProvider from "../providers/QueryClientProvider";
import { SettingsProvider } from "../lib/context/SettingsContext";
import NetworkGuard from "../components/general/NetworkGuard";
import SignatureOverlay from "../components/SignatureOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "TradeFlow",
  description: "TradeFlow RWA Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <SettingsProvider>
            <NetworkCongestionProvider>
              <SlippageProvider>
                <QueryProvider>
                  <NetworkGuard>
                    <ToasterProvider />
                    <NetworkCongestionBanner />
                    <PageTransition>
                      {children}
                    </PageTransition>
                    <SignatureOverlay />
                    <Footer />
                  </NetworkGuard>
                </QueryProvider>
              </SlippageProvider>
            </NetworkCongestionProvider>
          </SettingsProvider>
        </ErrorBoundary>
        <html lang="en" className={inter.variable}>
          <body className="font-sans">
            <SettingsProvider>
              <NetworkGuard>
                {children}
                <ToasterProvider />
              </NetworkGuard>
            </SettingsProvider>
          </body>
        </html>
        );
      </body>
    </html>
  );
}