import { Hono } from "hono";
import { z } from "zod";

export const listings = new Hono<{ Bindings: Env }>();

const ListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  suburb: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  price: z.string().optional(),
  open_time: z.string().optional(),
  beds: z.number().int().optional(),
  baths: z.number().int().optional(),
  cars: z.number().int().optional(),
  ev: z.boolean().optional(),
  solar: z.boolean().optional(),
  area: z.string().optional(),
  cover_url: z.string().url().optional(),
  agency_name: z.string().optional(),
  agency_logo_url: z.string().url().optional(),
  agents_json: z.string().optional(), // raw JSON string
});

listings.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM listings ORDER BY created_at DESC`
  ).all();
  return c.json(results);
});

listings.post("/", async (c) => {
  const body = await c.req.json();
  const data = ListingSchema.parse(body);

  // booleans to ints for D1
  const ev = data.ev ? 1 : 0;
  const solar = data.solar ? 1 : 0;

  const stmt = c.env.DB.prepare(
    `INSERT INTO listings
    (title, description, suburb, lat, lng, price, open_time, beds, baths, cars, ev, solar, area, cover_url, agency_name, agency_logo_url, agents_json)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17)`
  ).bind(
    data.title, data.description ?? null, data.suburb ?? null,
    data.lat, data.lng, data.price ?? null, data.open_time ?? null,
    data.beds ?? null, data.baths ?? null, data.cars ?? null,
    ev, solar, data.area ?? null, data.cover_url ?? null,
    data.agency_name ?? null, data.agency_logo_url ?? null, data.agents_json ?? null
  );

  const res = await stmt.run();
  return c.json({ id: res.lastRowId }, 201);
});

listings.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const data = ListingSchema.partial().parse(body);

  const ev = data.ev === undefined ? undefined : (data.ev ? 1 : 0);
  const solar = data.solar === undefined ? undefined : (data.solar ? 1 : 0);

  // Build dynamic SQL
  const fields: string[] = [];
  const values: unknown[] = [];
  const add = (col: string, val: unknown) => { fields.push(`${col}=?`); values.push(val); };

  Object.entries(data).forEach(([k, v]) => {
    if (k === "ev" && ev !== undefined) add("ev", ev);
    else if (k === "solar" && solar !== undefined) add("solar", solar);
    else add(k, v as unknown);
  });

  if (!fields.length) return c.json({ ok: true });

  const stmt = c.env.DB.prepare(`UPDATE listings SET ${fields.join(",")} WHERE id=?`).bind(...values, id);
  await stmt.run();
  return c.json({ ok: true });
});
