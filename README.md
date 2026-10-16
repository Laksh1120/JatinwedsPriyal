# Priyal & Jatin — Wedding Invitation

Single-page wedding invitation built with TanStack Start, React 19, Vite and Tailwind CSS v4.

## Develop

```sh
npm install
npm run dev     # http://localhost:8080
npm run build   # production build (Vercel output in .vercel/output)
```

## Deploy

Deployed on Vercel. The Nitro preset is set to `vercel` in `vite.config.ts`.

## Two sites, one codebase

All wording lives in `src/content/site.tsx` (a `groom` block and a `bride` block). The build picks one with the
`VITE_SITE` environment variable:

- unset → groom's side (`jatinwedspriyal.vercel.app`)
- `VITE_SITE=bride` → bride's side (`priyalwedsjatin.vercel.app`)
- `VITE_SITE=bride-reception` → reception-only version at the home page (`priyalandjatinwedding.vercel.app`)

Create a second Vercel project from this same repo and set `VITE_SITE=bride` on it.
Locally: `VITE_SITE=bride npm run dev`.
