import PricingCalculator, { PricingPayload } from "@/components/PricingCalculator";

export default function SubscribePage() {
  function handleChange(v: PricingPayload) {
    // Optional: sync into a store or preview /api/debug
  }

  async function handleContinue(v: PricingPayload) {
    // Example post:
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(v),
    // });
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Pick a subscription, then upload your agents</h1>
      <p className="text-sm text-gray-600 mt-1">
        Keep it simple. We’ll wire payments after this MVP works. Selectors are saved with the order; pricing shown is ex-GST. Total shows GST added.
      </p>

      <div className="mt-6">
        <PricingCalculator onChange={handleChange} onContinue={handleContinue} />
      </div>
    </main>
  );
}
