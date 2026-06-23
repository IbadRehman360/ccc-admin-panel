# CCC Admin Panel — Codebase Guide

The admin moderation/management UI for Culture Currency Connection. Paired with the `ccc-webservices` backend and consumes the same MySQL DB as the mobile app.

For deployment instructions see [`DEPLOY.md`](./DEPLOY.md).
For interactive API docs (when backend is running) see `http://localhost:8089/api/v1/docs`.

---

## Stack

### Frontend (this repo: `ccc-admin-application`)
- **Framework**: Next.js 15.5.19 (App Router), React 18.3, TypeScript
- **State / API**: Redux Toolkit + RTK Query (`@reduxjs/toolkit` 2.x)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **Charts**: Recharts 2.15
- **Icons**: Lucide React
- **Auth**: JWT in `localStorage`, auto-refresh on 401, safe fallback to in-memory storage if localStorage blocked
- **Colors**: Primary `#195440` (dark green), Accent `#E1B047` (gold)

### Backend (sibling repo: `ccc-webservices`)
- **Framework**: Node.js + Express 4 + Prisma 5 (MySQL)
- **Auth**: JWT in raw `Authorization` header (no `Bearer ` prefix)
- **Validation**: Joi
- **Docs**: Swagger UI at `/api/v1/docs` (swagger-jsdoc + swagger-ui-express)
- **Notifications**: Firebase Admin SDK (FCM)
- **Storage**: AWS S3 (media files)
- **DB**: MySQL on AWS RDS (shared with mobile app)
- **Security**: helmet + rate limiting + audit log + CORS env-driven
- **Vulnerabilities**: `yarn audit` clean (0 found)

---

## Authentication

### Endpoints
```
POST   /api/v1/admin/auth/login      body: { email, password }
GET    /api/v1/admin/auth/me         requires admin JWT
POST   /api/v1/admin/auth/refresh    body: { refresh_token }
POST   /api/v1/admin/auth/logout     body: { refresh_token }
```

### Flow
1. `POST /admin/auth/login` → `{ access_token (7d), refresh_token (14d), admin }`
2. Frontend stores tokens in `localStorage` (`ccc_admin_access_token`, `ccc_admin_refresh_token`)
3. All subsequent requests send `Authorization: <access_token>` (raw, no `Bearer ` prefix)
4. On 401, RTK Query auto-tries `/refresh` with the refresh token; if that fails, redirects to `/login`

### Authorization — Role Tiers
3-tier system enforced server-side via `admin_role_check` middleware:

| Tier | Can do |
|---|---|
| **SUPER_ADMIN** | Everything. Including managing other admins (create, edit role, delete). |
| **ADMIN** | Moderate users/businesses/posts/communities/ads/jobs. Approve claims. Broadcast notifications. **Cannot** manage other admins. |
| **MODERATOR** | Read-only + soft moderation (flag, mark reviewed). Cannot suspend/delete. |

### Creating the first SUPER_ADMIN
No signup endpoint. Run this once on a fresh deploy (see `DEPLOY.md` for the full script).

Subsequent admins are created via the **Admin Management** page once you're logged in as SUPER_ADMIN.

---

## Sidebar pages (18 wired + 1 stub)

| Page | Path | Backend route prefix | Status |
|---|---|---|---|
| Dashboard | `/dashboard` | `/admin/dashboard` | ✅ Live |
| Admin Management | `/admin-management` | `/admin/admins` | ✅ Live (SUPER_ADMIN only for mutations) |
| Pending Approvals | `/pending-approvals` | `/admin/approvals` | ✅ All 3 tabs: Ads / Business Claims / Community Approvals |
| Users | `/user-management` | `/admin/users` | ✅ Live |
| Businesses | `/business-management` | `/admin/businesses` | ✅ Live |
| Promo Codes | `/promo-codes` | (n/a) | 🟡 Stub — needs schema migration + mobile UI for user-redeemable codes |
| Communities | `/communities` | `/admin/communities` | ✅ Live, with Approve/Reject/Suspend |
| Events | `/events` | `/admin/events` | ✅ Live |
| Posts | `/posts` | `/admin/posts` | ✅ Live, with Flag/Soft-remove/Restore |
| Chats | `/chats` | `/admin/chats` | ✅ Live, with per-participant Warn/Block |
| Ads | `/ad-management` | (reuses `/admin/approvals/ads`) | ✅ 4-tab workflow |
| Jobs | `/job-management` | `/admin/jobs` | ✅ Live, with Suspend |
| Matching Engine | `/matching-engine` | `/admin/matching` | ✅ Live |
| Geofencing | `/geofencing` | `/admin/geofencing` | ✅ Live, with Zones tab (define + broadcast) |
| Notifications | `/notifications` | `/admin/notifications` | ✅ Live |
| Reports | `/report-management` | `/admin/reports` | ✅ Live, with status/severity/notes moderation |
| News | `/news` | `/admin/news` | ✅ Live, articles merged into mobile rapidapi feed |
| System Settings | `/system-settings` | `/admin/settings` | ✅ Live (Terms / Privacy / About) |
| User Analytics | `/user-analytics` | (reuses `/admin/dashboard/charts`) | ✅ Subset of Dashboard (retention/demographics need mobile event tracking) |

All list endpoints return:
```json
{
  "status": { "code": 200, "success": true },
  "data": {
    "data": [...],
    "pagination": { "total": 0, "page": 1, "limit": 20, "total_pages": 1 }
  },
  "message": "..."
}
```

Every endpoint under `/admin/*` requires `verify_token + user_type_check("ADMIN")`. Sensitive mutations (e.g. all `/admin/admins/*` writes) additionally require `admin_role_check("SUPER_ADMIN")`.

---

## Schema migrations

5 migrations were applied to production DB (in `ccc-webservices/src/api/v1/prisma/migrations/`):

1. **`20260615152231_admin_panel_features`** — admin roles, community/post/report status, jobs SUSPENDED
2. **`20260616153100_news_articles`** — `news_article` table
3. **`20260617090500_geofence_zones`** — `geofence_zone` table
4. **`20260618070000_business_review_workflow`** — `business_information.review_status`
5. **`20260618210000_news_article_content`** — `news_article.content` rich body

All migrations are **additive and non-breaking** for the mobile app — existing data defaults to `APPROVED`/`ACTIVE`, so mobile listings continue unchanged.

To apply on a fresh DB:
```bash
npx prisma db execute --schema src/api/v1/prisma/schema.prisma --file <each migration.sql in chronological order>
```

---

## Mobile-side behaviour (what changed without mobile code changes)

| Mobile endpoint | Before | After |
|---|---|---|
| `GET /external_api/get_news` | Pure rapidapi results | Admin-curated PUBLISHED articles prepended, rapidapi fills rest |
| `GET /external_api/get_news_by_id` | Always scrapes URL | If URL matches an admin-curated article, serves DB row directly (no scraping) |
| `POST /user/business_information` | Auto-approved | New submissions go to `review_status=PENDING`; admin must approve before they appear in mobile listings |
| Business-listing endpoints (4 total: `/geofencing/filter`, `home_corporations`, `diversed_businesses`, `business_filters`) | Showed all businesses | Filter `WHERE review_status='APPROVED'` (or NULL for seeded users without a `business_information` row) |

Mobile app required **zero code changes** — Dart's JSON parser ignores new fields, and removed/pending businesses just disappear server-side.

---

## Project structure

```
ccc-admin-application/
├── public/                       # Static assets + favicon
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout, ReduxProvider, favicon metadata
│   │   ├── page.tsx              # Redirects to /login
│   │   ├── (auth)/login/page.tsx
│   │   └── (admin)/
│   │       ├── layout.tsx        # Sidebar + Header + AuthGate
│   │       └── 19 page.tsx files (1 per sidebar item)
│   ├── components/
│   │   ├── layout/               # AuthGate, Header, Sidebar, UserAvatar
│   │   └── ui/                   # 15 shadcn/ui primitives
│   ├── constants/navigation.ts
│   ├── hooks/use-mobile.ts
│   ├── lib/
│   │   ├── api/client.ts         # axios + safe localStorage helpers
│   │   ├── format.ts             # Shared formatDate / formatDateTime / extractError
│   │   └── utils.ts              # cn() class merger
│   ├── providers/ReduxProvider.tsx
│   ├── store/
│   │   ├── index.ts              # configureStore
│   │   ├── hooks.ts              # Typed useAppDispatch/useAppSelector
│   │   ├── slices/authSlice.ts
│   │   └── api/
│   │       ├── baseApi.ts        # createApi + auto-refresh on 401
│   │       ├── authApi.ts
│   │       └── 16 feature slices (admins, users, businesses, news, geofencing, etc.)
│   └── styles/globals.css
├── .env.local                    # local dev (gitignored)
├── .env.production               # prod URL (committed; safe — NEXT_PUBLIC_* is client-visible)
├── CLAUDE.md                     # ← you are here
├── DEPLOY.md                     # Deployment runbook
├── next.config.mjs               # Security headers + image domains
├── package.json
└── tsconfig.json
```

---

## Backend project structure (in sibling repo `ccc-webservices`)

```
src/api/v1/
├── routers/admin/
│   ├── index.js                  # Mounts 17 sub-routers + rate limit + audit log
│   ├── auth/
│   ├── dashboard/
│   ├── admins/                   # SUPER_ADMIN required for mutations
│   ├── approvals/                # Ads + Business Claims + Community Approvals
│   ├── users/
│   ├── businesses/
│   ├── communities/
│   ├── events/
│   ├── posts/
│   ├── chats/
│   ├── jobs/
│   ├── matching/
│   ├── geofencing/               # Includes /zones endpoints
│   ├── notifications/
│   ├── reports/
│   ├── settings/
│   └── news/
├── controllers/admin/[17 subfolders]
├── services/admin/[17 subfolders]
├── validations/admin/[17 subfolders]
├── dto/admin/[*.dto.js per feature]
├── middlewares/
│   ├── audit_log.middleware.js   # Captures every mutation → logs/audit.log
│   ├── rate_limit.middleware.js  # 10/15min auth, 300/min general
│   └── admin_role_check.middleware.js
└── swagger/
    ├── index.js                  # Serves /api/v1/docs
    └── admin/[17 *.js spec files]
```

---

## Environment variables

### Frontend `.env.local` (dev) / `.env.production` (prod)
```
NEXT_PUBLIC_API_URL=https://api.culturecurrencyconnection.com/api/v1
```

### Backend `.env`
```
DATABASE_URL=mysql://user:pass@host:3306/ccc
PORT=8089

JWT_SECRET_KEY=<strong random secret — DO NOT use default placeholder>
CORS_ALLOWED_ORIGINS=https://admin.culturecurrencyconnection.com    # optional, defaults to *

GMAIL_ACCOUNT_EMAIL=...
BUCKET_NAME=ccc-backend
BUCKET_REGION=us-east-2
ACCESS_KEY_ID=...
SECRET_ACCESS_KEY=...
S3_ACCESS_URL=https://ccc-backend.s3.us-east-2.amazonaws.com
STRIPE_SECRET_KEY=...
NEWS_RAPID_API=...
```

---

## Security hardening

| Layer | Implementation |
|---|---|
| **JWT** | 7-day access tokens, 14-day refresh, auto-rotated on 401 |
| **Audit log** | Every admin mutation (POST/PATCH/PUT/DELETE) → `logs/audit.log` JSON lines, rotates at 10MB, keeps 10 |
| **Rate limiting** | Auth endpoints: 10 attempts / 15min / IP. General admin: 300 req/min / IP |
| **CORS** | Env-driven via `CORS_ALLOWED_ORIGINS`; defaults to `*` for backwards-compat with mobile |
| **Security headers** | Helmet on backend; Next.js sends X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS |
| **Role enforcement** | Server-side `admin_role_check` middleware — no client-side bypass possible |
| **Mobile session protection** | Mobile uses `bcrypt(password + email)`; admin uses `bcrypt(password)` — different hashes, can't cross-auth |
| **Vulnerability scan** | `yarn audit` clean (0 vulnerabilities) |

---

## What's NOT shipped (the only remaining blockers)

Both need mobile-app work:

1. **Promo Codes** — if user-redeemable, mobile needs "Enter promo code" UI at checkout. Skip if admin uses codes for tracking only.
2. **User Analytics depth** — retention, age demographics, hourly activity need an analytics SDK in mobile (Firebase Analytics recommended — free + already linked via FCM).

If client doesn't want either: the admin panel is feature-complete.

---

## Local development

```bash
# Backend (separate terminal)
cd ../ccc-webservices
yarn install
yarn start         # http://localhost:8089

# Frontend
cd ccc-admin-application
yarn install
yarn dev           # http://localhost:3000

# Open in a real browser (Chrome / full Edge), NOT VS Code embedded preview —
# that blocks localStorage and login won't work.
```

Login with the SUPER_ADMIN account you created during first deploy.

---

## Production deploy

See [`DEPLOY.md`](./DEPLOY.md) for the full runbook. Quick summary of remaining tasks:

1. **Backend prod `.env`**: set strong `JWT_SECRET_KEY` + `CORS_ALLOWED_ORIGINS` (deploy invalidates all mobile sessions — coordinate with mobile team)
2. **Push both repos** to git
3. **Deploy backend** first (so endpoints exist before frontend hits them)
4. **Deploy frontend** (`yarn build` + Vercel / your own server)
5. **Smoke test** — log in, click through sidebar, verify no console errors

---

## Quick reference — backend admin endpoints

| Feature | Endpoint(s) |
|---|---|
| Auth | `/admin/auth/{login,refresh,logout,me}` |
| Dashboard | `/admin/dashboard/{stats,charts}` |
| Admins | `/admin/admins/*` (SUPER_ADMIN for mutations) |
| Ad approvals | `/admin/approvals/ads/*` |
| Business claims | `/admin/approvals/claims/*` |
| Community approvals | `/admin/approvals/communities` |
| Users | `/admin/users/*` |
| Businesses | `/admin/businesses/*` |
| Communities | `/admin/communities/{*,:id/status}` |
| Events | `/admin/events/*` |
| Posts | `/admin/posts/{*,:id/status}` |
| Chats | `/admin/chats/{*,warn,block,unblock}` |
| Jobs | `/admin/jobs/*` |
| Matching | `/admin/matching/{stats,users,weights}` |
| Geofencing | `/admin/geofencing/{stats,users,top-locations,zones,zones/:id/users,zones/:id/broadcast}` |
| Notifications | `/admin/notifications/{stats,*,send}` |
| Reports | `/admin/reports/*` |
| Settings | `/admin/settings/{terms,privacy,about}` |
| News | `/admin/news/*` |

Full interactive docs at `http://localhost:8089/api/v1/docs`.
