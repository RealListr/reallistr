import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

const CreateSchema = z.object({
  agency_id: z.string(),
  property_type: z.string().optional(),
  headline: z.string().optional(),
});

router.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, agency_id, status, listing_number, listing_ref, headline FROM listings ORDER BY created_at DESC LIMIT 100'
  ).all();
  return c.json(results);
});

router.post('/', async (c) => {
  const body = await c.req.json();
  const input = CreateSchema.parse(body);

  const id = crypto.randomUUID();
  const now = Date.now();

  const seqKey = `seq:${input.agency_id}`;
  const current = Number((await c.env.KV.get(seqKey)) || '0');
  const next = current + 1;
  await c.env.KV.put(seqKey, String(next));

  const ref = `RLr-${(input.agency_id || 'AGY').slice(0,3).toUpperCase()}-${String(next).padStart(6,'0')}`;

  await c.env.DB.prepare(
    `INSERT INTO listings (id, agency_id, status, listing_number, listing_ref, created_at, updated_at)
     VALUES (?, ?, 'draft', ?, ?, ?, ?)`
  ).bind(id, input.agency_id, next, ref, now, now).run();

  return c.json({ id, listing_number: next, listing_ref: ref }, 201);
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare('SELECT * FROM listings WHERE id = ?').bind(id).all();
  if (!results[0]) return c.notFound();
  return c.json(results[0]);
});

router.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await c.env.DB.prepare('UPDATE listings SET headline = coalesce(?, headline), summary = coalesce(?, summary), updated_at = ? WHERE id = ?')
    .bind(body.headline ?? null, body.summary ?? null, Date.now(), id).run();
  return c.json({ ok: true });
});

export default router;
