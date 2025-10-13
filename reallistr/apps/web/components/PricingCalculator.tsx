"use client";
import { useMemo, useState } from "react";

type TierKey = "starter" | "pro" | "elite";

type Tier = {
  key: TierKey;
  name: string;
  base: number;        // monthly base (ex-GST)
  minAgents: number;   // inclusive
  maxAgents?: number;  // undefined = no upper cap
  defaultPerAgent: number; // monthly per-agent (ex-GST)
  tagline: string;
};

const TIERS: Record<TierKey, Tier> = {
  starter: { key: "starter", name: "Starter", base: 199, minAgents: 1, maxAgents: 4,  defaultPerAgent: 0,  tagline: "Up to 4 agents" },
  pro:     { key: "pro",     name: "Pro",     base: 449, minAgents: 1, maxAgents: 15, defaultPerAgent: 0,  tagline: "Up to 15 agents" },
  elite:   { key: "elite",   name: "Elite",   base: 699, minAgents: 16,               defaultPerAgent: 10, tagline: "16+ agents" },
};

const GST_RATE = 0.10;

function clamp(n: number, min: number, max?: number) {
  if (max == null) return Math.max(n, min);
  return Math.min(Math.max(n, min), max);
}

export type PricingPayload = {
  tier: TierKey;
  agents: number;
  perAgent: number;

  ads: {
    standardQty: number;
    featureQty: number;
    premierQty: number;
    total: number; // ex-GST
  };

  leads: {
    valuationQty: number; // # of leads
    financeQty: number;
    insuranceQty: number;
    total: number; // ex-GST
  };

  subtotalExGst: number;
  gst: number;
  totalInclGst: number;
};

export default function PricingCalculator({
  onChange,
  onContinue,
}: {
  onChange?: (payload: PricingPayload) => void;
  onContinue?: (payload: PricingPayload) => void;
}) {
  // ----- tier + agents -----
  const [tierKey, setTierKey] = useState<TierKey>("starter");
  const tier = TIERS[tierKey];
  const [agents, setAgents] = useState<number>(tier.minAgents);
  const [perAgent, setPerAgent] = useState<number>(tier.defaultPerAgent);

  function selectTier(next: TierKey) {
    const t = TIERS[next];
    setTierKey(next);
    setAgents((a) => clamp(a, t.minAgents, t.maxAgents));
    if (perAgent === 0 && t.defaultPerAgent !== 0) setPerAgent(t.defaultPerAgent);
  }

  // ----- ad packages (per property) -----
  const [standardQty, setStandardQty] = useState(0); // $599
  const [featureQty, setFeatureQty]   = useState(0); // $1299
  const [premierQty, setPremierQty]   = useState(0); // $2999

  // ----- lead packs (per lead) -----
  // $49 valuation/listing, $95 finance, $69 insurance
  const [valuationQty, setValuationQty] = useState(0);
  const [financeQty, setFinanceQty]     = useState(0);
  const [insuranceQty, setInsuranceQty] = useState(0);

  // helpers
  const money = useMemo(() => {
    const safeAgents = clamp(agents, tier.minAgents, tier.maxAgents);
    const perA = Math.max(0, perAgent);

    // ad packages
    const adsTotal =
      standardQty * 599 +
      featureQty * 1299 +
      premierQty * 2999;

    // lead packs
    const leadsTotal =
      valuationQty * 49 +
      financeQty * 95 +
      insuranceQty * 69;

    const planSubtotal = tier.base + safeAgents * perA;
    const subtotal = planSubtotal + adsTotal + leadsTotal;
    const gst = +(subtotal * GST_RATE).toFixed(2);
    const total = +(subtotal + gst).toFixed(2);

    const payload: PricingPayload = {
      tier: tierKey,
      agents: safeAgents,
      perAgent: perA,
      ads: { standardQty, featureQty, premierQty, total: adsTotal },
      leads: { valuationQty, financeQty, insuranceQty, total: leadsTotal },
      subtotalExGst: subtotal,
      gst,
      totalInclGst: total,
    };
    return payload;
  }, [
    tierKey, tier, agents, perAgent,
    standardQty, featureQty, premierQty,
    valuationQty, financeQty, insuranceQty
  ]);

  // bubble up
  useMemo(() => onChange?.(money), [money, onChange]);

  // small controls
  const Qty = ({
    value, setValue, min = 0, max,
    aria,
  }: {
    value: number;
    setValue: (n: number) => void;
    min?: number;
    max?: number;
    aria: string;
  }) => (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => setValue(clamp(value - 1, min, max))}
        className="h-8 w-8 rounded-lg border"
        aria-label={`decrease ${aria}`}
      >−</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(clamp(parseInt(e.target.value || "0", 10), min, max))}
        className="h-8 w-16 rounded-lg border px-2 text-center"
      />
      <button
        onClick={() => setValue(clamp(value + 1, min, max))}
        className="h-8 w-8 rounded-lg border"
        aria-label={`increase ${aria}`}
      >+</button>
    </div>
  );

  const LeadPreset = ({ n, set }:{ n:number; set:(v:number)=>void }) => (
    <button
      type="button"
      className="rounded-full border px-2.5 py-1 text-xs"
      onClick={() => set(n)}
    >
      {n} leads
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Tiers */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(TIERS) as TierKey[]).map((k) => {
          const t = TIERS[k];
          const selected = tierKey === k;
          return (
            <button
              key={k}
              onClick={() => selectTier(k)}
              className={`w-full rounded-xl border px-4 py-3 text-left
                ${selected ? "border-black bg-black text-white" : "border-gray-300 bg-white"}
              `}
            >
              <div className="flex items-baseline justify-between">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm opacity-80">${t.base}/mo</div>
              </div>
              <div className="mt-1 text-xs opacity-70">{t.tagline}</div>
            </button>
          );
        })}
      </section>

      {/* Agents */}
      <section className="rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium">Agents</label>
            <div className="mt-2">
              <Qty value={money.agents} setValue={setAgents} min={tier.minAgents} max={tier.maxAgents} aria="agents" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {tier.maxAgents ? `Min ${tier.minAgents}, max ${tier.maxAgents}` : `Minimum ${tier.minAgents}, no max`}
            </p>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">
              Price per agent <span className="opacity-60">(ex GST)</span>
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-lg border px-2 h-9 inline-flex items-center">$</span>
              <input
                type="number"
                className="h-9 w-28 rounded-lg border px-2"
                value={perAgent}
                min={0}
                step="1"
                onChange={(e) => setPerAgent(Math.max(0, Number(e.target.value || 0)))}
              />
              <span className="text-sm text-gray-500">/agent/mo</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Elite defaults to ${TIERS.elite.defaultPerAgent}/agent. Edit anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Advertising Packages */}
      <section className="rounded-xl border border-gray-200 p-4">
        <div className="text-sm font-semibold mb-3">Advertising Packages <span className="opacity-60">(per property)</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <div className="font-medium">Standard</div>
            <div className="text-sm opacity-80 mb-2">$599</div>
            <Qty value={standardQty} setValue={setStandardQty} aria="standard packages" />
          </div>
          <div className="rounded-lg border p-3">
            <div className="font-medium">Feature</div>
            <div className="text-sm opacity-80 mb-2">$1299</div>
            <Qty value={featureQty} setValue={setFeatureQty} aria="feature packages" />
          </div>
          <div className="rounded-lg border p-3">
            <div className="font-medium">Premier</div>
            <div className="text-sm opacity-80 mb-2">$2999</div>
            <Qty value={premierQty} setValue={setPremierQty} aria="premier packages" />
          </div>
        </div>
      </section>

      {/* Lead Packs */}
      <section className="rounded-xl border border-gray-200 p-4">
        <div className="text-sm font-semibold mb-3">Lead Packs <span className="opacity-60">(basic)</span></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <div className="font-medium">Valuation &amp; Listing</div>
            <div className="text-sm opacity-80 mb-2">$49/lead</div>
            <Qty value={valuationQty} setValue={setValuationQty} aria="valuation leads" />
            <div className="mt-2 flex gap-2">
              <LeadPreset n={12} set={setValuationQty} />
              <LeadPreset n={28} set={setValuationQty} />
              <LeadPreset n={40} set={setValuationQty} />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="font-medium">Finance (Mortgage)</div>
            <div className="text-sm opacity-80 mb-2">$95/lead</div>
            <Qty value={financeQty} setValue={setFinanceQty} aria="finance leads" />
            <div className="mt-2 flex gap-2">
              <LeadPreset n={12} set={setFinanceQty} />
              <LeadPreset n={28} set={setFinanceQty} />
              <LeadPreset n={40} set={setFinanceQty} />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="font-medium">Insurance</div>
            <div className="text-sm opacity-80 mb-2">$69/lead</div>
            <Qty value={insuranceQty} setValue={setInsuranceQty} aria="insurance leads" />
            <div className="mt-2 flex gap-2">
              <LeadPreset n={12} set={setInsuranceQty} />
              <LeadPreset n={28} set={setInsuranceQty} />
              <LeadPreset n={40} set={setInsuranceQty} />
            </div>
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section className="rounded-xl border border-gray-200 p-4 space-y-1">
        <div className="text-sm font-semibold mb-2">Order Summary</div>

        <div className="text-sm flex justify-between">
          <span>{TIERS[money.tier].name} plan</span>
          <span>${TIERS[money.tier].base.toFixed(2)}/mo</span>
        </div>

        <div className="text-sm flex justify-between">
          <span>Agents × per-agent</span>
          <span>
            {money.agents} × ${money.perAgent.toFixed(2)} = ${(money.agents * money.perAgent).toFixed(2)}/mo
          </span>
        </div>

        {(money.ads.total > 0) && (
          <div className="text-sm flex justify-between">
            <span>Advertising packages</span>
            <span>${money.ads.total.toFixed(2)}/mo</span>
          </div>
        )}

        {(money.leads.total > 0) && (
          <div className="text-sm flex justify-between">
            <span>Lead packs</span>
            <span>${money.leads.total.toFixed(2)}/mo</span>
          </div>
        )}

        <hr className="my-2" />

        <div className="text-sm flex justify-between opacity-80">
          <span>Subtotal (ex GST)</span>
          <span>${money.subtotalExGst.toFixed(2)}</span>
        </div>
        <div className="text-sm flex justify-between opacity-80">
          <span>GST (10%)</span>
          <span>${money.gst.toFixed(2)}</span>
        </div>
        <div className="text-sm flex justify-between font-semibold mt-1">
          <span>Total (incl. GST)</span>
          <span>${money.totalInclGst.toFixed(2)}/mo</span>
        </div>

        <div className="pt-3">
          <button
            className="w-full h-11 rounded-xl bg-black text-white"
            onClick={() => onContinue?.(money)}
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}
