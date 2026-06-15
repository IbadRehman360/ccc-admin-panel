# CCC Admin Panel — What's Left

What works today, what needs decisions from you (the client), and what's on our pre-production checklist.

---

## ✅ What's working now

**18 sidebar pages wired to real backend**, reading live data from your existing MySQL database:

Dashboard · Admin Management · Pending Approvals (Ads) · Users · Businesses · Communities · Events · Posts · Chats · Ads · Jobs · Matching Engine · Geofencing · Notifications · Reports · System Settings · User Analytics

All admin actions (suspend, verify, approve, delete, broadcast, etc.) are functional. **Every action is logged to an audit file** for compliance.

---

## 🔴 Needs your decision — new database changes required

The 11 features below were not in the existing mobile app schema, so we need to add new tables/columns to support them. **Please prioritize:** which ones do you need, and in what order?

Each item lists the rough effort (backend dev work + database migration + frontend wiring).

| # | Feature | Effort | What's needed |
|---|---|---|---|
| 1 | **Promo Codes** | ~3 days | New `promo_code` table (influencer info, discount, usage, expiry) |
| 2 | **Business ownership claims** | ~4 days | New `business_claim` table (claimant, docs, status, workflow) — affects Pending Approvals tab + Claim Management page |
| 3 | **Community approval workflow** | ~1.5 days | Add status field to communities so admins approve them before they go live |
| 4 | **Admin role tiers + permissions** | ~3 days | Super Admin vs Admin vs Moderator with per-feature permissions. Today everyone with admin access can do everything. |
| 5 | **Reports: severity, status, admin notes** | ~1.5 days | Make Reports page useful — currently can only delete a report, not mark it "Reviewed" or note what action was taken |
| 6 | **Posts: remove/flag without hard delete** | ~1.5 days | Soft-remove posts and track flagged ones; today only hard delete works |
| 7 | **Jobs: Suspended state** | 2 hours | One enum value added; can suspend instead of close |
| 8 | **Chat moderation: admin warn/block** | ~1.5 days | Currently must suspend the user via User Management — no warn-only option |
| 9 | **Geofence zones + iOS/Android split** | ~3 days | Define geofence polygons + see permission state by device type |
| 10 | **User Analytics: retention, demographics, hourly activity** | ~5 days | Requires event-tracking instrumentation across the mobile app |
| 11 | **News articles management** | ~3 days | New `news_article` table |

**Total if all 11 done**: ~30 dev days. Most projects pick 3-5 of these for v1.

---

## 🟠 Pre-production checklist (our side — not waiting on you)

These are things our team will handle before going live. Listed for transparency.

### Must do before public launch
- **Rotate JWT secret** — currently a placeholder. Rotating logs out all mobile users, so we'll coordinate with the mobile team.
- **Lock CORS to admin panel domain** — code is already set up to read from env var (`CORS_ALLOWED_ORIGINS`), just needs to be set during deploy.
- **Set up staging environment** + **CI pipeline** (lint + build + test on every PR)

### Should do for security
- Move token storage from localStorage to httpOnly cookies (reduces XSS risk) — ~1 day
- Add rate limiting on admin endpoints — ~0.5 day
- Add CSP / security headers — ~0.5 day

### Should do for performance
- Add Redis cache for slow Dashboard queries (currently ~3s due to DB being in AWS US-East) — ~1 day
- Consider DB region migration if your admin users are not US-based

### Should do for reliability
- Swap file-based audit log for a DB table (queryable, harder to lose) — ~0.5 day + small migration
- Build a starter automated test suite — ~3-5 days

---

## 📦 What we delivered

| | Count |
|---|---|
| Frontend pages wired to real backend | 18 |
| Frontend pages stubbed (waiting on schema) | 3 |
| Backend feature folders built (routes + controllers + services + validators + DTOs) | 16 |
| Swagger sections (interactive API docs) | 17 |
| Auto-refresh on token expiry | ✓ |
| File-based audit log | ✓ |
| CORS env-driven | ✓ |

---

## 📁 Reference

- **Frontend**: `ccc-admin-application/`
- **Backend**: `ccc-webservices/`
- **Technical spec**: `ccc-admin-application/CLAUDE.md`
- **API docs (live)**: `http://localhost:8089/api/v1/docs` — also linked from the admin panel header

---

**TL;DR for the client meeting:**
The admin panel is functionally complete and demoable. To finish it, you need to tell us which of the 11 schema-dependent features above to build (most projects do 3-5). Everything else (security, performance, deployment) is on our checklist and doesn't need your input.
