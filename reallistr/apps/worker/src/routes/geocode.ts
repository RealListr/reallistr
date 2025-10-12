import { Hono } from 'hono';

const router = new Hono();

router.post('/', async (c) => {
  const { address } = await c.req.json();
  if (!address) return c.json({ error: 'address required' }, 400);

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${c.env.MAPBOX_TOKEN}&limit=1&country=AU`;
  const res = await fetch(url);
  const data = await res.json<any>();
  const feat = data.features?.[0];
  if (!feat) return c.json({ error: 'no_result' }, 404);

  const [lng, lat] = feat.center;
  return c.json({ lat, lng, place: feat.place_name });
});

export default router;
