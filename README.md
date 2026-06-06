# Aarambh '26 — Official Event Portal

> **Official digital platform for Aarambh 2026** — the signature eight-day New Student Orientation and Welcome Program at JK Lakshmipat University (JKLU), Jaipur.

---

## Overview

Aarambh '26 is a full-stack web application built to manage all aspects of the university orientation program — from public-facing event information and student registration, to an internal admin dashboard with QR-based check-in, volunteer management, feedback collection, and real-time analytics.

**Live Site:** [https://aarambh.jklu.edu.in](https://aarambh.jklu.edu.in)  
**Event Dates:** July 14–21, 2026  
**Venue:** JK Lakshmipat University Campus, Ajmer Road, Jaipur, Rajasthan — 302026

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Payments | Cashfree Payment Gateway |
| Email | Nodemailer (SMTP via Office 365) |
| PDF Generation | pdf-lib |
| QR Scanning | html5-qrcode |
| QR Generation | qrcode / qrcode.react |
| Data Export | ExcelJS |
| Deployment | Firebase Hosting (with SSR backend) |
| Icons | Lucide React |

---

## Key Features

### Public Portal
- **Landing Page** — Animated comic/pop-art themed homepage with a live countdown timer, photo gallery, speakers carousel, event schedule timeline, and FAQ accordion
- **Event Schedule** — Day-by-day event timeline with category filters
- **Speakers** — Carousel showcasing guest speakers and their profiles
- **FAQ** — Interactive accordion for common student queries
- **Gallery** — Masonry photo gallery from the event
- **Rules & Guidelines** — Complete program rules page
- **Contact** — Contact form that saves messages to Firestore
- **Legal Pages** — Privacy Policy, Terms of Service, Refund Policy

### Registration & Payments
- **Student Registration Form** — Multi-step form collecting student, parent, and address details
- **Cashfree Integration** — Secure online payment processing (INR 2,500 registration fee)
- **PDF Receipt Generation** — Auto-generated A4 registration receipt with QR code embedded (via pdf-lib)
- **Confirmation Email** — Automated email with the PDF receipt attached (Nodemailer + SMTP)
- **Excel Sync** — Webhook-based sync of each new registration to a Google Sheet / Microsoft Excel via Apps Script
- **Coupon Support** — Developer test coupon for sandbox verification

### Admin Dashboard (`/admin`)
- **Overview & Analytics** — Registration counts, revenue summary, daily trends
- **Registrations Management** — Full registrations table with search, filter by date, and export to Excel
- **Check-in Scanner** — QR code scanner for entry management; marks attendance in real time
- **Entry Logs** — Live log of all check-ins with timestamps
- **Event Management** — Create and manage scheduled events in Firestore
- **Announcements** — Push announcements visible across the platform
- **Volunteer Management** — Assign volunteers to duties, manage team leaders
- **Duty Management** — Structured duty assignment system per event day
- **Audit Logs** — Immutable log of all admin actions
- **Search** — Global search across registrations

### Scanner Portal (`/scanner`)
- Dedicated, minimal QR scanner interface for on-ground volunteers
- Validates registrations and marks entry in real time
- Role-based access — only `scanner` role users can access this portal

### Volunteer Portal (`/volunteer`)
- Volunteer-facing view for duty schedules and announcements

### Feedback System (`/feedback`, `/eventsfeedback`)
- Per-day anonymous feedback collection
- Admin-accessible feedback export to Excel

---

## Project Structure

```
aarambh-26/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout with SEO metadata & schema.org
│   ├── globals.css           # Global styles & design tokens
│   ├── admin/                # Admin dashboard (analytics, registrations, scanner, etc.)
│   ├── register/             # Student registration flow
│   ├── scanner/              # QR check-in scanner portal
│   ├── volunteer/            # Volunteer duty portal
│   ├── feedback/             # Daily feedback forms
│   ├── eventsfeedback/       # Event-specific feedback
│   ├── schedule/             # Public event schedule page
│   ├── speakers/             # Speakers listing page
│   ├── gallery/              # Photo gallery page
│   ├── faq/                  # FAQ page
│   ├── rules/                # Program rules & guidelines
│   ├── team/                 # Team credits
│   ├── login/                # Auth login page
│   ├── contact/              # Contact form page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   ├── refund/               # Refund policy
│   ├── check-in/             # Check-in status page
│   └── api/                  # API routes
│       ├── register/         # Registration + payment webhook handler
│       ├── receipt/          # PDF receipt download endpoint
│       ├── contact/          # Contact form submission endpoint
│       └── webhook/          # Cashfree payment webhook handler
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Site-wide navigation bar
│   │   ├── Footer.tsx        # Site-wide footer
│   │   ├── ConditionalLayout.tsx  # Hides nav/footer on admin/scanner routes
│   │   └── ThemeBackground.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx       # Admin dashboard sidebar
│   │   ├── AdminLayoutWrapper.tsx
│   │   ├── Modal.tsx
│   │   └── SkeletonLoader.tsx
│   ├── about/                # About section components
│   ├── scanner/              # Scanner UI components
│   ├── volunteer/            # Volunteer UI components
│   ├── ui/                   # Shared UI primitives
│   ├── ComicBackground.tsx   # Animated pop-art background
│   ├── FaqAccordion.tsx      # FAQ accordion component
│   ├── Preloader.tsx         # Page preloader animation
│   ├── ScheduleTimeline.tsx  # Event schedule timeline
│   └── SpeakersCarousel.tsx  # Speakers carousel
│
├── lib/
│   ├── firebase.ts           # Firebase client & server initialization
│   ├── db.ts                 # Firestore collection helpers
│   ├── registrationHelper.ts # PDF generation, email sending, registration pipeline
│   ├── exportFeedback.ts     # Feedback Excel export utility
│   ├── security.ts           # Input sanitization & rate limiting
│   ├── audit.ts              # Audit log helpers
│   └── utils.ts              # Shared utility functions
│
├── constants/                # App-wide constants (event data, club lists, etc.)
├── public/                   # Static assets (logos, photos, manifests)
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore composite indexes
├── firebase.json             # Firebase Hosting + Firestore config
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── .env.example              # Environment variable template
```

---

## Firestore Data Model

| Collection | Description |
|---|---|
| `registrations` | Confirmed student registrations with payment details |
| `pendingRegistrations` | Temporary holding for in-progress payments |
| `roles` | User role assignments (`admin`, `scanner`, `volunteer`, `team_leader`, `feedback`) |
| `scanLogs` | QR check-in scan records with timestamps |
| `events` | Schedulable events and sub-events for the program |
| `announcements` | Platform-wide announcements pushed by admin |
| `notifications` | In-app notification objects |
| `volunteers` | Volunteer profiles and assignments |
| `dutyAssignments` | Per-volunteer duty schedules |
| `feedback` | Anonymous daily feedback submissions |
| `settings` | Dynamic app settings (e.g. active feedback day) |
| `auditLogs` | Immutable log of all admin and system actions |
| `scannerAccounts` | Scanner user credentials and status |
| `contact_messages` | Inbound contact form submissions |

---

## Security Model

Firestore security rules enforce strict role-based access control:

- **Public** — Can create pending registrations, submit feedback, send contact messages, read public events and announcements
- **`scanner` role** — Can read registrations and write scan logs (check-in)
- **`volunteer` / `team_leader` role** — Can read and update volunteer records
- **`feedback` role** — Can read feedback submissions
- **`admin` role** — Full read/write access to all collections

Security headers are applied globally via `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Registration Flow

```
Student fills form
      ↓
POST /api/register → Create Cashfree order
      ↓
Cashfree payment UI (redirect / SDK)
      ↓
Cashfree webhook → POST /api/webhook
      ↓
finalizeRegistration()
  ├── Save to Firestore (registrations collection)
  ├── Sync row to Excel via Google Apps Script webhook
  ├── Generate A4 PDF receipt with QR code (pdf-lib)
  ├── Email PDF to student (Nodemailer + Office 365 SMTP)
  └── Write audit log entry
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project (Firestore + Authentication enabled)
- A Cashfree merchant account
- An SMTP-capable email account (e.g. Office 365)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/aarambh-26.git
cd aarambh-26

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in all values in .env.local (see Environment Variables section below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate the following:

```env
# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server-side)
FIREBASE_ADMIN_EMAIL=
FIREBASE_ADMIN_PASSWORD=

# Cashfree Payment Gateway
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
NEXT_PUBLIC_CASHFREE_ENV=SANDBOX   # or PRODUCTION

# SMTP / Email (Nodemailer)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Google Sheets / Excel Sync Webhook
EXCEL_SYNC_WEBHOOK_URL=
```

> **Never commit `.env.local` to version control.**

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |

---

## Deployment

This project is deployed on **Firebase Hosting** with server-side rendering (SSR) enabled via Firebase App Hosting.

```bash
# Login to Firebase CLI
firebase login

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy the full application (hosting + SSR backend)
firebase deploy
```

Ensure all production environment variables are set in your Firebase Hosting environment before deploying.

---

## Role Setup

After deploying, create user accounts in Firebase Authentication and assign roles via the `roles` Firestore collection:

```
/roles/{uid}
  role: "admin" | "scanner" | "volunteer" | "team_leader" | "feedback"
```

Only users with the `admin` role can access `/admin`. Only users with `scanner` can access `/scanner`.

---

## Contributing

This is an internal project maintained by the **JKLU Tech Team**. For bug reports or feature requests, please contact the tech committee through official university channels.

---

## License

ISC License — JK Lakshmipat University, 2026.

---

<div align="center">
  <sub>Built with care by the JKLU Tech Team for Aarambh '26</sub>
</div>
