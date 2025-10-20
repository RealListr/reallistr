// Minimal Worker with D1 + CORS, now returning lat/lng and single-item endpoint
export interface Env { DB: D1Database }

function withCORS(res: Response) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  return res;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return withCORS(new Response(null, { status: 204 }));

    if (url.pathname === '/' || url.pathname === '/health') {
      return withCORS(new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'content-type': 'application/json' }
      }));
    }

    if (url.pathname === '/listings') {
      const rs = await env.DB
        .prepare('SELECT id,title,price,created_at,lat,lng FROM listings ORDER BY id DESC')
        .all();
      return withCORS(new Response(JSON.stringify(rs.results ?? []), {
        headers: { 'content-type': 'application/json' }
      }));
    }

    if (url.pathname === '/listing') {
      const id = Number(url.searchParams.get('id'));
      if (!id) return withCORS(new Response(JSON.stringify({ error: 'missing id' }), { status: 400 }));
      const rs = await env.DB
        .prepare('SELECT id,title,price,created_at,lat,lng FROM listings WHERE id=?')
        .bind(id)
        .first();
      return withCORS(new Response(JSON.stringify(rs ?? null), {
        headers: { 'content-type': 'application/json' }
      }));
    }

    return withCORS(new Response('Not Found', { status: 404 }));
  }
}
