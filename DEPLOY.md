# CCC Admin Panel — Deployment Guide

**Project Name:** Culture Currency Connection (CCC) — Admin Panel
**Repos:**
- Frontend: `ccc-admin-application`
- Backend: `ccc-webservices` (already deployed at `https://api.culturecurrencyconnection.com`)

**Audience:** DevOps / deployment engineer
**Reads from:** the same MySQL DB used by the mobile app — do NOT recreate or re-seed.

---

## Section 1 — Required third-party services / credentials

For the admin panel **alone**, you need:

| # | Service / Resource | Purpose | Where it goes |
|---|---|---|---|
| 1 | **EC2 / VPS instance (Linux)** | Hosts the Next.js admin panel | New instance, separate from backend |
| 2 | **Domain + subdomain** (e.g. `admin.culturecurrencyconnection.com`) | Public URL for admins | DNS A record → admin EC2 IP |
| 3 | **SSL certificate** (Let's Encrypt) | HTTPS for the admin domain | nginx (or Cloudflare proxy) |

For the backend (already deployed) one config change is needed — see Section 5.

**No new third-party services needed.** The admin panel reuses everything the backend + mobile app already use (MySQL, S3, Firebase, Stripe, etc.).

---

## Section 2 — Stack & system requirements

### Admin panel server

| | Value |
|---|---|
| **Framework** | Next.js 15.5.19 (App Router) + React 18.3 + TypeScript |
| **Node.js** | ≥18.17 (recommend 20 LTS) |
| **Package manager** | yarn |
| **OS** | Ubuntu 22.04 LTS or any modern Linux |
| **RAM** | Minimum 1 GB, recommended 2 GB |
| **Disk** | Minimum 5 GB free (node_modules + .next ≈ 1.5 GB) |
| **Internal port** | 3000 (Next.js default) — DO NOT expose publicly |
| **Public ports** | 80 (HTTP redirect), 443 (HTTPS) inbound only |
| **Reverse proxy** | nginx (recommended) or Caddy |

### Backend server (already deployed — no change to stack)

| | Value |
|---|---|
| **Framework** | Node.js + Express 4 + Prisma 5 |
| **Database** | MySQL (AWS RDS) — schema already migrated |
| **Internal port** | 8089 |
| **Public URL** | `https://api.culturecurrencyconnection.com` |

---

## Section 3 — Environment variables (purpose of each)

### 3.1 — Admin panel (`ccc-admin-application/.env.production`)

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the admin panel calls for ALL API requests. Must include `/api/v1` suffix. Baked into the JS bundle at build time. | `https://api.culturecurrencyconnection.com/api/v1` |

That's it for the admin panel — only one env var. **No secrets in the admin panel** (all `NEXT_PUBLIC_*` values are visible to anyone who opens DevTools).

### 3.2 — Backend (`ccc-webservices/.env`) — one update needed

The backend `.env` already exists on the server. You only need to ADD or UPDATE these two lines:

| Variable | Purpose | Value to set |
|---|---|---|
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of origins allowed to call the API with credentials. Without this, browsers block the admin panel. Defaults to `*` (open) if unset — must be locked down for production. | `https://admin.culturecurrencyconnection.com` |
| `JWT_SECRET_KEY` | Signing secret for JWTs. Must be a long random string. Currently set to the literal placeholder `"JWT_SECRET_KEY"` — MUST be rotated before going public. | A 64-char hex string. Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

⚠️ **Rotating `JWT_SECRET_KEY` invalidates every active mobile app session.** Users will be force-logged-out. Coordinate timing with the mobile team / customer support before doing this.

### 3.3 — All other backend variables (already set, no change needed)

For reference, the backend `.env` also contains:

| Variable | Purpose |
|---|---|
| `BACKEND_DOMAIN` | Backend's own public URL (used for callbacks) |
| `FRONTEND_DOMAIN` | Currently empty — not used |
| `PORT` | Backend listens on this port (8089) |
| `DATABASE_URL` | MySQL connection string |
| `COLLEGESCORECARD_SECRECT` | College Scorecard API key (US education data) |
| `RAPID_API_SECRET` | RapidAPI key (used for some external lookups) |
| `YELP_KEY` | Yelp API key (business data enrichment) |
| `PLATFORM_CHARGES` | Stripe platform fee percentage (0.2 = 20%) |
| `BUCKET_NAME`, `S3_ACCESS_URL` | S3 config for media uploads |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK` | Stripe payment processing |
| `FIREBASE_AUTH` | Path to Firebase service account JSON for FCM |
| `GMAIL_ACCOUNT_EMAIL`, `GMAIL_ACCOUNT_PASSWORD` | SMTP credentials for system emails (OTP, password reset, notifications) |
| `OPEN_AI_MISTRAL_KEY`, `OPEN_AI_URL`, `OPENROUTER_API_URL` | LLM API for chat-bot feature |
| `AWS_LAMBDA_PREFERENCE` | ARN of Lambda triggered for user preference updates |
| `NEWS_RAPID_API` | RapidAPI key for news article fetching (mobile home feed) |
| `GOOGLE_API_KEY` | Google Maps Geocoding / Places API |
| `SQS_QUEUE_URL`, `SQS_PERSONA_URL` | SQS queues for async location updates and persona analysis |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS` | Redis cache config (currently optional) |
| `PREFERENCE_WEIGHT` | Matching algorithm tuning constant |

---

## Section 4 — Deployment steps (admin panel)

### Step 1 — Spin up server + install runtime

```bash
# On Ubuntu 22.04 EC2
sudo apt update
sudo apt install -y curl git build-essential nginx

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version    # should be v20.x
npm --version

# Install yarn + PM2 globally
sudo npm install -g yarn pm2
```

### Step 2 — Clone repo + install dependencies

```bash
cd /var/www                                                 # or wherever you host apps
sudo git clone <repo-url> ccc-admin-application
sudo chown -R $USER:$USER ccc-admin-application
cd ccc-admin-application
yarn install
```

### Step 3 — Configure environment

The repo already contains `.env.production` with:

```
NEXT_PUBLIC_API_URL=https://api.culturecurrencyconnection.com/api/v1
```

If your backend domain is different, edit this file before building.

### Step 4 — Build for production

```bash
yarn build       # creates .next/ folder (takes 30-60s)
```

### Step 5 — Run with PM2

```bash
pm2 start "yarn start" --name ccc-admin
pm2 save
pm2 startup      # follow the printed command to enable auto-start on reboot
```

Check it's listening on port 3000:
```bash
curl http://localhost:3000     # should return HTML
pm2 status                      # ccc-admin should be 'online'
```

### Step 6 — nginx reverse proxy + HTTPS

Create `/etc/nginx/sites-available/ccc-admin`:

```nginx
server {
    listen 80;
    server_name admin.culturecurrencyconnection.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.culturecurrencyconnection.com;

    # SSL certs added by certbot below

    client_max_body_size 25M;     # for any future file uploads

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable + reload:
```bash
sudo ln -s /etc/nginx/sites-available/ccc-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Get SSL cert (Let's Encrypt):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.culturecurrencyconnection.com
```

### Step 7 — DNS

Add an A record:
```
admin.culturecurrencyconnection.com  →  <admin EC2 public IP>
```

Wait for propagation (usually 1-5 min).

---

## Section 5 — Backend update (one-time, after admin panel deploy)

SSH to the backend server (`api.culturecurrencyconnection.com`):

```bash
cd /path/to/ccc-webservices
nano .env
```

Add/update these two lines:

```bash
CORS_ALLOWED_ORIGINS=https://admin.culturecurrencyconnection.com
JWT_SECRET_KEY=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
```

Restart:
```bash
pm2 restart ccc-api      # or: systemctl restart ccc-api / docker compose restart api
```

⚠️ Confirm with mobile team BEFORE rotating `JWT_SECRET_KEY` — it logs out all mobile users.

---

## Section 6 — Post-deploy verification

### 6.1 — Smoke test

1. Open `https://admin.culturecurrencyconnection.com/login` in **Chrome or full Edge** (NOT VS Code embedded preview — it blocks localStorage)
2. Log in with the SUPER_ADMIN account
3. Confirm Dashboard loads with real numbers
4. Click through 3-5 sidebar pages → no console errors in DevTools
5. Click "API Docs" link in the header → Swagger UI opens at `https://api.culturecurrencyconnection.com/api/v1/docs`

### 6.2 — Health endpoints

| URL | Expected |
|---|---|
| `https://admin.culturecurrencyconnection.com/login` | HTML page loads |
| `https://api.culturecurrencyconnection.com/api/v1/` | `200 OK` text body `"server working of v1 router -- CCC"` |
| `https://api.culturecurrencyconnection.com/api/v1/docs` | Swagger UI loads |

### 6.3 — Create the first SUPER_ADMIN

If the production DB doesn't have an admin user yet, run this ONCE on the backend server:

```bash
cd /path/to/ccc-webservices
node -e "
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const email = 'admin@culturecurrencyconnection.com';   // ← change
  const password = 'PickAStrongOne!';                     // ← change
  const full_name = 'Admin User';                         // ← change
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

Note: Admin login hashes `password` only. Mobile login hashes `password + email`. Different paths — admin script above is correct for admin login.

---

## Section 7 — Updates after deployment (URLs to configure)

| What | Where | Set to |
|---|---|---|
| Admin panel `NEXT_PUBLIC_API_URL` | `.env.production` in admin repo (or platform env var) | `https://api.culturecurrencyconnection.com/api/v1` |
| Backend `CORS_ALLOWED_ORIGINS` | `.env` on backend server | `https://admin.culturecurrencyconnection.com` |
| Backend `JWT_SECRET_KEY` | `.env` on backend server | strong random string |
| DNS A record | DNS provider | admin domain → EC2 IP |

---

## Section 8 — Common operations

### Restart admin panel after code update
```bash
cd /var/www/ccc-admin-application
git pull
yarn install              # if any new deps
yarn build                # rebuild
pm2 restart ccc-admin
```

### View admin panel logs
```bash
pm2 logs ccc-admin --lines 100
```

### Restart backend after .env change
```bash
pm2 restart ccc-api
```

### Roll back admin panel to previous commit
```bash
cd /var/www/ccc-admin-application
git log --oneline -5            # find the previous commit
git reset --hard <commit-hash>
yarn install && yarn build
pm2 restart ccc-admin
```

---

## Section 9 — Top 3 gotchas

1. **`CORS_ALLOWED_ORIGINS` without `https://` prefix or with trailing slash = admin can't talk to backend.** Browser DevTools console will scream "CORS error" on every request.

2. **Rotating `JWT_SECRET_KEY` logs out every mobile user.** They'll need to re-login. Coordinate with the mobile team beforehand.

3. **VS Code's embedded Simple Browser blocks localStorage.** Login appears to fail silently — no network requests fire. Always test in a real Chrome/Edge window.

---

## Section 10 — Estimated deployment time

| Step | Time |
|---|---|
| Section 4 (EC2 setup + nginx + Let's Encrypt + DNS) | ~1 hour |
| Section 5 (backend `.env` update) | 5 min |
| Section 6 (smoke test + create admin) | 15 min |
| **Total** | **~1.5 hours** |

---

## Section 11 — Quick reference

- **Admin panel codebase guide:** [`CLAUDE.md`](./CLAUDE.md)
- **Live API docs (after backend deploy):** `https://api.culturecurrencyconnection.com/api/v1/docs`
- **Mobile app does NOT need any change** — all admin-side filtering happens server-side
- **5 schema migrations** were applied during development; production DB is already migrated. If deploying to a fresh DB, see `ccc-webservices/src/api/v1/prisma/migrations/`.

---

## Contact

For questions during deployment, contact the dev team in the project group with:
- Section number you're stuck on
- Exact error message (screenshot or copy-paste)
- Output of `pm2 logs` (last 50 lines)
