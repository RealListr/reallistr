async function getListings() {
  const origin = process.env.NEXT_SITE_INTERNAL || 'http://127.0.0.1:3000';
  const url = new URL('/api/listings', origin).toString();
  const res = await fetch(url, { cache: 'no-store' });
  let data: any = [];
  try { data = await res.json(); } catch { return []; }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export default async function MediaIndex() {
  const listings = await getListings();

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Media</h1>
      {listings.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No listings yet.</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {listings.map((l: any) => (
            <li key={l.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 600 }}>{l.title}</div>
              <div style={{ opacity: 0.8 }}>${l.price}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{l.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
