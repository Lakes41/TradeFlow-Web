import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ToasterProvider from "../components/general/ToasterProvider";
import { SlippageProvider } from "../contexts/SlippageContext";
import { NetworkCongestionProvider } from "../contexts/NetworkCongestionContext";
import Footer from "../components/layout/Footer";
import NetworkCongestionBanner from "../components/NetworkCongestionBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import PageTransition from "../components/PageTransition";

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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <NetworkCongestionProvider>
            <SlippageProvider>
              <ToasterProvider />
              {/* <Toaster position="top-right" richColors closeButton /> */}
              <NetworkCongestionBanner />
              <PageTransition>
                {children}
              </PageTransition>
              <Footer />
            </SlippageProvider>
          </NetworkCongestionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}