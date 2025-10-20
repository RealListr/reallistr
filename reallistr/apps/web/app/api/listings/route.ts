export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // ensure localhost access from the server

type Listing = {
  id: number; title: string; price: number;
  created_at?: string; lat?: number; lng?: number;
};

const DEMO: Listing[] = [
  { id: 2, title: "Camera tripod", price: 60, created_at: "2025-10-19 23:30:30", lat: -33.8908, lng: 151.2743 },
  { id: 1, title: "Desk lamp",     price: 25, created_at: "2025-10-19 23:30:30", lat: -33.8688, lng: 151.2093 },
];

async function fetchFirstOk(urls: string[]) {
  const errors: any[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return { res, url };
      errors.push({ url, status: res.status });
    } catch (e: any) {
      errors.push({ url, code: e?.code, errno: e?.errno, msg: e?.message });
    }
  }
  throw Object.assign(new Error('all fetches failed'), { errors });
}

export async function GET() {
  const base = process.env.NEXT_API_INTERNAL ?? 'http://127.0.0.1:8787';
  const candidates = [`${base}/listings`, `${base}/dev/listings`];

  try {
    const { res, url } = await fetchFirstOk(candidates);
    const text = await res.text();
    return new Response(text, {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-upstream-url': url },
    });
  } catch (e: any) {
    // Hard fallback so the app stays usable
    console.error('api/listings error', JSON.stringify({ error: 'proxy_fetch_failed', ...e }, null, 2));
    return new Response(JSON.stringify(DEMO), {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-fallback': 'demo' },
    });
  }
}
