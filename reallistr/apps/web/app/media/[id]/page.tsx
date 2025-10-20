// reallistr/apps/web/app/media/[id]/page.tsx
import ListingForm from "@/components/ListingForm";

async function getListing(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
  const res = await fetch(`${base}/listings`, { cache: "no-store" });
  const rows = (await res.json()) as any[];
  return rows.find((r) => String(r.id) === id);
}

export default async function EditListing({ params }: { params: { id: string } }) {
  const row = await getListing(params.id);
  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Edit Listing</h1>
      <ListingForm initial={row} />
    </main>
  );
}
