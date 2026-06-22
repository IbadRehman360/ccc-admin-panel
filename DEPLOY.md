# Deployment Guide — CCC Admin Panel

This document covers deploying both:
- **Backend**: `ccc-webservices` (Node.js + Express + Prisma + MySQL)
- **Frontend**: `ccc-admin-application` (Next.js 15 + RTK Query)

The same production MySQL database is shared with the mobile app.

---

## 🔴 Must-do before going live

### 1. Code-side cleanup

| Task | Where | What |
|---|---|---|
| Remove dev login prefill | `src/app/(auth)/login/page.tsx` lines 23-24 | Change defaults from `'admin@ro.com'` / `'Test1234!'` back to empty strings |
| Delete any test seed rows | DB | See "Cleanup test data" section below |
| Commit + push both repos | `ccc-webservices` and `ccc-admin-application` | `git add . && git commit -m "deploy" && git push` |

### 2. Backend `.env` (production server)

```env
# CRITICAL — change these from placeholder/dev values
JWT_SECRET_KEY=<strong-64-char-random-string>
CORS_ALLOWED_ORIGINS=https://admin.yourcompany.com

# Existing — verify these match production
DATABASE_URL=mysql://user:pass@host:3306/ccc
PORT=8089
BUCKET_NAME=ccc-backend
BUCKET_REGION=us-east-2
ACCESS_KEY_ID=...
SECRET_ACCESS_KEY=...
S3_ACCESS_URL=https://ccc-backend.s3.us-east-2.amazonaws.com
STRIPE_SECRET_KEY=...
GMAIL_ACCOUNT_EMAIL=...
NEWS_RAPID_API=...
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> ⚠️ **Rotating `JWT_SECRET_KEY` invalidates every existing mobile app session** — all users must re-login. Coordinate with the mobile team / customer support before deploy.

> ⚠️ `CORS_ALLOWED_ORIGINS` is a comma-separated list. **No trailing slash. Include `https://` prefix.** Without your admin domain here, the admin panel can't talk to the backend.

### 3. Frontend `.env.local` (build time)

```env
NEXT_PUBLIC_API_URL=https://api.yourcompany.com/api/v1
```

Note the `/api/v1` suffix — the frontend appends paths like `/admin/auth/login` to this.

### 4. Process manager for backend

**Option A — PM2 (simplest):**
```bash
npm install -g pm2
cd ccc-webservices
yarn install --production
pm2 start src/server.js --name ccc-api
pm2 save
pm2 startup   # follow the printed command so it restarts on server reboot
```

**Option B — Docker:** Write a `Dockerfile`, build, deploy through your normal container pipeline.

**Option C — systemd:** Create a unit file at `/etc/systemd/system/ccc-api.service`.

### 5. HTTPS / reverse proxy

Backend listens on `:8089` HTTP. **Don't expose that port publicly.**
Put nginx, Caddy, or Cloudflare in front for TLS termination.

Example nginx:
```nginx
server {
    server_name api.yourcompany.com;
    listen 443 ssl http2;
    # ... ssl certs (Let's Encrypt via certbot) ...

    location / {
        proxy_pass http://localhost:8089;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Frontend hosting

| Platform | Effort | Notes |
|---|---|---|
| **Vercel** | 5 min — `vercel deploy` | Easiest. Made by Next.js team. Free tier covers low traffic. |
| **Netlify** | 5 min | Similar to Vercel. |
| **Your own server** (PM2 + nginx) | 30 min | Run `yarn build` then `yarn start` (Next.js production server). |

> ⚠️ **Static export will NOT work** — the app uses dynamic routes and server features. You need a Node-capable host.

---

## 🟠 Should-do for safety

| Task | Effort | Why |
|---|---|---|
| **Database backups** | 1 hour setup | AWS RDS automated backups — verify enabled, retain ≥7 days. |
| **Error monitoring (Sentry)** | 1 hour | Free tier. Know about errors before users complain. |
| **Uptime monitoring** | 5 min | UptimeRobot free → pings `/api/v1/` every 5 min, emails on outage. |
| **Audit log destination** | 5 min | Backend writes to `logs/audit.log` (rotates at 10MB, 10 files). For long-term audit, pipe to CloudWatch or DB. |
| **Promote SUPER_ADMIN(s)** | SQL | Decide who gets the highest tier. See "Admin user setup" below. |
| **Test password reset flow** | 5 min | Verify existing admins know their passwords or can reset them. |

---

## 🟡 Nice-to-have (post-launch)

| Task | When |
|---|---|
| CI/CD pipeline (GitHub Actions) | Once you have 2+ deploys/week |
| Staging environment | Before any major feature rollout |
| httpOnly cookie auth (replace localStorage) | Q2 hardening |
| Redis cache (Dashboard speed) | If Dashboard load > 2s annoys users |
| Automated tests | Add per bug-fix |
| Audit log → DB table | When you need queryable audit (compliance) |
| Polygon zone editor (Google Maps drawing widget) | Geofencing v2 |
| User Analytics event-tracking SDK | Implement Firebase Analytics in mobile, add backend ingest |

---

## 🚀 First-deploy runbook

Run in this exact order:

```bash
# ── 1. On your dev machine — commit + push ──
cd ccc-webservices
git add . && git commit -m "deploy: schema migrations + admin features" && git push

cd ../ccc-admin-application
git add . && git commit -m "deploy: admin panel v1" && git push


# ── 2. SSH to backend server ──
ssh user@api.yourcompany.com
cd /var/www/ccc-webservices       # or wherever
git pull
yarn install --production

# Edit .env with prod values (JWT_SECRET_KEY, CORS_ALLOWED_ORIGINS, etc.)
nano .env

# Migrations were already applied to the live DB during development.
# If deploying to a fresh DB, run them now:
#   npx prisma db execute --schema src/api/v1/prisma/schema.prisma --file src/api/v1/prisma/migrations/20260615152231_admin_panel_features/migration.sql
#   ... (repeat for each migration in chronological order)

pm2 restart ccc-api || pm2 start src/server.js --name ccc-api
pm2 save


# ── 3. Smoke test backend ──
curl https://api.yourcompany.com/api/v1/
# Expect: "server working of v1 router -- CCC"


# ── 4. Deploy frontend ──
# Vercel:
cd ccc-admin-application
vercel --prod

# OR self-hosting:
ssh user@admin.yourcompany.com
cd /var/www/ccc-admin-application
git pull
yarn install
yarn build
pm2 restart ccc-admin || pm2 start "yarn start" --name ccc-admin


# ── 5. Smoke test frontend ──
# Open https://admin.yourcompany.com/login in a real browser (Chrome/Firefox,
# NOT VS Code embedded preview — that blocks localStorage).
# Log in → confirm no console errors → click through each sidebar page.


# ── 6. Tell mobile team (if JWT secret was rotated) ──
# All mobile users will see "Session expired" and must re-login.
# Push a support / in-app notice if needed.
```

---

## Admin user setup

After first deploy, you need at least one SUPER_ADMIN. The first one must be created via DB (no signup endpoint).

### Create the first SUPER_ADMIN
```bash
cd ccc-webservices
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const email = 'you@yourcompany.com';      // ← CHANGE
  const password = 'PickAStrongOne!';        // ← CHANGE
  const full_name = 'Your Name';             // ← CHANGE

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      user_type: 'ADMIN',
      admin_role: 'SUPER_ADMIN',
      account_type: 'EMAIL',
      is_email_verified: true,
      user_secrets: { create: { password: hash, otp_expiration: new Date() } },
      user_details: { create: { full_name } },
    },
  });
  console.log('Created:', user.email);
})();
"
```

> ⚠️ The admin login uses a different hash format than mobile users. Admin login hashes JUST `password`, mobile login hashes `password + email`. The script above is for **admin** accounts.

### Promote an existing user to SUPER_ADMIN
```sql
UPDATE users SET admin_role='SUPER_ADMIN' WHERE email='someone@yourcompany.com';
```

### Subsequent admins
Once a SUPER_ADMIN is logged in, they can create more admins via the **Admin Management** page in the admin panel.

---

## Role tiers

The admin panel has 3 tiers (enforced server-side):

| Role | Can do |
|---|---|
| **SUPER_ADMIN** | Everything. Including managing other admins (create, edit role, delete). |
| **ADMIN** | Moderate users/businesses/posts/communities/ads/jobs. Approve claims. Broadcast notifications. Cannot manage other admins. |
| **MODERATOR** | Read-only + soft moderation (flag, mark reviewed). Cannot suspend/delete. |

Existing admins all default to `ADMIN` tier (safe default — they keep working without being able to touch other admin accounts).

---

## Cleanup test data

If you have leftover test rows from development:

```sql
-- Remove fake PENDING business submissions
DELETE FROM business_information
WHERE review_status='PENDING'
  AND name LIKE '%Test Pending%' OR name LIKE '%Sample Pending%' OR name LIKE '%Demo Pending%';

-- Remove fake PENDING communities
DELETE FROM community
WHERE status='PENDING'
  AND (community_name LIKE '%Test Pending%' OR community_name LIKE '%Sample Pending%');

-- Remove the demo news article (if not used)
DELETE FROM news_article
WHERE title LIKE 'CCC Welcomes Diverse Healthcare%';
```

---

## Health checks

| Endpoint | Expected | Purpose |
|---|---|---|
| `GET https://api.yourcompany.com/api/v1/` | `200 OK` body `"server working of v1 router -- CCC"` | Uptime monitor target |
| `GET https://api.yourcompany.com/api/v1/docs` | Swagger UI loads | API docs reachable |
| `POST https://api.yourcompany.com/api/v1/admin/auth/login` (with valid creds) | `200 OK` with `access_token` | Auth working |

---

## Top 3 things people forget

1. **JWT_SECRET_KEY rotation logs out every mobile user.** Coordinate timing or accept the support spike.
2. **`CORS_ALLOWED_ORIGINS` without your domain = admin panel can't talk to backend.** No trailing slash. Include `https://`.
3. **Backend on prod still runs OLD code until you deploy.** Migrations are applied to the DB, but admin features return 404 until backend is updated.

---

## Rolling back

If something goes wrong:

```bash
# Backend
cd ccc-webservices
git revert HEAD                    # OR git reset --hard <previous-commit>
git push
pm2 restart ccc-api

# Frontend (Vercel)
vercel rollback                    # rolls back to previous deployment

# Schema changes (additive only)
# All our migrations were ADDITIVE — adding columns/tables. They don't break old code.
# Old backend code ignores new columns. No rollback needed for schema.
# If you really need to remove the columns, see each migration's README for the DROP statements.
```

---

## What we added (summary for context)

**5 schema migrations** (already applied to prod DB during development):
1. `20260615152231_admin_panel_features` — admin roles, community/post/report status, jobs SUSPENDED
2. `20260616153100_news_articles` — `news_article` table
3. `20260617090500_geofence_zones` — `geofence_zone` table
4. `20260618070000_business_review_workflow` — `business_information.review_status`
5. `20260618210000_news_article_content` — `news_article.content` rich body

**9 admin features:**
- Community approval workflow
- Admin role tiers (SUPER_ADMIN / ADMIN / MODERATOR)
- Reports moderation (status, severity, admin notes, action taken)
- Posts soft-remove + flag
- Jobs SUSPENDED state
- Chat warn / admin-block
- Geofence zones (define + spatial query + broadcast)
- News articles (full CRUD + merged into mobile feed)
- Business Claims (review of mobile business signups)

**Security hardening:**
- Helmet security headers
- Rate limiting (300/min general, 10/15min on auth)
- File-based audit log (`logs/audit.log`)
- Auto-refresh on 401
- CORS env-driven
- Next.js 15.5.19 (zero vulnerabilities — `yarn audit` clean)
