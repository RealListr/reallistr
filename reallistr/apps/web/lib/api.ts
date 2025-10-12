export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
