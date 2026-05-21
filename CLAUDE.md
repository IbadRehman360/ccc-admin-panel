# CCC Admin Panel — Backend Implementation Guide

This document covers everything a backend developer needs to implement the API for the CCC admin panel frontend.

---

## Tech Stack

- **Frontend**: Next.js 14.2.29 (App Router), React 18, TypeScript, Tailwind CSS v4
- **UI**: shadcn/ui + Radix UI, Lucide React icons, Recharts (charts)
- **Colors**: Primary `#195440` (dark green), Accent `#E1B047` (gold)
- **Dev server**: `npm run dev` | Build: `npm run build` | Start: `npm start`

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (imports globals.css)
│   ├── page.tsx                      # Redirects to /login
│   ├── (auth)/login/page.tsx         # Login page
│   └── (admin)/                      # All admin pages (protected)
│       ├── layout.tsx                # Admin shell (Sidebar + Header)
│       ├── dashboard/
│       ├── admin-management/
│       ├── pending-approvals/
│       ├── user-management/
│       ├── business-management/
│       ├── promo-codes/
│       ├── communities/
│       ├── events/
│       ├── posts/
│       ├── chats/
│       ├── ad-management/
│       ├── job-management/
│       ├── matching-engine/
│       ├── geofencing/
│       ├── notifications/
│       ├── report-management/
│       ├── claim-management/
│       ├── news/
│       ├── user-analytics/
│       └── system-settings/
├── components/
│   ├── layout/          # Header, Sidebar, UserAvatar
│   └── ui/              # 15 shadcn/ui components
├── constants/navigation.ts
├── data/userProfiles.ts
├── hooks/use-mobile.ts
├── lib/utils.ts         # cn() utility
├── styles/globals.css
└── types/index.ts       # TypeScript interfaces
```

---

## Authentication Flow

### Current (mock)
The login page at `/login` accepts any credentials and redirects to `/dashboard`. No real auth is implemented.

### Required Implementation
- **POST /api/auth/login** — returns JWT access token + refresh token
- **POST /api/auth/logout** — invalidates token
- **POST /api/auth/refresh** — refresh access token
- All admin API endpoints must require `Authorization: Bearer <token>` header
- The token payload should include: `{ id, name, email, role: 'Super Admin' | 'Admin' | 'Moderator' }`

### Role Permissions
| Role | Permissions |
|------|-------------|
| Super Admin | Full access — can manage admins, change system settings |
| Admin | All content management, cannot manage other admins |
| Moderator | Read + moderation actions only (reports, posts, chats) |

---

## All Pages & Required API Endpoints

### 1. Dashboard `/dashboard`

**Purpose**: Platform overview with statistics and charts.

**Data Required**:
- Platform stats (users, businesses, jobs, ads, reports)
- Time-series data for charts (daily/monthly users, ad performance, jobs)

**Endpoints**:
```
GET /api/dashboard/stats
Response: {
  totalUsers: number,
  activeUsers: number,
  inactiveUsers: number,
  totalBusinesses: number,
  verifiedBusinesses: number,
  unverifiedBusinesses: number,
  pendingApprovals: number,       // total claims + ads + communities pending
  pendingClaims: number,
  pendingAds: number,
  pendingCommunities: number,
  activeJobs: number,
  totalApplications: number,
  activeAds: number,
  totalImpressions: number,
  reportsCount: number,
  pendingReports: number
}

GET /api/dashboard/charts
Response: {
  dailyUsers: [{ date: string, users: number }],       // last 7 days
  monthlyUsers: [{ month: string, users: number }],    // last 5 months
  businessCategories: [{ category: string, count: number }],
  adsPerformance: [{ month: string, impressions: number, clicks: number }],
  jobsData: [{ month: string, postings: number, applications: number }]
}
```

---

### 2. User Management `/user-management`

**Purpose**: View, filter, suspend, and delete user accounts.

**Data Required**:
```typescript
User {
  id: string                              // "USR001"
  name: string
  email: string
  phone: string
  location: string
  profileStatus: 'Complete' | 'Incomplete'
  completion: number                      // 0-100
  status: 'Active' | 'Suspended' | 'Deleted'
  joinedDate: string                      // ISO date
  lastActive: string                      // relative "2 hours ago"
  lastActiveDate: string                  // "2026-02-19 10:30 AM"
  bio: string | null
  interests: string[]
  communityMemberships: number
  eventsAttended: number
  postsCreated: number
  businessOwned: string | null
  totalLogins: number
  averageSessionTime: string
  verificationStatus: 'Verified' | 'Partially Verified' | 'Pending Verification' | 'Unverified'
  idVerified: boolean
  addressVerified: boolean
  suspensionReason?: string
  suspendedDate?: string
  suspendedBy?: string
  documents: {
    name: string
    type: string                          // "Image" | "ID Verification" | "Address Verification" | "Business Verification" | "Professional Verification"
    status: 'Verified' | 'Pending Review' | 'Rejected'
    uploadDate: string
    fileUrl: string
    size: string
  }[]
}
```

**Endpoints**:
```
GET    /api/users?search=&status=&completion=&page=&limit=
GET    /api/users/:id
PUT    /api/users/:id/status      body: { status: 'Active' | 'Suspended', reason?: string }
DELETE /api/users/:id             body: { reason: string }
GET    /api/users/:id/documents
PUT    /api/users/:id/documents/:docId/status   body: { status: 'Verified' | 'Rejected' }
```

---

### 3. Business Management `/business-management`

**Purpose**: Manage and verify business listings.

**Data Required**:
```typescript
Business {
  id: string                              // "BUS001"
  name: string
  owner: string
  ownerEmail: string
  ownerPhone: string
  category: 'Healthcare' | 'Technology' | 'Education' | 'Retail' | 'Business Services' | string
  type: 'Diverse-Owned' | 'Corporation' | 'Healthcare' | 'Education' | string
  location: string
  address: string
  verified: boolean
  status: 'Active' | 'Pending' | 'Suspended' | 'Flagged'
  members: number
  followers: number
  rating: number
  totalReviews: number
  joinedDate: string
  lastActive: string
  description: string
  website: string
  businessHours: string
  employeeCount: string
  yearEstablished: number
  documents: {
    name: string
    status: 'Verified' | 'Pending Review' | 'Expired' | 'Missing' | 'Questionable' | 'Under Investigation' | 'Under Review'
    uploadDate: string | null
    fileUrl: string
  }[]
  verificationNotes: string
  lastVerificationDate: string | null
  verifiedBy: string | null
  suspensionReason?: string
  suspendedDate?: string
  suspendedBy?: string
  flagReason?: string
  flaggedDate?: string
  flaggedBy?: string
}
```

**Endpoints**:
```
GET  /api/businesses?search=&category=&type=&status=&sortBy=date|name|rating|members|verification&page=&limit=
GET  /api/businesses/:id
PUT  /api/businesses/:id/verify     body: { approved: boolean, notes?: string }
PUT  /api/businesses/:id/status     body: { status: 'Active' | 'Suspended' | 'Flagged', reason: string }
DELETE /api/businesses/:id          body: { reason: string }
```

---

### 4. Admin Management `/admin-management`

**Purpose**: Manage admin users — create, edit roles, activate/deactivate.

**Data Required**:
```typescript
AdminUser {
  id: number
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Moderator'
  status: 'Active' | 'Inactive'
  lastLogin: string
  createdDate: string
  permissions: string[]         // e.g. ['User Management', 'Business Management', 'Content Moderation']
  createdBy?: string
}
```

**Endpoints**:
```
GET    /api/admins
POST   /api/admins              body: { name, email, role, password, permissions[] }
GET    /api/admins/:id
PUT    /api/admins/:id          body: { name?, role?, permissions?, status? }
DELETE /api/admins/:id
PUT    /api/admins/:id/reset-password   body: { newPassword }
```

---

### 5. Pending Approvals `/pending-approvals`

**Purpose**: Three-tab approval workflow for Business Claims, Community Approvals, and Ad Approvals.

**Data Required**:

**Business Claims:**
```typescript
BusinessClaim {
  id: number
  type: 'Ownership Claim' | 'Business Registration'
  status: 'Pending' | 'Approved' | 'Rejected'
  submittedDate: string
  businessName: string
  businessCategory: string
  businessLocation: string
  claimantName: string
  claimantEmail: string
  claimantPhone: string
  relationship: string          // "Owner" | "Manager" etc.
  additionalNotes?: string
  documents: {
    name: string
    type: string
    uploadDate: string
    size: string
    status: 'Verified' | 'Pending Review'
  }[]
}
```

**Community Approvals:**
```typescript
Community {
  id: string
  name: string
  description: string
  category: string
  type: 'Public' | 'Private'
  owner: string
  ownerEmail: string
  memberCount: number
  requestDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  rules?: string
  tags?: string[]
}
```

**Ad Approvals:**
```typescript
PendingAd {
  id: string
  businessName: string
  adTitle: string
  adType: string
  budget: number
  duration: string
  targetAudience: string
  submittedDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  adImageUrl?: string
  description?: string
}
```

**Endpoints**:
```
GET  /api/approvals/claims?status=Pending&page=&limit=
GET  /api/approvals/claims/:id
PUT  /api/approvals/claims/:id      body: { status: 'Approved' | 'Rejected', notes?: string }

GET  /api/approvals/communities?status=Pending&page=&limit=
GET  /api/approvals/communities/:id
PUT  /api/approvals/communities/:id body: { status: 'Approved' | 'Rejected', notes?: string }

GET  /api/approvals/ads?status=Pending&page=&limit=
GET  /api/approvals/ads/:id
PUT  /api/approvals/ads/:id         body: { status: 'Approved' | 'Rejected', reason?: string }
```

---

### 6. Promo Codes `/promo-codes`

**Purpose**: Create and manage influencer/referral promo codes with performance tracking.

**Data Required**:
```typescript
PromoCode {
  id: string                              // "PC001"
  code: string                            // "SARAH2026"
  influencerName: string
  influencerEmail: string
  influencerPhone: string
  platform: string                        // "Instagram" | "YouTube" | "TikTok"
  followers: number
  discount: number
  discountType: 'percentage' | 'fixed'
  status: 'Active' | 'Inactive' | 'Expired'
  usageCount: number
  maxUsage: number
  expiryDate: string
  createdDate: string
  totalRevenue: number
  conversionRate: number
  performanceRating: 'Excellent' | 'Good' | 'Average' | 'Poor'
}
```

**Endpoints**:
```
GET    /api/promo-codes?search=&status=&page=&limit=
POST   /api/promo-codes        body: { code, influencerName, influencerEmail, discount, discountType, maxUsage, expiryDate }
GET    /api/promo-codes/:id
PUT    /api/promo-codes/:id    body: { status?, maxUsage?, expiryDate? }
DELETE /api/promo-codes/:id
GET    /api/promo-codes/:id/analytics
```

---

### 7. Communities `/communities`

**Purpose**: View and moderate community listings.

**Data Required**:
```typescript
Community {
  id: string
  name: string
  description: string
  category: string
  privacy: 'Public' | 'Private'
  owner: string
  memberCount: number
  postsCount: number
  eventsCount: number
  status: 'Active' | 'Suspended' | 'Pending'
  createdDate: string
  lastActive: string
}
```

**Endpoints**:
```
GET  /api/communities?search=&category=&privacy=&status=&page=&limit=
GET  /api/communities/:id
PUT  /api/communities/:id/status  body: { status: 'Active' | 'Suspended', reason?: string }
DELETE /api/communities/:id
```

---

### 8. Events `/events`

**Purpose**: Manage platform events with attendee details.

**Data Required**:
```typescript
Event {
  id: string
  title: string
  organizer: string
  organizerType: 'User' | 'Business' | 'Community'
  category: string
  privacy: 'Public' | 'Private'
  status: 'Upcoming' | 'Live' | 'Past' | 'Cancelled'
  date: string
  time: string
  location: string
  isOnline: boolean
  isFree: boolean
  price?: number
  goingCount: number
  maybeCount: number
  favoritesCount: number
  maxAttendees?: number
  description: string
  createdDate: string
  attendees: {
    id: string
    name: string
    status: 'Going' | 'Maybe' | 'Favorited'
    joinedDate: string
  }[]
}
```

**Endpoints**:
```
GET  /api/events?search=&privacy=&status=&sortBy=&page=&limit=
GET  /api/events/:id
PUT  /api/events/:id/status   body: { status: 'Cancelled', reason?: string }
DELETE /api/events/:id
GET  /api/events/:id/attendees
```

---

### 9. Posts `/posts`

**Purpose**: Content moderation — view posts, remove harmful content.

**Data Required**:
```typescript
Post {
  id: string
  author: string
  authorType: 'User' | 'Business'
  community: string
  content: string
  mediaType: 'Text' | 'Image' | 'Video'
  mediaUrl?: string
  likes: number
  comments: number
  shares: number
  status: 'Active' | 'Removed' | 'Flagged'
  createdDate: string
  reportCount: number
  isReported: boolean
  reportReasons?: string[]
}
```

**Endpoints**:
```
GET    /api/posts?search=&status=&reported=&page=&limit=
GET    /api/posts/:id
PUT    /api/posts/:id/status   body: { status: 'Removed' | 'Active', reason?: string }
DELETE /api/posts/:id
GET    /api/posts/reported     Returns posts with reportCount > 0
```

---

### 10. Chats `/chats`

**Purpose**: Review reported chat conversations, warn or block users.

**Data Required**:
```typescript
ChatReport {
  id: string
  reportedUser: string
  reportedBy: string
  reason: string
  status: 'Pending' | 'Reviewed' | 'Resolved' | 'Dismissed'
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  createdDate: string
  chatLog: {
    sender: string
    message: string
    timestamp: string
  }[]
}
```

**Endpoints**:
```
GET  /api/chats/reports?status=&severity=&page=&limit=
GET  /api/chats/reports/:id
PUT  /api/chats/reports/:id/status   body: { status: 'Reviewed' | 'Resolved' | 'Dismissed', action?: 'warn' | 'block', reason?: string }
POST /api/chats/reports/:id/warn     body: { userId, message }
POST /api/chats/reports/:id/block    body: { userId, reason, duration?: number }
```

---

### 11. Ad Management `/ad-management`

**Purpose**: 4-tab workflow: For Approval → Active → Upcoming → Rejected.

**Data Required**:
```typescript
Ad {
  id: string
  businessName: string
  businessId: string
  title: string
  type: 'Banner' | 'Sponsored Post' | 'Video' | 'Story'
  status: 'Pending' | 'Active' | 'Upcoming' | 'Rejected' | 'Paused' | 'Completed'
  budget: number
  spent?: number
  startDate: string
  endDate: string
  targetAudience: string
  impressions?: number
  clicks?: number
  ctr?: number                // click-through rate
  conversions?: number
  createdDate: string
  imageUrl?: string
  description?: string
  rejectionReason?: string
  rejectedDate?: string
  approvedBy?: string
  approvedDate?: string
}
```

**Endpoints**:
```
GET  /api/ads?status=&page=&limit=
GET  /api/ads/:id
PUT  /api/ads/:id/approve    body: { approvedBy: string }
PUT  /api/ads/:id/reject     body: { reason: string }
PUT  /api/ads/:id/pause
PUT  /api/ads/:id/resume
GET  /api/ads/:id/analytics
```

---

### 12. Job Management `/job-management`

**Purpose**: View job listings, suspend hiring.

**Data Required**:
```typescript
Job {
  id: string
  title: string
  business: string
  businessId: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote'
  salary: string                    // "80,000 - 100,000"
  applications: number
  status: 'Active' | 'Paused' | 'Closed' | 'Suspended'
  postedDate: string
  expiryDate: string
  description: string
  requirements: string[]
  benefits: string[]
  category: string
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive'
}
```

**Endpoints**:
```
GET  /api/jobs?search=&status=&type=&page=&limit=
GET  /api/jobs/:id
GET  /api/jobs/:id/applications
PUT  /api/jobs/:id/status   body: { status: 'Suspended' | 'Active', reason?: string }
DELETE /api/jobs/:id
```

---

### 13. Matching Engine `/matching-engine`

**Purpose**: View users with their preference data for the matching algorithm.

**Data Required**:
```typescript
UserWithPreferences {
  id: string
  name: string
  email: string
  phone: string
  accountType: 'User' | 'Business'
  profileCompletion: number
  preferencesSet: boolean
  preferencesCount: number
  preferences: {
    socialEnvironmental?: string    // e.g. "Climate Action"
    rightsAdvocacy?: string         // e.g. "LGBTQ+ Rights"
    culturalDemographic?: string    // e.g. "African American"
    lifestyle?: string              // e.g. "Vegan"
    business?: string               // e.g. "Small Business Owner"
    political?: string              // e.g. "Progressive"
    gunControl?: string             // e.g. "Stricter Laws"
  }
  joinedDate: string
  lastActive: string
  location: string
}
```

**Endpoints**:
```
GET  /api/matching/users?accountType=&preferencesSet=&page=&limit=
GET  /api/matching/users/:id/preferences
PUT  /api/matching/users/:id/preferences   body: { preferences: UserPreferences }
GET  /api/matching/config                   Returns matching algorithm configuration
PUT  /api/matching/config                   body: { weights, rules }
```

---

### 14. Geofencing `/geofencing`

**Purpose**: View users with location services enabled.

**Data Required**:
```typescript
GeofencingUser {
  id: string
  name: string
  email: string
  phone: string
  accountType: 'User' | 'Business'
  geofencingEnabled: boolean
  lastLocationUpdate: string
  deviceType: 'iOS' | 'Android'
  latitude?: number
  longitude?: number
  city?: string
  state?: string
  locationPermission: 'Always' | 'While Using' | 'Denied'
  joinedDate: string
}
```

**Endpoints**:
```
GET  /api/geofencing/users?deviceType=&permission=&enabled=&page=&limit=
GET  /api/geofencing/users/:id/location
PUT  /api/geofencing/users/:id/permission   body: { action: 'revoke' | 'notify' }
GET  /api/geofencing/zones                  Admin-defined geofence zones
POST /api/geofencing/zones                  body: { name, coordinates[], radius }
```

---

### 15. Notifications `/notifications`

**Purpose**: View notification logs and send new announcements.

**Data Required**:
```typescript
NotificationLog {
  id: string
  type: 'System' | 'Marketing' | 'Alert' | 'Event' | 'Announcement' | 'Reminder'
  title: string
  message: string
  recipients: string              // "All Users" | "Premium Users" | etc.
  recipientCount: number
  sent: string                    // ISO datetime
  status: 'Sent' | 'Failed' | 'Pending'
  deliveryRate?: number           // 0-100
  failureReason?: string
  sentBy: string
}

// For sending new notification:
SendNotification {
  type: string
  title: string
  message: string
  recipients: 'all' | 'users' | 'businesses' | 'premium' | 'free' | 'specific'
  specificUserIds?: string[]
  scheduledAt?: string            // optional — schedule for future
}
```

**Endpoints**:
```
GET  /api/notifications?type=&status=&page=&limit=
GET  /api/notifications/:id
POST /api/notifications/send   body: SendNotification
POST /api/notifications/:id/retry   Retry failed notification
DELETE /api/notifications/:id
```

---

### 16. Report Management `/report-management`

**Purpose**: Review user-generated reports with severity classification.

**Data Required**:
```typescript
Report {
  id: string
  type: 'User Report' | 'Business Report' | 'Post Report' | 'Chat Report' | 'Event Report'
  reportedBy: string
  reportedUser: string              // could be a user, business, or content ID
  reason: string
  status: 'Pending' | 'Reviewed' | 'Resolved' | 'Dismissed'
  createdDate: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  evidence?: string[]               // URLs to screenshots etc.
  adminNotes?: string
  resolvedBy?: string
  resolvedDate?: string
  actionTaken?: string
}
```

**Endpoints**:
```
GET  /api/reports?type=&status=&severity=&search=&page=&limit=
GET  /api/reports/:id
PUT  /api/reports/:id/status   body: { status: 'Reviewed' | 'Resolved' | 'Dismissed', actionTaken?: string, notes?: string }
DELETE /api/reports/:id
```

---

### 17. Claim Management `/claim-management`

**Purpose**: Quick overview of business ownership claims with approve/reject.

**Data Required**: Same as Pending Approvals → Business Claims (see section 5).

**Endpoints**:
```
GET  /api/claims?status=Pending&page=&limit=
GET  /api/claims/:id
PUT  /api/claims/:id        body: { status: 'Approved' | 'Rejected', notes?: string }
```

---

### 18. News `/news`

**Purpose**: Manage news/content articles displayed in the platform feed.

**Data Required**:
```typescript
NewsArticle {
  id: string
  title: string
  category: string                  // "Technology" | "Healthcare" | "Business" | "Education" | string
  source: string                    // "TechCrunch" | "BBC" | etc.
  author: string
  publishedDate: string
  status: 'Published' | 'Draft' | 'Archived' | 'Flagged'
  views: number
  likes: number
  comments: number
  shares: number
  imageUrl?: string
  summary: string
  contentUrl: string                // external article URL
  tags: string[]
  isFeatured: boolean
}
```

**Endpoints**:
```
GET    /api/news?search=&category=&status=&page=&limit=
GET    /api/news/:id
POST   /api/news             body: { title, category, source, contentUrl, imageUrl?, isFeatured }
PUT    /api/news/:id/status  body: { status: 'Published' | 'Archived' | 'Flagged' }
PUT    /api/news/:id/feature body: { isFeatured: boolean }
DELETE /api/news/:id
```

---

### 19. User Analytics `/user-analytics`

**Purpose**: Detailed analytics view for user growth, retention, and behaviour.

**Endpoints**:
```
GET /api/analytics/users?period=7d|30d|90d|1y
Response: {
  totalUsers: number,
  newUsers: number,
  activeUsers: number,
  churnRate: number,
  avgSessionTime: string,
  topLocations: { city: string, count: number }[],
  deviceBreakdown: { iOS: number, Android: number, Web: number },
  registrationTrend: { date: string, count: number }[],
  retentionRate: { week: string, rate: number }[],
  guestToRegistered: { date: string, guests: number, registered: number, conversionRate: number }[]
}
```

---

### 20. System Settings `/system-settings`

**Purpose**: Manage platform legal content — Terms & Conditions, Privacy Policy, About Us.

**Data Required**:
```typescript
SystemSettings {
  terms: {
    content: string               // full markdown/plain text
    lastUpdated: string
    updatedBy: string
    version: string
  }
  privacy: {
    content: string
    lastUpdated: string
    updatedBy: string
    version: string
  }
  about: {
    content: string
    lastUpdated: string
    updatedBy: string
    version: string
  }
}
```

**Endpoints**:
```
GET  /api/settings
GET  /api/settings/terms
PUT  /api/settings/terms    body: { content: string }
GET  /api/settings/privacy
PUT  /api/settings/privacy  body: { content: string }
GET  /api/settings/about
PUT  /api/settings/about    body: { content: string }
```

---

## Standard API Conventions

### Base URL
```
https://api.ccc.com/v1   (production)
http://localhost:8000/api (development)
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Pagination (all list endpoints)
```
Query params: ?page=1&limit=20
Response wrapper: {
  data: T[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Common HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

---

## State Management Approach (Frontend)

The current frontend uses **React `useState`** for all local component state. No global state manager is in use yet.

When integrating the API, the recommended approach is:
- **React Query (TanStack Query)** for server state (fetching, caching, mutations)
- Keep `useState` for UI-only state (modal open/closed, form inputs, selected filters)

Each page currently stores its mock data in the component file. These arrays should be replaced with API calls using `useQuery` / `useMutation`.

---

## Environment Variables Needed

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=CCC Admin Panel
```

---

## Notes for Backend Developer

1. **All admin pages are client components** (`'use client'`) — CORS must be configured to allow `http://localhost:3000` in development.

2. **File uploads** — User and business documents (IDs, licenses) need a file upload endpoint. Return a signed URL or stored file URL.

3. **Notifications** — The send notification endpoint should support scheduling (for future delivery). Consider a job queue (e.g., Bull/Redis).

4. **Audit logging** — All admin actions (suspend, approve, reject, delete) should be logged with `{ adminId, action, targetId, targetType, reason, timestamp }`. The UI references "audit trail" in suspension and deletion dialogs.

5. **Matching engine** — The preferences system uses 7 categories (social/environmental, rights advocacy, cultural/demographic, lifestyle, business, political, gun control). The matching algorithm logic lives entirely on the backend.

6. **Geofencing** — Real-time location data should come from mobile app SDK (not from this admin panel). The admin panel only reads/monitors location data.

7. **The PDF file** `TRD CCC Version 2.0 (1).pdf` in the project root contains the full Technical Requirements Document — read it for complete business logic and data model details.

8. **User profile images** — Currently using Unsplash URLs for mock data. In production, use your own media storage (S3/CloudFront). The `next.config.mjs` allows images from `images.unsplash.com` and `i.pravatar.cc` — add your CDN domain there.
