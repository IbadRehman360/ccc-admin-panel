# CCC Admin Panel — Frontend & Backend Integration Guide

This document describes the **actual** state of the admin panel implementation as of the current commit. For interactive Swagger docs of every endpoint, see `http://localhost:8089/api/v1/docs` (linked from the admin panel header → "API Docs").

---

## Stack

### Frontend (this repo: `ccc-admin-application`)
- **Framework**: Next.js 14.2.35 (App Router), React 18.3, TypeScript
- **State / API**: Redux Toolkit + RTK Query (`@reduxjs/toolkit` 2.x)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **Charts**: Recharts 2.15
- **Icons**: Lucide React
- **Auth**: JWT in `localStorage`, auto-refresh on 401
- **Colors**: Primary `#195440` (dark green), Accent `#E1B047` (gold)

### Backend (sibling repo: `ccc-webservices`)
- **Framework**: Node.js + Express 4 + Prisma 5 (MySQL)
- **Auth**: JWT in raw `Authorization` header (no `Bearer ` prefix)
- **Validation**: Joi
- **Docs**: Swagger UI at `/api/v1/docs` (swagger-jsdoc + swagger-ui-express)
- **Notifications**: Firebase Admin SDK (FCM)
- **Storage**: AWS S3 (media files)
- **DB**: MySQL on AWS RDS

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

### Authorization
- Backend middleware: `verify_token` (validates JWT, loads user) + `user_type_check("ADMIN")` (must have `user_type='ADMIN'`)
- Role tiers (Super Admin / Admin / Moderator) are **not implemented** — schema only has `user_type` enum (`USER`, `BUSINESS`, `ADMIN`)

### Creating an admin
There is no signup endpoint. To create the first admin, run in the backend repo:
```bash
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('YourPassword', 10);
  await prisma.users.create({
    data: {
      email: 'admin@yourdomain.com',
      user_type: 'ADMIN',
      account_type: 'EMAIL',
      is_email_verified: true,
      user_secrets: { create: { password: hash, otp_expiration: new Date() } },
      user_details: { create: { full_name: 'Your Name' } },
    },
  });
})();
"
```
Subsequent admins can be added via the **Admin Management** page once you're logged in.

---

## All admin endpoints

Every endpoint listed below is under the `/api/v1/admin` prefix and requires `verify_token + user_type_check("ADMIN")` (except `/auth/login`, `/auth/refresh`, `/auth/logout`).

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

### Dashboard
```
GET  /admin/dashboard/stats
GET  /admin/dashboard/charts
```

### Admin Management (`/admin-management`)
```
GET    /admin/admins/stats
GET    /admin/admins?search=&status=&page=&limit=
POST   /admin/admins                 body: { email, password, full_name }
GET    /admin/admins/:id
PATCH  /admin/admins/:id             body: { email?, full_name? }
PATCH  /admin/admins/:id/status      body: { is_blocked }
PATCH  /admin/admins/:id/reset-password  body: { new_password }
DELETE /admin/admins/:id
```

### Pending Approvals (`/pending-approvals`)
Ads tab is fully wired. Business Claims + Community Approvals tabs return `not_implemented: true` until schema migrations land.
```
GET    /admin/approvals/ads/stats
GET    /admin/approvals/ads?status=&search=&page=&limit=
GET    /admin/approvals/ads/:id
PATCH  /admin/approvals/ads/:id/status   body: { status, reason? }
GET    /admin/approvals/claims          (stub)
GET    /admin/approvals/communities     (stub)
```

### User Management (`/user-management`)
```
GET    /admin/users/stats
GET    /admin/users?search=&status=&completion=&page=&limit=
GET    /admin/users/:id
GET    /admin/users/:id/documents
PATCH  /admin/users/:id/status        body: { is_blocked, reason? }
DELETE /admin/users/:id               body: { reason }
```

### Business Management (`/business-management`)
```
GET    /admin/businesses/stats
GET    /admin/businesses?search=&type=&status=&verified=&sort_by=&page=&limit=
GET    /admin/businesses/:id
GET    /admin/businesses/:id/documents
PATCH  /admin/businesses/:id/verify   body: { approved, notes? }
PATCH  /admin/businesses/:id/status   body: { is_blocked, reason? }
DELETE /admin/businesses/:id          body: { reason }
```

### Communities (`/communities`)
```
GET    /admin/communities/stats
GET    /admin/communities?search=&privacy=&sort_by=&page=&limit=
GET    /admin/communities/:id
DELETE /admin/communities/:id         body: { reason }
```

### Events (`/events`)
```
GET    /admin/events/stats
GET    /admin/events?search=&privacy=&status=&sort_by=&page=&limit=
GET    /admin/events/:id
GET    /admin/events/:id/attendees
PATCH  /admin/events/:id/cancel       body: { reason? }
DELETE /admin/events/:id              body: { reason }
```

### Posts (`/posts`)
```
GET    /admin/posts/stats
GET    /admin/posts?search=&community_id=&media=&sort_by=&page=&limit=
GET    /admin/posts/:id
DELETE /admin/posts/:id               body: { reason }
```

### Chats (`/chats`)
```
GET    /admin/chats/stats
GET    /admin/chats?search=&status=&page=&limit=
GET    /admin/chats/:id
GET    /admin/chats/:id/messages?page=&limit=
DELETE /admin/chats/:id               body: { reason }
```

### Ad Management (`/ad-management`)
Reuses `/admin/approvals/ads/*` endpoints. The page splits ACCEPTED ads into "Active" vs "Upcoming" client-side based on `schedule.start`.

### Jobs (`/job-management`)
```
GET    /admin/jobs/stats
GET    /admin/jobs?search=&status=&type=&sort_by=&page=&limit=
GET    /admin/jobs/:id
GET    /admin/jobs/:id/applications
PATCH  /admin/jobs/:id/status         body: { status: 'ACTIVE'|'CLOSED'|'PAST', reason? }
DELETE /admin/jobs/:id                body: { reason }
```

### Matching Engine (`/matching-engine`)
```
GET    /admin/matching/stats
GET    /admin/matching/users?search=&account_type=&preferences_set=&page=&limit=
GET    /admin/matching/users/:id/preferences
GET    /admin/matching/weights
PUT    /admin/matching/weights        body: { weights: [{ question_id, weight }] }
```
Updating weights reloads the in-memory scorer immediately.

### Geofencing (`/geofencing`)
```
GET    /admin/geofencing/stats
GET    /admin/geofencing/top-locations?limit=10
GET    /admin/geofencing/users?search=&account_type=&has_location=&city=&state=&page=&limit=
```

### Notifications (`/notifications`)
```
GET    /admin/notifications/stats
GET    /admin/notifications?search=&screen_name=&is_admin=&page=&limit=
POST   /admin/notifications/send      body: { title, message, recipients, specific_user_ids?, screen_name?, metadata? }
DELETE /admin/notifications/:id
```
Broadcast iterates recipients in batches of 10, calls FCM for each, writes a `notifications` row, then marks all created rows with `is_admin=true`.

### Reports (`/report-management`)
```
GET    /admin/reports/stats
GET    /admin/reports?search=&reason=&page=&limit=
GET    /admin/reports/:id
DELETE /admin/reports/:id             body: { reason }    (resolving = deleting the row)
```

### System Settings (`/system-settings`)
```
GET    /admin/settings
GET    /admin/settings/terms          PUT body: { content }
GET    /admin/settings/privacy        PUT body: { content }
GET    /admin/settings/about          PUT body: { content }
```
PUT upserts the latest row in each table.

---

## Frontend structure

```
src/
├── app/
│   ├── layout.tsx                    Root: wraps ReduxProvider
│   ├── page.tsx                      Redirects to /login
│   ├── (auth)/login/page.tsx
│   └── (admin)/
│       ├── layout.tsx                Sidebar + Header + AuthGate
│       └── [18 page.tsx files]
├── components/
│   ├── layout/
│   │   ├── AuthGate.tsx              Token check + /me hydration
│   │   ├── Header.tsx                Admin name + API Docs + Logout
│   │   ├── Sidebar.tsx
│   │   └── UserAvatar.tsx            Initials on green badge
│   └── ui/                           15 shadcn/ui components
├── constants/navigation.ts
├── hooks/use-mobile.ts
├── lib/
│   ├── api/client.ts                 axios + token storage helpers
│   ├── format.ts                     Shared formatDate/extractError
│   └── utils.ts                      cn()
├── providers/ReduxProvider.tsx
├── store/
│   ├── index.ts                      configureStore
│   ├── hooks.ts                      Typed useAppDispatch/useAppSelector
│   ├── slices/authSlice.ts           Admin UI state
│   └── api/
│       ├── baseApi.ts                createApi + auto-refresh on 401
│       ├── authApi.ts
│       └── [14 feature slices]
└── styles/globals.css
```

---

## Backend structure (admin panel additions)

```
src/api/v1/
├── routers/admin/
│   ├── index.js                      Mounts 16 sub-routers + audit_log middleware
│   ├── auth/
│   ├── dashboard/
│   ├── admins/
│   ├── approvals/
│   ├── users/
│   ├── businesses/
│   ├── communities/
│   ├── events/
│   ├── posts/
│   ├── chats/
│   ├── jobs/
│   ├── matching/
│   ├── geofencing/
│   ├── notifications/
│   ├── reports/
│   └── settings/
├── controllers/admin/[16 subfolders]
├── services/admin/[16 subfolders]
├── validations/admin/[16 subfolders]
├── dto/admin/[*.dto.js per feature]
├── middlewares/
│   └── audit_log.middleware.js       Captures mutations → logs/audit.log
└── swagger/
    ├── index.js                      Serves /api/v1/docs
    └── admin/[16 *.js spec files]
```

---

## Environment variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8089/api/v1
```

### Backend (`.env`)
```
DATABASE_URL=mysql://user:pass@host:3306/ccc
PORT=8089
JWT_SECRET_KEY=<strong random secret — DO NOT use default placeholder>
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://admin.ccc.com   # optional, defaults to *
GMAIL_ACCOUNT_EMAIL=...
BUCKET_NAME=ccc-backend
BUCKET_REGION=us-east-2
ACCESS_KEY_ID=...
SECRET_ACCESS_KEY=...
S3_ACCESS_URL=https://ccc-backend.s3.us-east-2.amazonaws.com
STRIPE_SECRET_KEY=...
```

---

## Audit log

All admin mutations (POST/PATCH/PUT/DELETE) are logged to `logs/audit.log` as JSON Lines:
```json
{"level":"info","admin_id":"...","admin_email":"...","method":"PATCH","url":"/api/v1/admin/users/.../status","target_id":"...","reason":"Spam","status_code":200,"success":true,"timestamp":"..."}
```
Rotates at 10MB, keeps the last 10. **Production should swap this for a DB-backed `audit_log` table** for queryability — see middleware source.

---

## Known limitations

See the development team for the complete list of features that require schema migrations (Promo Codes, Business Claims, Community Approvals, Reports status/severity, role tiers, etc.).
