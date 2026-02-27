# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Australian furniture e-commerce platform (1:1 McPhails.com.au replica) using Medusa v2 backend + Nuxt 4 frontend.

**Tech Stack:**
- Backend: Medusa v2.13.1 (Node.js 20+, TypeScript)
- Frontend: Nuxt 4.3.1 (Vue 3, Element Plus)
- Database: PostgreSQL 15
- Cache: Redis 7.2

## Development Commands

### Start Full Stack
```bash
# Start database services
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
├── api/           # Custom API endpoints (store/*, admin/*)
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

Configuration: `backend/medusa-config.ts`

### Frontend (Nuxt 4)

Uses Nuxt 4's **app directory** structure:

```
storefront/app/
├── pages/         # File-based routing (index.vue, products/[id].vue)
├── components/    # Vue components
├── composables/   # Auto-imported composables
└── app.vue        # Root component
```

**Key Patterns:**
- Use `useMedusa()` composable for API calls (handles auth + baseURL)
- Use `useAsyncData()` for SSR data fetching
- Element Plus for UI components
- Tailwind CSS for styling

Configuration: `storefront/nuxt.config.ts`

## API Communication

Frontend connects to Medusa backend via:

```typescript
// app/composables/useMedusa.ts
const medusa = useMedusa()
const { products } = await medusa('/store/products')
```

Required headers:
- `x-publishable-api-key`: Set via `NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

## Australian Market Specifics

- **Currency**: AUD (format as `$1,299.00 (含GST)`)
- **GST**: 10% included in all prices
- **Shipping**: $59 flat rate, postcode-based remote area exclusion
- **Remote Postcodes**: 08*, 09*, 67xx, 68xx regions

## Environment Variables

**Backend (.env):**
- `DATABASE_URL` - PostgreSQL connection string
- `STORE_CORS` - Frontend URL for CORS
- `ADMIN_CORS` - Admin panel URL for CORS
- `JWT_SECRET`, `COOKIE_SECRET` - Authentication secrets
- `REDIS_URL` - Redis connection (optional)

**Frontend (storefront/.env):**
- `NUXT_PUBLIC_MEDUSA_URL` - Backend API URL
- `NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - API authentication key

## Project References

- Tech Design: `docs/TechDesign.md`
- PRD: `docs/PRD.md`
- Backend README: `backend/README.md`
