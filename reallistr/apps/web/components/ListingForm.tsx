// reallistr/apps/web/components/ListingForm.tsx
"use client";
import { useState } from "react";

type Listing = {
  id?: number;
  title?: string;
  description?: string;
  suburb?: string;
  lat?: number;
  lng?: number;
  price?: string;
  open_time?: string;
  beds?: number;
  baths?: number;
  cars?: number;
  ev?: boolean;
  solar?: boolean;
  area?: string;
  cover_url?: string;
  agency_name?: string;
  agency_logo_url?: string;
  agents_json?: string;
};

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function ListingForm({ initial }: { initial?: Listing }) {
  const [data, setData] = useState<Listing>({
    title: "",
    lat: -33.8908,
    lng: 151.2743,
    ...initial,
  });
  const [uploading, setUploading] = useState(false);

  const set = (k: keyof Listing, v: any) => setData((d) => ({ ...d, [k]: v }));

  async function onUploadCover(file: File) {
    setUploading(true);
    try {
      const res = await fetch(`${base}/media/sign`, { method: "POST" });
      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "content-type": file.type } });
      set("cover_url", publicUrl);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...data,
      ev: !!data.ev,
      solar: !!data.solar,
    };
    const method = data.id ? "PATCH" : "POST";
    const url = data.id ? `${base}/listings/${data.id}` : `${base}/listings`;
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      window.location.href = "/media";
    } else {
      alert("Save failed");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>Title
          <input value={data.title || ""} onChange={(e) => set("title", e.target.value)} required />
        </label>
        <label>Suburb
          <input value={data.suburb || ""} onChange={(e) => set("suburb", e.target.value)} />
        </label>
        <label>Latitude
          <input type="number" step="any" value={data.lat ?? 0} onChange={(e) => set("lat", parseFloat(e.target.value))} required />
        </label>
        <label>Longitude
          <input type="number" step="any" value={data.lng ?? 0} onChange={(e) => set("lng", parseFloat(e.target.value))} required />
        </label>
        <label>Price (text)
          <input value={data.price || ""} onChange={(e) => set("price", e.target.value)} placeholder="$1.35–$1.45m" />
        </label>
        <label>Open Time
          <input value={data.open_time || ""} onChange={(e) => set("open_time", e.target.value)} placeholder="Sat 11:15–11:45am" />
        </label>
        <label>Beds
          <input type="number" value={data.beds ?? 0} onChange={(e) => set("beds", parseInt(e.target.value || "0"))} />
        </label>
        <label>Baths
          <input type="number" value={data.baths ?? 0} onChange={(e) => set("baths", parseInt(e.target.value || "0"))} />
        </label>
        <label>Cars
          <input type="number" value={data.cars ?? 0} onChange={(e) => set("cars", parseInt(e.target.value || "0"))} />
        </label>
        <label>Area
          <input value={data.area || ""} onChange={(e) => set("area", e.target.value)} placeholder="120 m²" />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={!!data.ev} onChange={(e) => set("ev", e.target.checked)} /> EV charger
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={!!data.solar} onChange={(e) => set("solar", e.target.checked)} /> Solar
        </label>
        <label>Agency name
          <input value={data.agency_name || ""} onChange={(e) => set("agency_name", e.target.value)} />
        </label>
        <label>Agency logo URL
          <input value={data.agency_logo_url || ""} onChange={(e) => set("agency_logo_url", e.target.value)} />
        </label>
      </div>

      <div>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Cover photo</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={data.cover_url || "https://placehold.co/240x150?text=cover"}
            style={{ width: 240, height: 150, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
          <label style={{ display: "inline-block" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUploadCover(e.target.files[0])}
            />
            {uploading ? "Uploading..." : "Choose file"}
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" style={{ padding: "10px 14px", fontWeight: 700 }}>Save</button>
        {data.id ? (
          <a href={`/map?open=${data.id}`} style={{ padding: "10px 14px" }}>Preview on Map →</a>
        ) : null}
      </div>
    </form>
  );
}
