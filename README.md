# anvionixlabs.com

The website of Anvionix Labs, a software studio: services, case studies, pricing and the quote form.
Next.js 16 (App Router) with Tailwind CSS v4, exported as a static site. All copy lives in
[`data/site.ts`](data/site.ts).

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build    # static export to out/
```

## Deploy

Cloudflare Pages builds `master` and publishes `out/` to anvionixlabs.com. Every other branch gets a
preview at `<branch>.anvionixlabs.pages.dev`. Redirects live in [`public/_redirects`](public/_redirects).

## Brand

Logo, palette, contrast rules and type: [BRAND.md](BRAND.md). Tokens: [`brand/tokens.css`](brand/tokens.css)
and [`brand/tokens.json`](brand/tokens.json), mapped onto the site in [`app/globals.css`](app/globals.css).
