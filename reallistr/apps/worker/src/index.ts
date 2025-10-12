import { Hono } from 'hono';
import listings from './routes/listings';
import leads from './routes/leads';
import geocode from './routes/geocode';
import uploads from './routes/uploads';

export type Env = {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  MAPBOX_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

// Simple CORS for local + prod override
const allowed = ['http://localhost:3000'];
app.use('*', async (c, next) => {
  await next();
  const origin = c.req.header('Origin') || allowed[0];
  c.header('Access-Control-Allow-Origin', allowed.includes(origin) ? origin : allowed[0]);
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
  c.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
});
app.options('*', (c) => c.text('', 204));

app.get('/health', (c) => c.json({ ok: true }));
app.route('/listings', listings);
app.route('/leads', leads);
app.route('/geocode', geocode);
app.route('/external-uploads', uploads);

export default app;
