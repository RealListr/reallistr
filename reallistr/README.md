# reallistr starter

## Quick start
API:
- `cd apps/worker && npm i`
- create Cloudflare resources: D1, KV, R2
- `npm run migrate`
- `npm run dev` (http://localhost:8787)

Web:
- `cd apps/web && npm i`
- `export NEXT_PUBLIC_API_URL=http://localhost:8787`
- `npm run dev` (http://localhost:3000)
