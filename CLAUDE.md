# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Australian furniture e-commerce platform (1:1 McPhails.com.au replica) using Medusa v2 backend + Nuxt 4 frontend.

**Tech Stack:**
- Backend: Medusa v2.13.1 (Node.js 20+, TypeScript)
- Frontend: Nuxt 4.3.1 (Vue 3.5.28, Element Plus 2.13.2)
- Database: PostgreSQL 15 (Docker)
- Cache: Redis 7.2 (Docker)
- File Storage: 腾讯云 COS (腾讯云对象存储)

## Development Commands

### Start Full Stack
```bash
# Start database services (PostgreSQL + Redis)
docker-compose up -d

# Backend (port 9000)
cd backend && npm run dev

# Frontend (port 3000)
cd storefront && npm run dev
```

### Backend Commands
```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed demo data (products, categories, etc.)
```

### Frontend Commands
```bash
cd storefront
npm run dev      # Start development server
npm run build    # Build for production
npm run generate # Generate static site
```

### Tests
```bash
cd backend
npm run test:unit              # Unit tests
npm run test:integration:http  # HTTP integration tests
npm run test:integration:modules # Module integration tests
```

## Architecture

### Backend (Medusa v2)

Medusa v2 uses a **modular architecture**:

```
backend/src/
├── admin/         # Admin panel customizations
├── api/           # Custom API endpoints (store/*, admin/*)
│   ├── store/     # Storefront API routes
│   └── admin/     # Admin API routes
├── modules/       # Custom business modules (shipping, payment, etc.)
├── workflows/     # Workflow definitions for complex operations
├── links/         # Module linking definitions
├── subscribers/   # Event handlers
├── jobs/          # Scheduled jobs
└── scripts/       # Utility scripts (seed.ts)
```

**Key Concepts:**
- **Modules**: Replace v1 plugins. Use for extending functionality (payment, file storage, etc.)
- **Workflows**: Define business logic chains using `@medusajs/workflows-sdk`
- **Links**: Connect data between different modules
- **API Routes**: File-based routing under `src/api/`

Configuration: `backend/medusa-config.ts`

### Frontend (Nuxt 4)

Uses Nuxt 4's **app directory** structure:

```
storefront/app/
├── pages/         # File-based routing
│   ├── index.vue              # Homepage
│   └── products/
│       └── [id].vue           # Product Detail Page (PDP)
├── components/    # Vue components
│   ├── layout/
│   │   ├── Header.vue         # Site header with mega menu
│   │   └── Footer.vue         # Site footer
│   └── ProductCard.vue        # Product listing card
├── composables/   # Auto-imported composables
│   └── useMedusa.ts          # Medusa API client
├── stores/        # Pinia state management
│   └── cart.ts                # Shopping cart state
└── app.vue        # Root component (scroll-to-top button)
```

**Key Patterns:**
- Use `useMedusa()` composable for API calls (handles auth + baseURL)
- Use `useAsyncData()` for SSR data fetching
- Element Plus for UI components
- Tailwind CSS for styling (utility-first)
- Pinia for state management

Configuration: `storefront/nuxt.config.ts`

## API Communication

Frontend connects to Medusa backend via:

```typescript
// app/composables/useMedusa.ts
const medusa = useMedusa()
const { products } = await medusa('/store/products')
```

Required headers (auto-configured in composable):
- `x-publishable-api-key`: Set via `NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

Common endpoints:
- `GET /store/products` - List products
- `GET /store/products/:id` - Get product details
- `GET /store/product-categories` - Get categories
- `GET /store/product-categories?include_descendants_tree=true` - Get category tree

## Shopping Cart (Pinia Store)

Location: `app/stores/cart.ts`

Features:
- Drawer-based slide-out cart UI
- Add/remove items with quantity management
- Total items and price calculation
- Auto-opens drawer when items added

Usage:
```typescript
const cartStore = useCartStore()
cartStore.addItem(variant, product, quantity)
cartStore.openDrawer()
cartStore.closeDrawer()
```

## Australian Market Specifics

- **Currency**: AUD (format as `$1,299.00`)
- **GST**: 10% included in all prices
- **Shipping**: $59 flat rate, postcode-based remote area exclusion
- **Remote Postcodes**: 08*, 09*, 67xx, 68xx regions

## Media & Images

- **Storage**: 腾讯云 COS (腾讯云对象存储)
- **CDN URL Format**: `https://{bucket}.cos.{region}.myqcloud.com`
- **Dynamic Category Images**: Use category `metadata.image_url` and `metadata.rank` for homepage display

## Environment Variables

**Backend (.env):**
```bash
# Database
DATABASE_URL=postgres://medusa:medusa123@localhost:5432/furniture-store

# Redis
REDIS_URL=redis://localhost:6379

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:3000

# Auth secrets
JWT_SECRET=change-this-to-a-random-secret-key
COOKIE_SECRET=change-this-to-another-random-secret-key

# S3 / 腾讯云 COS
S3_BUCKET=your-bucket-name
S3_REGION=ap-singapore
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_URL=https://cos.ap-singapore.myqcloud.com
```

**Frontend (storefront/.env):**
```bash
NUXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-publishable-key
```

## UI Components & Styling

**UI Library**: Element Plus (auto-imported via `@element-plus/nuxt`)

**Common Components:**
- `<NuxtLink>` - Internal links (prevents full page reload)
- `useMedusa()` - API calls
- `useAsyncData()` - SSR-safe data fetching

**Styling:**
- Tailwind CSS utility classes
- Custom spacing using `@nuxtjs/tailwindcss`
- Element Plus components: `el-drawer`, `el-menu`, etc.

## Project Status & Recent Updates

Based on git history:
- ✅ Homepage UI optimized (mail module, discount cards)
- ✅ Dynamic discount card rendering via Medusa metadata
- ✅ PDP (Product Detail Page) basic implementation
- ✅ Price display issues resolved
- ✅ Tencent Cloud OSS file storage configured
- ✅ Nuxt 4 + Medusa v2 integration working

**In Progress:**
- Product Detail Page refinement
- Shopping cart checkout flow
- Shipping module for Australian postcodes
- Payment integration (Stripe + Afterpay/Zip)

## Project References

- Tech Design: `docs/TechDesign.md`
- PRD: `docs/PRD.md`
- Backend README: `backend/README.md`
- Target Reference Site: https://mcphails.com.au

## Git Workflow

Current branch: `main`
Remote: GitHub

When committing changes:
- Use conventional commit messages
- Reference PRD features when applicable
- Test both frontend and backend after changes
