import { Hono } from 'hono';
const router = new Hono();

router.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, stage, owner_user_id, listing_id, created_at FROM leads ORDER BY created_at DESC LIMIT 100'
  ).all();
  return c.json(results);
});

router.post('/', async (c) => {
  const b = await c.req.json();
  const id = crypto.randomUUID();
  const now = Date.now();
  await c.env.DB.prepare(
    `INSERT INTO leads (id, agency_id, listing_id, source, name, email, phone, message, stage, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  ).bind(
    id, b.agency_id, b.listing_id ?? null, b.source ?? 'web', b.name ?? '', b.email ?? '', b.phone ?? '', b.message ?? '', now, now
  ).run();
  return c.json({ id, stage: 'new' }, 201);
});

router.post('/:id/claim', async (c) => {
  const id = c.req.param('id');
  const user = c.req.header('x-user-id') || 'agent';
  await c.env.DB.prepare('UPDATE leads SET owner_user_id = ?, updated_at = ? WHERE id = ?')
    .bind(user, Date.now(), id).run();
  return c.json({ ok: true });
});

export default router;
