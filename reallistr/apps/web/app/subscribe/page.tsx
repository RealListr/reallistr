"use client";

import PricingCalculator from "@/components/PricingCalculator";

export default function SubscribePage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Pick a subscription, then upload your agents
      </h1>
      <p className="text-base text-gray-600 mt-2">
        Keep it simple. We’ll wire payments after this MVP works. Selectors are saved with the order; pricing shown is ex-GST. Total shows GST added.
      </p>

      <div className="mt-8">
        <PricingCalculator />
      </div>
    </main>
  );
}
