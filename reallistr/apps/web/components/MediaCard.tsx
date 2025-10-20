// reallistr/apps/web/components/MediaCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export type Listing = {
  id: number;
  title: string;
  suburb?: string;
  lat: number;
  lng: number;
  price?: string;
  openTime?: string;
  beds?: number;
  baths?: number;
  cars?: number;
  ev?: boolean;
  solar?: boolean;
  area?: number;
  coverUrl?: string;
  agents?: { avatarUrl: string }[];
  agency?: { name: string; logoUrl?: string };
};

const i = {
  bed:   <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 10h18v8H3z"/><path d="M3 6h6a3 3 0 0 1 3 3v1H3V6z"/></svg>,
  bath:  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 10V7a3 3 0 1 1 6 0v3"/><path d="M3 11h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4z"/></svg>,
  car:   <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 13l2-6h14l2 6H3z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>,
  sun:   <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
  ev:    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M13 2 6 14h5l-1 8 7-12h-5z"/></svg>,
  area:  <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="6" width="18" height="12" rx="2" ry="2"/></svg>,
};

function Token({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 12, fontWeight: 600, color: "#374151", lineHeight: 1
    }}>
      {/* style icons to match RealListr slim look */}
      <span style={{ display: "grid", placeItems: "center" }}>
        {/* wrap to force stroke styling in Safari */}
        <span style={{ width: 16, height: 16, display: "inline-block" }}>
          {/* children will be an SVG */}
        </span>
      </span>
      {children}
      <style jsx>{`
        span :global(svg){width:16px;height:16px;stroke:#6b7280;stroke-width:1.8;fill:none;}
      `}</style>
    </span>
  );
}

export default function MediaCard({ listing }: { listing: Listing }) {
  const r = useRouter();

  const openOnMap = () => {
    // navigate to /map with pin coordinates + id; Map reads these and flies/opens popup
    const q = new URLSearchParams({
      lat: String(listing.lat),
      lng: String(listing.lng),
      open: String(listing.id),
    });
    r.push(`/map?${q.toString()}`);
  };

  return (
    <article
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,.08)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#f1f5f9" }}>
        <Image
          src={listing.coverUrl ??
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop"}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: 14 }}>
        {/* agents + agency */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(listing.agents ?? [
              { avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg" },
              { avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg" },
            ]).slice(0, 2).map((a, idx) => (
              <img key={idx} src={a.avatarUrl} alt="agent"
                   style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #fff",
                            boxShadow: "0 1px 3px rgba(0,0,0,.2)", objectFit: "cover" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            {listing.agency?.logoUrl && (
              <img src={listing.agency.logoUrl} alt="agency" style={{ width: 20, height: 20, borderRadius: 4 }} />
            )}
            {listing.agency?.name ?? "Luxe Realty"}
          </div>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#0b0f1a" }}>{listing.title}</h3>
        <p style={{ margin: "2px 0 8px", fontSize: 13, color: "#6b7280" }}>{listing.suburb ?? "—"}</p>

        {/* slim spec row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          <Token>{i.bed}{listing.beds ?? 2}</Token>
          <Token>{i.bath}{listing.baths ?? 2}</Token>
          <Token>{i.car}{listing.cars ?? 1}</Token>
          <Token>{i.ev}EV</Token>
          <Token>{i.sun}Solar</Token>
          <Token>{i.area}{`${listing.area ?? "m²"}`}</Token>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
            onClick={openOnMap}
            style={{
              appearance: "none",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "8px 12px",
              fontWeight: 700,
              fontSize: 13,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Open on map →
          </button>
        </div>
      </div>
    </article>
  );
}
