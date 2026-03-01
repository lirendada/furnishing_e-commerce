# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Australian furniture e-commerce site built on MedusaJS v2. Three sub-projects:
- `backend/` — MedusaJS v2 API server (Node.js/TypeScript, port 9000)
- `storefront/` — **Primary** Nuxt 4 frontend (Vue 3/TypeScript, port 3000)
- `backend-storefront/` — Reference Next.js Medusa starter (port 8000, kept for reference)

Infrastructure: PostgreSQL + Redis managed via `docker-compose.yml` at project root.

## Development Commands

### Start infrastructure (required first)
```bash
docker-compose up -d
```

### Backend (`cd backend`)
```bash
npm run dev          # Start dev server (port 9000)
npm run build        # Production build
npm run seed:furniture  # Seed product/category data
npm run seed:prices  # Seed price lists
npm run update:category-metadata  # Update category images/ranks
npm run test:unit
npm run test:integration:http
npm run test:integration:modules
```

### Storefront (`cd storefront`)
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run generate     # Static site generation
```

### Environment Setup
Copy `.env` (already present) and fill in real values. Key variables:
- `DATABASE_URL`, `REDIS_URL` — matched to docker-compose defaults
- `NUXT_PUBLIC_MEDUSA_URL` — storefront → backend URL
- `NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Medusa publishable API key (create in admin)
- `S3_*` — Tencent Cloud COS config (S3-compatible file storage)

## Architecture

### Data Flow
All storefront API calls go through the `useMedusa()` composable (`storefront/app/composables/useMedusa.ts`), which wraps `$fetch` with the backend base URL and `x-publishable-api-key` header. Use this for every Medusa API call.

### Storefront Page Structure
- `pages/index.vue` — Homepage: hero banner, category carousel, product carousel, testimonials, FAQ
- `pages/categories/[handle].vue` — Category listing with sidebar filters, sort, pagination (SSR + load more)
- `pages/products/[id].vue` — PDP with image gallery, zoom, variant selection, add-to-cart

**Important:** Products are fetched by `handle`, not `id`:
- Product page route param is `[id]` but actually contains the handle — fetches via `/store/products?handle=...`
- Category pages fetch via `/store/product-categories?handle=...`

### Key Components
- `ProductCard.vue` — Displays product with AUD pricing, discount badge, wishlist toggle, lazy-loaded image
- `ImageLoader.vue` — Wrapper around `@nuxt/image` with fade-in skeleton; use presets: `thumbnail`, `card`, `hero`, `pdp`

### State Management
- `stores/cart.ts` (Pinia) — Local cart state only; not yet synced with Medusa cart API. Exposes `drawerVisible`, `addItem`, `removeItem`, `updateQuantity`, `totalItems`, `totalPrice`.

### Category Display on Homepage
Categories appear in the homepage carousel only if `metadata.image_url` is set. Sort order is controlled by `metadata.rank` (lower = first). Run `npm run update:category-metadata` in the backend after seeding.

### Pricing
- All prices in AUD; formatted with `en-AU` locale
- Prices come from `variant.calculated_price.calculated_amount` (region-aware) with fallback to `variant.prices[0].amount`
- Always fetch with `region_id` param (first region from `/store/regions`)
- Discounts shown when `calculated_amount < original_amount`

### Backend Customization Points
- `src/modules/` — Custom Medusa modules
- `src/workflows/` — Custom workflows
- `src/scripts/` — Seeding and migration scripts (run via `medusa exec ./src/scripts/<name>.ts`)
- `src/api/store/` — Custom store API routes
- `src/api/admin/` — Custom admin API routes
- `src/subscribers/` — Event subscribers

### File Storage
Configured to use Tencent Cloud COS via `@medusajs/file-s3` (S3-compatible). The `file_url` is constructed as `https://${S3_BUCKET}.cos.${S3_REGION}.myqcloud.com`. Images from Unsplash (`images.unsplash.com`) are also whitelisted for `@nuxt/image`.
