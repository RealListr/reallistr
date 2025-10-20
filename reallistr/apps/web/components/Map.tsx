// reallistr/apps/web/components/Map.tsx (excerpt)
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import PropertyPinCard from "./PropertyPinCard";

// ... inside your marker creation loop:
const popupContainer = document.createElement("div");

const root = createRoot(popupContainer);
root.render(
  <PropertyPinCard
    id={listing.id}
    title={listing.title}
    price={listing.price}
    imageUrl={listing.imageUrl /* optional */}
    address={listing.address /* optional */}
    createdAt={listing.created_at}
    badges={["New"]}
    distanceKm={listing.distanceKm}
    onView={(id) => {
      // navigate in your app
      window.location.href = `/media/${id}`;
    }}
    onDirections={(id) => {
      // open in maps (example uses lat/lng on listing)
      const q = `${listing.lat},${listing.lng}`;
      window.open(`https://www.google.com/maps?q=${q}`, "_blank");
    }}
  />
);

const popup = new mapboxgl.Popup({ offset: 12, closeButton: true })
  .setDOMContent(popupContainer);

// attach to marker
new mapboxgl.Marker({ color: "#111827" })
  .setLngLat([listing.lng, listing.lat])
  .setPopup(popup)
  .addTo(map);
