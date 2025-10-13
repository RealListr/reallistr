"use client";
import { useMemo, useState } from "react";

type TierKey = "starter" | "pro" | "elite";
type BusinessType = "Real Estate" | "Commercial" | "Finance Organization" | "Insurance Business";
type Market = "Domestic" | "International";

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
  businessType: BusinessType;
  market: Market;

  tier: TierKey;
  agents: number;
  perAgent: number;

  // upload names only (MVP)
  agentsFileName?: string;
  mediaZipName?: string;

  ads: { standardQty: number; featureQty: number; premierQty: number; total: number };
  leads: { valuationQty: number; financeQty: number; insuranceQty: number; total: number };

  subtotalExGst: number;
  gst: number;
  totalInclGst: number;
};

export default function PricingCalculator({
  onChange,
  onContinue,
  showMedia = true,
}: {
  onChange?: (payload: PricingPayload) => void;
  onContinue?: (payload: PricingPayload) => void;
  showMedia?: boolean;
}) {
  // Business + Market
  const [businessType, setBusinessType] = useState<BusinessType>("Real Estate");
  const [market, setMarket] = useState<Market>("Domestic");

  // Tier + Agents
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

  // Ads
  const [standardQty, setStandardQty] = useState(0); // $599
  const [featureQty, setFeatureQty]   = useState(0); // $1299
  const [premierQty, setPremierQty]   = useState(0); // $2999

  // Leads
  const [valuationQty, setValuationQty] = useState(0); // $49
  const [financeQty, setFinanceQty]     = useState(0); // $95
  const [insuranceQty, setInsuranceQty] = useState(0); // $69

  // Agents media (MVP: just capture filenames)
  const [agentsFileName, setAgentsFileName] = useState<string | undefined>();
  const [mediaZipName, setMediaZipName] = useState<string | undefined>();

  const money = useMemo(() => {
    const safeAgents = clamp(agents, tier.minAgents, tier.maxAgents);
    const perA = Math.max(0, perAgent);

    const adsTotal = standardQty * 599 + featureQty * 1299 + premierQty * 2999;
    const leadsTotal = valuationQty * 49 + financeQty * 95 + insuranceQty * 69;

    const planSubtotal = tier.base + safeAgents * perA;
    const subtotal = planSubtotal + adsTotal + leadsTotal;
    const gst = +(subtotal * GST_RATE).toFixed(2);
    const total = +(subtotal + gst).toFixed(2);

    const payload: PricingPayload = {
      businessType,
      market,
      tier: tierKey,
      agents: safeAgents,
      perAgent: perA,
      agentsFileName,
      mediaZipName,
      ads: { standardQty, featureQty, premierQty, total: adsTotal },
      leads: { valuationQty, financeQty, insuranceQty, total: leadsTotal },
      subtotalExGst: subtotal,
      gst,
      totalInclGst: total,
    };
    return payload;
  }, [
    businessType, market,
    tierKey, tier, agents, perAgent,
    standardQty, featureQty, premierQty,
    valuationQty, financeQty, insuranceQty,
    agentsFileName, mediaZipName
  ]);

  // notify parent
  useMemo(() => onChange?.(money), [money, onChange]);

  // small controls
  const Qty = ({
    value, setValue, min = 0, max, aria,
  }: { value: number; setValue: (n: number) => void; min?: number; max?: number; aria: string; }) => (
    <div className="inline-flex items-center gap-3">
      <button onClick={() => setValue(clamp(value - 1, min, max))} className="h-11 w-11 rounded-xl border border-gray-300 text-lg" aria-label={`decrease ${aria}`}>−</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(clamp(parseInt(e.target.value || "0", 10), min, max))}
        className="h-11 w-24 rounded-xl border border-gray-300 px-3 text-center text-lg"
      />
      <button onClick={() => setValue(clamp(value + 1, min, max))} className="h-11 w-11 rounded-xl border border-gray-300 text-lg" aria-label={`increase ${aria}`}>+</button>
    </div>
  );

  const Card: React.FC<React.PropsWithChildren<{className?: string; title?: string; subtitle?: string;}>> = ({ className="", title, subtitle, children }) => (
    <div className={`rounded-2xl border border-gray-200 shadow-sm p-5 bg-white ${className}`}>
      {title && <div className="text-base font-semibold">{title}</div>}
      {subtitle && <div className="text-sm text-gray-600 mt-0.5">{subtitle}</div>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </div>
  );

  const LeadPreset = ({ n, set }:{ n:number; set:(v:number)=>void }) => (
    <button type="button" className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => set(n)}>
      {n} leads
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Business + Market + Tiers (compact) */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="block font-medium mb-1">Business type</span>
                <select
                  className="w-full h-11 rounded-xl border border-gray-300 px-3"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                >
                  <option>Real Estate</option>
                  <option>Commercial</option>
                  <option>Finance Organization</option>
                  <option>Insurance Business</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block font-medium mb-1">Market</span>
                <select
                  className="w-full h-11 rounded-xl border border-gray-300 px-3"
                  value={market}
                  onChange={(e) => setMarket(e.target.value as Market)}
                >
                  <option>Domestic</option>
                  <option>International</option>
                </select>
              </label>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TIERS) as TierKey[]).map((k) => {
                const t = TIERS[k];
                const selected = tierKey === k;
                return (
                  <button
                    key={k}
                    onClick={() => selectTier(k)}
                    className={`rounded-xl border px-3 py-2 text-left shadow-sm transition
                      ${selected ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs opacity-90">${t.base}/mo</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Agents */}
      <Card
        title="Agents"
        subtitle={
          tier.maxAgents
            ? `Min ${tier.minAgents}, max ${tier.maxAgents} • ${tier.name} plan`
            : `Minimum ${tier.minAgents}, no max • ${tier.name} plan`
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium mb-2">Agent count</div>
            <Qty value={agents} setValue={setAgents} min={tier.minAgents} max={tier.maxAgents} aria="agents" />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Price per agent <span className="text-gray-500">(ex GST)</span></div>
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-gray-300 px-3 h-11 inline-flex items-center text-lg">$</span>
              <input
                type="number"
                className="h-11 w-32 rounded-xl border border-gray-300 px-3 text-lg"
                value={perAgent}
                min={0}
                step="1"
                onChange={(e) => setPerAgent(Math.max(0, Number(e.target.value || 0)))}
              />
              <span className="text-sm text-gray-600">/agent/mo</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Elite defaults to ${TIERS.elite.defaultPerAgent}/agent. Edit anytime.</p>
          </div>
        </div>
      </Card>

      {/* Advertising Packages */}
      <Card title="Advertising Packages" subtitle="Per property">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-none border-gray-200" title="Standard" subtitle="$599">
            <Qty value={standardQty} setValue={setStandardQty} aria="standard packages" />
          </Card>
          <Card className="shadow-none border-gray-200" title="Feature" subtitle="$1299">
            <Qty value={featureQty} setValue={setFeatureQty} aria="feature packages" />
          </Card>
          <Card className="shadow-none border-gray-200" title="Premier" subtitle="$2999">
            <Qty value={premierQty} setValue={setPremierQty} aria="premier packages" />
          </Card>
        </div>
      </Card>

      {/* Lead Packs */}
      <Card title="Lead Packs" subtitle="Basic">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-none border-gray-200" title="Valuation & Listing" subtitle="$49/lead">
            <Qty value={valuationQty} setValue={setValuationQty} aria="valuation leads" />
            <div className="mt-3 flex gap-2 flex-wrap">
              <LeadPreset n={12} set={setValuationQty} />
              <LeadPreset n={28} set={setValuationQty} />
              <LeadPreset n={40} set={setValuationQty} />
            </div>
          </Card>

          <Card className="shadow-none border-gray-200" title="Finance (Mortgage)" subtitle="$95/lead">
            <Qty value={financeQty} setValue={setFinanceQty} aria="finance leads" />
            <div className="mt-3 flex gap-2 flex-wrap">
              <LeadPreset n={12} set={setFinanceQty} />
              <LeadPreset n={28} set={setFinanceQty} />
              <LeadPreset n={40} set={setFinanceQty} />
            </div>
          </Card>

          <Card className="shadow-none border-gray-200" title="Insurance" subtitle="$69/lead">
            <Qty value={insuranceQty} setValue={setInsuranceQty} aria="insurance leads" />
            <div className="mt-3 flex gap-2 flex-wrap">
              <LeadPreset n={12} set={setInsuranceQty} />
              <LeadPreset n={28} set={setInsuranceQty} />
              <LeadPreset n={40} set={setInsuranceQty} />
            </div>
          </Card>
        </div>
      </Card>

      {/* Agents media (optional) */}
      {showMedia && (
      <Card title="Agents media" subtitle="Upload agents list and optional media ZIP">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block font-medium mb-1">Agents file (.csv / .xlsx)</span>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="block w-full rounded-xl border border-gray-300 p-2"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setAgentsFileName(f ? f.name : undefined);
              }}
            />
            {agentsFileName && <div className="mt-1 text-xs text-gray-600">Selected: {agentsFileName}</div>}
          </label>

          <label className="text-sm">
            <span className="block font-medium mb-1">Media ZIP (optional)</span>
            <input
              type="file"
              accept=".zip"
              className="block w-full rounded-xl border border-gray-300 p-2"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setMediaZipName(f ? f.name : undefined);
              }}
            />
            {mediaZipName && <div className="mt-1 text-xs text-gray-600">Selected: {mediaZipName}</div>}
          </label>
        </div>
      </Card>
      )}

      {/* Order Summary */}
      <Card title="Order Summary">
        <div className="space-y-2 text-base">
          <div className="flex justify-between text-gray-700">
            <span>Business / Market</span>
            <span>{businessType} • {market}</span>
          </div>

          <div className="flex justify-between">
            <span>{TIERS[tierKey].name} plan</span>
            <span>${TIERS[tierKey].base.toFixed(2)}/mo</span>
          </div>

          <div className="flex justify-between">
            <span>Agents × per-agent</span>
            <span>{money.agents} × ${money.perAgent.toFixed(2)} = {(money.agents * money.perAgent).toFixed(2)}/mo</span>
          </div>

          {money.ads.total > 0 && (
            <div className="flex justify-between">
              <span>Advertising packages</span>
              <span>${money.ads.total.toFixed(2)}/mo</span>
            </div>
          )}

          {money.leads.total > 0 && (
            <div className="flex justify-between">
              <span>Lead packs</span>
              <span>${money.leads.total.toFixed(2)}/mo</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between text-gray-700">
            <span>Subtotal (ex GST)</span>
            <span>${money.subtotalExGst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>GST (10%)</span>
            <span>${money.gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total (incl. GST)</span>
            <span>${money.totalInclGst.toFixed(2)}/mo</span>
          </div>

          <button className="w-full h-12 rounded-2xl bg-black text-white mt-4 text-base" onClick={() => onContinue?.(money)}>
            Continue
          </button>
        </div>
      </Card>
    </div>
  );
}
