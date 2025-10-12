'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ListingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api('/listings').then(setRows).catch(console.error); }, []);
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Listings</h1>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Ref</th><th>Status</th><th>Headline</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">#{r.listing_number} • {r.listing_ref}</td>
              <td>{r.status}</td>
              <td>{r.headline || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
