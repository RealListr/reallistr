"use client";
import { useMemo, useState } from "react";

type SaleMode =
  | "price"
  | "contactAgent"
  | "discussion"
  | "negotiationOpen"
  | "priceUnderReview"
  | "eoi"
  | "twoSectionPrice"
  | "auctionPending"
  | "auction";

type InspectType = "scheduled" | "online" | "onSite" | "virtual" | "private";

export default function PropertyDetailsPage() {
  // Sale mode
  const [mode, setMode] = useState<SaleMode>("contactAgent");
  const [price, setPrice] = useState<string>("");
  const [low, setLow] = useState<string>("");
  const [high, setHigh] = useState<string>("");
  const [eoiDate, setEoiDate] = useState<string>("");
  const [auctionDate, setAuctionDate] = useState<string>("");

  // Inspections
  const [inspects, setInspects] = useState<Array<{ type: InspectType; when?: string; url?: string }>>([]);

  function addInspect(t: InspectType) {
    setInspects((prev) => [...prev, { type: t }]);
  }
  function updateInspect(i: number, patch: Partial<{ when: string; url: string; type: InspectType }>) {
    setInspects((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function removeInspect(i: number) {
    setInspects((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Agent Insights (optional)
  const [agentQuote, setAgentQuote] = useState("");
  const [neighbour, setNeighbour] = useState("");
  const [hidden, setHidden] = useState("");
  const [upgrade, setUpgrade] = useState("");
  const [forecast, setForecast] = useState("");

  const summary = useMemo(() => {
    return {
      mode,
      price,
      range: low && high ? `${low} – ${high}` : "",
      eoiDate,
      auctionDate,
      inspects,
      insights: { agentQuote, neighbour, hidden, upgrade, forecast },
    };
  }, [mode, price, low, high, eoiDate, auctionDate, inspects, agentQuote, neighbour, hidden, upgrade, forecast]);

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Property details</h1>
        <p className="text-sm text-gray-600 mt-1">Keep it simple — dropdowns with only the fields that matter.</p>
      </div>

      {/* Sale mode */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-base font-semibold">Price / sale mode</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm md:col-span-1">
            <span className="block font-medium mb-1">Mode</span>
            <select className="h-11 w-full rounded-xl border border-gray-300 px-3" value={mode} onChange={(e)=>setMode(e.target.value as SaleMode)}>
              <option value="price">Property Price</option>
              <option value="contactAgent">Contact Agent</option>
              <option value="discussion">By Discussion</option>
              <option value="negotiationOpen">Negotiation Open</option>
              <option value="priceUnderReview">Price Under Review</option>
              <option value="eoi">Expression of Interest by</option>
              <option value="twoSectionPrice">Two Section Price</option>
              <option value="auctionPending">Auction Pending</option>
              <option value="auction">Auction</option>
            </select>
          </label>

          {/* Conditional fields */}
          {mode === "price" && (
            <label className="text-sm md:col-span-2">
              <span className="block font-medium mb-1">Amount</span>
              <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="$1,200,000" className="h-11 w-full rounded-xl border border-gray-300 px-3" />
            </label>
          )}

          {mode === "twoSectionPrice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
              <label className="text-sm">
                <span className="block font-medium mb-1">Low</span>
                <input value={low} onChange={(e)=>setLow(e.target.value)} placeholder="$1,200,000" className="h-11 w-full rounded-xl border border-gray-300 px-3" />
              </label>
              <label className="text-sm">
                <span className="block font-medium mb-1">High</span>
                <input value={high} onChange={(e)=>setHigh(e.target.value)} placeholder="$1,300,000" className="h-11 w-full rounded-xl border border-gray-300 px-3" />
              </label>
            </div>
          )}

          {mode === "eoi" && (
            <label className="text-sm md:col-span-2">
              <span className="block font-medium mb-1">EOI closes</span>
              <input type="date" value={eoiDate} onChange={(e)=>setEoiDate(e.target.value)} className="h-11 w-full rounded-xl border border-gray-300 px-3" />
            </label>
          )}

          {(mode === "auction" || mode === "auctionPending") && (
            <label className="text-sm md:col-span-2">
              <span className="block font-medium mb-1">Auction date/time</span>
              <input type="datetime-local" value={auctionDate} onChange={(e)=>setAuctionDate(e.target.value)} className="h-11 w-full rounded-xl border border-gray-300 px-3" />
            </label>
          )}
        </div>
      </section>

      {/* Open for Inspection */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-base font-semibold">Open for Inspection</div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={()=>addInspect("scheduled")} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">Add Open (date/time)</button>
          <button onClick={()=>addInspect("online")}    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">Open online</button>
          <button onClick={()=>addInspect("onSite")}    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">On-Site Inspection</button>
          <button onClick={()=>addInspect("virtual")}   className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">Virtual tour available</button>
          <button onClick={()=>addInspect("private")}   className="rounded-full border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">Private viewing</button>
        </div>

        <div className="mt-3 space-y-3">
          {inspects.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-gray-200 p-3">
              <div className="text-xs text-gray-600">#{i+1} {row.type}</div>

              {row.type === "scheduled" && (
                <label className="text-sm md:col-span-2">
                  <span className="block font-medium mb-1">When</span>
                  <input type="datetime-local" value={row.when || ""} onChange={(e)=>updateInspect(i,{when:e.target.value})} className="h-11 w-full rounded-xl border border-gray-300 px-3" />
                </label>
              )}

              {row.type === "virtual" && (
                <label className="text-sm md:col-span-2">
                  <span className="block font-medium mb-1">Virtual tour link</span>
                  <input type="url" value={row.url || ""} onChange={(e)=>updateInspect(i,{url:e.target.value})} placeholder="https://…" className="h-11 w-full rounded-xl border border-gray-300 px-3" />
                </label>
              )}

              {row.type === "online" && (
                <div className="md:col-span-2 text-sm text-gray-700">Open online — no time required.</div>
              )}
              {row.type === "onSite" && (
                <div className="md:col-span-2 text-sm text-gray-700">On-site inspection — details provided to qualified leads.</div>
              )}
              {row.type === "private" && (
                <div className="md:col-span-2 text-sm text-gray-700">Private viewing by appointment.</div>
              )}

              <div className="md:col-span-3">
                <button onClick={()=>removeInspect(i)} className="text-xs rounded-full border border-gray-300 px-2 py-1 hover:bg-gray-50">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Insights (optional) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-base font-semibold">Discover More (optional)</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block font-medium mb-1">Agent quote</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" maxLength={200} value={agentQuote} onChange={(e)=>setAgentQuote(e.target.value)} placeholder="“The owner has kept this home immaculate since day one.”" />
          </label>
          <label className="text-sm">
            <span className="block font-medium mb-1">Neighbourhood insight</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" maxLength={200} value={neighbour} onChange={(e)=>setNeighbour(e.target.value)} placeholder="“Local café culture booming – 3 new venues opened nearby.”" />
          </label>
          <label className="text-sm">
            <span className="block font-medium mb-1">Hidden highlight</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" maxLength={200} value={hidden} onChange={(e)=>setHidden(e.target.value)} placeholder="“Sunset views from the master balcony.”" />
          </label>
          <label className="text-sm">
            <span className="block font-medium mb-1">Upgrade notes</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" maxLength={200} value={upgrade} onChange={(e)=>setUpgrade(e.target.value)} placeholder="“New kitchen appliances installed June 2025.”" />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block font-medium mb-1">Investment forecast</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" maxLength={200} value={forecast} onChange={(e)=>setForecast(e.target.value)} placeholder="“Rental appraisal: $950–$1,050/week.”" />
          </label>
        </div>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-base font-semibold">Property summary</div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-gray-200 p-3 flex items-center justify-between">
            <span className="text-gray-600">Sale mode</span>
            <span className="font-medium">
              {mode === "price" ? (summary.price || "—")
                : mode === "twoSectionPrice" ? (summary.range || "—")
                : mode === "eoi" ? (summary.eoiDate || "—")
                : mode === "auction" || mode === "auctionPending" ? (summary.auctionDate || "—")
                : mode.replace(/([A-Z])/g," $1")}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 flex items-center justify-between">
            <span className="text-gray-600">Next open</span>
            <span className="font-medium">
              {summary.inspects.find(i=>i.type==="scheduled")?.when || "—"}
            </span>
          </div>
          {Object.entries(summary.insights).map(([k,v])=> v ? (
            <div key={k} className="md:col-span-2 rounded-xl border border-gray-200 p-3">
              <div className="text-xs uppercase text-gray-500">{k.replace(/([A-Z])/g," $1")}</div>
              <div className="font-medium">{v}</div>
            </div>
          ) : null)}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-600">You can refine these later before publishing.</div>
          <button className="h-11 px-5 rounded-2xl bg-black text-white" onClick={()=>alert("MVP: details saved")}>Save details</button>
        </div>
      </section>
    </main>
  );
}
