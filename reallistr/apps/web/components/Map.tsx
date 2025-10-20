"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoicmVhbGxpc3RyMjAyNSIsImEiOiJjbWZ1c2FkeGUwMDBuMmxxMnJ2aXd5MGpiIn0.pCkpOsVfkI5yKSogiCstnQ";

type Listing = {
  id: number;
  title: string;
  description?: string;
  suburb?: string;
  lat: number;
  lng: number;
  price?: string;
  open_time?: string;
  beds?: number;
  baths?: number;
  cars?: number;
  ev?: number;          // 0/1
  solar?: number;       // 0/1
  area?: string;
  cover_url?: string;
  agency_name?: string;
  agency_logo_url?: string;
  agents_json?: string; // JSON string of [{avatarUrl:string}]
  floor_level?: number;
  floor_height_m?: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function MapView() {
  const holder = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!holder.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: holder.current,
      // standard style supports photorealistic 3D
      style: "mapbox://styles/mapbox/standard",
      center: [151.2743, -33.8908],
      zoom: 12.5,
      pitch: 45,
      bearing: -12,
      attributionControl: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current = map;

    injectPopupCSS();

    (async () => {
      const res = await fetch(`${API_BASE}/listings`);
      const listings: Listing[] = await res.json();

      for (const l of listings) {
        const id = String(l.id);
        const lngLat: [number, number] = [l.lng, l.lat];
        const level = l.floor_level ?? 1;
        const floorH = l.floor_height_m ?? 3.2;

        const popup = new mapboxgl.Popup({ offset: 16, closeButton: true })
          .setHTML(cardHTML(l));

        // Add/remove the 3D overlays with the popup lifecycle
        popup.on("open", () => {
          upsertFloorBand(map, id, lngLat, level, floorH);
          upsertFloorPin(map, id, lngLat, level, floorH);
          map.flyTo({ center: lngLat, zoom: 16.2, pitch: 60, bearing: -20, duration: 900 });
        });
        popup.on("close", () => removeFloorLayers(map, id));

        new mapboxgl.Marker().setLngLat(lngLat).setPopup(popup).addTo(map);
      }
    })().catch(console.error);

    return () => {
      try { map.remove(); } catch {}
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={holder}
      style={{ width: "100%", height: "70vh", borderRadius: 16, overflow: "hidden" }}
    />
  );
}

/* ------------------------- floor pin helpers ------------------------- */
// Build a tiny square polygon (in degrees) centered on a point
function squareAround([lng, lat]: [number, number], meters = 2) {
  const dLng = meters / (111320 * Math.cos((lat * Math.PI) / 180));
  const dLat = meters / 110540;
  return [[
    [lng - dLng, lat - dLat],
    [lng + dLng, lat - dLat],
    [lng + dLng, lat + dLat],
    [lng - dLng, lat + dLat],
    [lng - dLng, lat - dLat],
  ]];
}

function upsertFloorPin(map: Map, id: string, lngLat: [number, number], level = 1, floorH = 3.2) {
  const base = (Number(level) || 1) * (Number(floorH) || 3.2);
  const height = base + 2; // 2m tall pin
  const srcId = `rl-unit-pin-${id}`;
  const layerId = `rl-unit-pin-layer-${id}`;

  const data = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { base, height },
      geometry: { type: "Polygon", coordinates: squareAround(lngLat, 1.6) }
    }]
  } as GeoJSON.FeatureCollection;

  if (map.getSource(srcId)) (map.getSource(srcId) as mapboxgl.GeoJSONSource).setData(data);
  else {
    map.addSource(srcId, { type: "geojson", data });
    map.addLayer({
      id: layerId,
      type: "fill-extrusion",
      source: srcId,
      paint: {
        "fill-extrusion-base": ["get", "base"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.95,
      },
    });
  }
}

function upsertFloorBand(map: Map, id: string, lngLat: [number, number], level = 1, floorH = 3.2) {
  const base = (Number(level) - 1) * (Number(floorH) || 3.2);
  const height = base + (Number(floorH) || 3.2);
  const srcId = `rl-floor-band-${id}`;
  const layerId = `rl-floor-band-layer-${id}`;

  const data = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { base, height },
      geometry: { type: "Polygon", coordinates: squareAround(lngLat, 5) }
    }]
  } as GeoJSON.FeatureCollection;

  if (map.getSource(srcId)) (map.getSource(srcId) as mapboxgl.GeoJSONSource).setData(data);
  else {
    map.addSource(srcId, { type: "geojson", data });
    map.addLayer({
      id: layerId,
      type: "fill-extrusion",
      source: srcId,
      paint: {
        "fill-extrusion-base": ["get", "base"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.25,
      },
    });
  }
}

function removeFloorLayers(map: Map, id: string) {
  const layers = [`rl-unit-pin-layer-${id}`, `rl-floor-band-layer-${id}`];
  const sources = [`rl-unit-pin-${id}`, `rl-floor-band-${id}`];
  layers.forEach((l) => { if (map.getLayer(l)) map.removeLayer(l); });
  sources.forEach((s) => { if (map.getSource(s)) map.removeSource(s); });
}

/* ------------------------- popup card HTML -------------------------- */
function cardHTML(l: Listing) {
  const agents: { avatarUrl: string }[] = safeParseArray(l.agents_json);
  const cover =
    l.cover_url ||
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop";

  return `
  <div class="rl-card">
    <div class="rl-top">
      <div class="rl-agents">
        ${agents.slice(0, 2).map(a => `<div class="rl-ava"><img src="${a.avatarUrl}"/></div>`).join("")}
      </div>
      <div class="rl-agency">
        ${l.agency_logo_url ? `<img src="${l.agency_logo_url}" />` : ""}
        ${l.agency_name ?? ""}
      </div>
    </div>

    <div class="rl-hero">
      <img src="${cover}" alt="cover"/>
      <div class="rl-badge">87%</div>
      ${l.price ? `<div class="rl-pill rl-price">${l.price}</div>` : ""}
      ${l.open_time ? `<div class="rl-pill rl-time">${l.open_time}</div>` : ""}
      <div class="rl-icons">
        <button class="rl-ico" aria-label="Like">${icons.heart}</button>
        <button class="rl-ico" aria-label="Info">${icons.info}</button>
        <button class="rl-ico" aria-label="Share">${icons.share}</button>
        <button class="rl-ico" aria-label="Directions">${icons.send}</button>
      </div>
    </div>

    <div class="rl-body">
      <div class="rl-title">${escapeHTML(l.title || "Listing")}</div>
      <div class="rl-sub">${escapeHTML(l.suburb || "")}</div>
      <div class="rl-specs">
        ${numChip(icons.bed, l.beds)}
        ${numChip(icons.bath, l.baths)}
        ${numChip(icons.car, l.cars)}
        ${flagChip(icons.ev, !!l.ev, "EV")}
        ${flagChip(icons.sun, !!l.solar, "Solar")}
        ${textChip(icons.area, l.area)}
      </div>
    </div>
  </div>`;
}

function safeParseArray(json?: string) {
  try { const v = JSON.parse(json ?? "[]"); return Array.isArray(v) ? v : []; }
  catch { return []; }
}
function escapeHTML(s: string) {
  return s.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}
function numChip(svg: string, n?: number) {
  if (n == null) return "";
  return `<div class="rl-chip">${svg}${n}</div>`;
}
function flagChip(svg: string, on: boolean, label?: string) {
  if (!on) return "";
  return `<div class="rl-chip">${svg}${label ? `&nbsp;${label}` : ""}</div>`;
}
function textChip(svg: string, text?: string) {
  if (!text) return "";
  return `<div class="rl-chip">${svg}${escapeHTML(text)}</div>`;
}

/* -------------------------- icons + CSS ----------------------------- */
const icons = {
  heart: `<svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.33-7.67C.75 10.62 2.05 7 5.2 6.5A4.6 4.6 0 0 1 12 9a4.6 4.6 0 0 1 6.8-2.5c3.15.5 4.45 4.12 2.53 6.83C18.7 16.65 12 21 12 21z"/></svg>`,
  info:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>`,
  share: `<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.4 13.2 15.6 17M15.6 7 8.4 10.8"/></svg>`,
  send:  `<svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  bed:   `<svg viewBox="0 0 24 24"><path d="M3 10h18v8H3z"/><path d="M3 6h6a3 3 0 0 1 3 3v1H3V6z"/></svg>`,
  bath:  `<svg viewBox="0 0 24 24"><path d="M7 10V7a3 3 0 1 1 6 0v3"/><path d="M3 11h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-4z"/></svg>`,
  car:   `<svg viewBox="0 0 24 24"><path d="M3 13l2-6h14l2 6H3z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>`,
  sun:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
  ev:    `<svg viewBox="0 0 24 24"><path d="M13 2 6 14h5l-1 8 7-12h-5z"/></svg>`,
  area:  `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" ry="2"/></svg>`,
};

function injectPopupCSS() {
  const id = "rl-map-popup-slim-v4";
  if (document.getElementById(id)) return;
  const css = `
    :root { --rl-white:#fff; --rl-ink:#0b0f1a; --rl-muted:#64748b; --rl-chip:#f1f5f9; }
    .rl-card{ width:340px; border-radius:18px; background:#fff; box-shadow:0 8px 24px rgba(0,0,0,.18); overflow:hidden;
      font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; }
    .rl-top{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px 6px; }
    .rl-agents{ display:flex; align-items:center; gap:6px; }
    .rl-ava{ width:26px; height:26px; border-radius:50%; overflow:hidden; border:1px solid #fff; box-shadow:0 1px 3px rgba(0,0,0,.2); }
    .rl-ava img{ width:100%; height:100%; object-fit:cover; }
    .rl-agency{ display:flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--rl-muted); }
    .rl-agency img{ width:22px; height:22px; border-radius:4px; object-fit:cover; }
    .rl-hero{ position:relative; height:180px; overflow:hidden; }
    .rl-hero img{ width:100%; height:100%; object-fit:cover; display:block; }
    .rl-badge{ position:absolute; top:10px; left:10px; background:#0b0f1a; color:#fff; font-weight:800; font-size:13px; padding:4px 8px; border-radius:12px; }
    .rl-pill{ position:absolute; left:10px; background:#fff; font-weight:700; font-size:13px; padding:6px 10px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.15); }
    .rl-price{ bottom:44px; } .rl-time{ bottom:12px; }
    .rl-icons{ position:absolute; right:8px; top:8px; display:flex; flex-direction:column; gap:10px; }
    .rl-ico{ width:26px; height:26px; display:grid; place-items:center; border:none; background:transparent; cursor:pointer; padding:0; }
    .rl-ico svg{ width:100%; height:100%; stroke:#fff; stroke-width:2.4; fill:none; filter:drop-shadow(0 2px 4px rgba(0,0,0,.35)); }
    .rl-body{ padding:10px 12px 14px; }
    .rl-title{ font-size:16px; font-weight:800; margin-bottom:2px; color:var(--rl-ink); }
    .rl-sub{ font-size:13px; color:var(--rl-muted); margin-bottom:6px; }
    .rl-specs{ display:flex; flex-wrap:wrap; gap:6px; }
    .rl-chip{ display:flex; align-items:center; gap:6px; background:var(--rl-chip); border-radius:999px; padding:4px 10px;
      font-size:12px; font-weight:700; color:#0b0f1a; }
    .rl-chip svg{ width:16px; height:16px; stroke:#0b0f1a; stroke-width:2; fill:none; }
  `;
  const st = document.createElement("style");
  st.id = id;
  st.innerHTML = css;
  document.head.appendChild(st);
}
