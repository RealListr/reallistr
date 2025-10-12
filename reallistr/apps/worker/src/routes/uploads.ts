import { Hono } from 'hono';

const router = new Hono();

router.post('/:token/sign', async (c) => {
  // TODO: validate token against DB
  const key = `incoming/${crypto.randomUUID()}`;
  return c.json({ key });
});

export default router;
