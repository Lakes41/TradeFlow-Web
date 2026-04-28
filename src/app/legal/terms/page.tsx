"use client";

import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/layout/Footer";

/**
 * Static page for Terms of Service and Risk Disclaimers.
 * Optimized for readability with a narrow container.
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white flex flex-col font-sans">
      <Navbar onConnect={() => {}} address="" />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="border-b border-slate-700 pb-8">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Legal & Terms
            </h1>
            <p className="text-slate-400">
              Please read our Terms and Disclaimers carefully before using
              TradeFlow.
            </p>
          </div>

          {/* Terms of Service Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400 tracking-tight">
              Terms of Service
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed text-lg">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                nec efficitur justo. In hac habitasse platea dictumst.
                Vestibulum condimentum elit quis sapien finibus, sed interdum
                eros luctus. Donec tristique lacus at nunc convallis, eu aliquet
                sem iaculis. Nunc viverra dolor quis sem luctus, a venenatis dui
                blandit. Etiam cursus velit quis sapien tristique viverra.
              </p>
              <p>
                Maecenas interdum, libero at tempor facilisis, nisl purus
                vehicula sem, vel porta dui ante quis felis. Sed pretium neque
                sed varius mattis. Cras vitae diam eros. Pellentesque hendrerit
                tincidunt efficitur. Mauris facilisis nisi vitae ipsum interdum
                porta. Vestibulum auctor magna sit amet nibh convallis
                hendrerit.
              </p>
              <p>
                Nam interdum leo ac sapien condimentum, nec imperdiet justo
                lacinia. Pellentesque sodales diam ac ex consequat, a elementum
                ipsum pulvinar. Proin non sem ligula. Praesent vitae lorem sit
                amet turpis accumsan convallis. Sed a urna lorem. Curabitur sed
                massa sit amet nisl vestibulum placerat. Nullam id tellus
                lacinia, tincidunt neque ac, scelerisque leo.
              </p>
              <p>
                Nullam suscipit porta tellus non congue. Nunc non elementum
                justo. Suspendisse pulvinar erat a sapien hendrerit, id
                convallis lacus suscipit. Vivamus interdum, velit eget auctor
                molestie, sem magna molestie purus, at ullamcorper nunc ex quis
                odio. Sed sed nisl neque.
              </p>
            </div>
          </section>

          {/* Risk Disclaimers Section */}
          <section className="space-y-6 bg-slate-800/40 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-orange-400 tracking-tight">
              Risk Disclaimers
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">
                Disclaimer: Trading and investing in digital assets involve
                substantial risk of loss and are not suitable for every
                investor.
              </p>
              <p>
                The user acknowledges that the use of TradeFlow is at their own
                risk. The information provided does not constitute legal, tax,
                or financial advice. TradeFlow shall not be held liable for any
                decisions made based on the information provided on the
                platform.
              </p>
              <p>
                Asset prices are volatile and can fluctuate significantly in
                very short periods. You should not invest money that you cannot
                afford to lose. Please consult with a qualified professional
                before making any financial decisions.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Inconsequential change for repo health
