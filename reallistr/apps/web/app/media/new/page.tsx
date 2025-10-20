// reallistr/apps/web/app/media/new/page.tsx
import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>New Listing</h1>
      <ListingForm />
    </main>
  );
}
