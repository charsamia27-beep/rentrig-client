# RentRig — Equipment Rental Platform (Client)

> **Rent the right rig, right on time.** A marketplace where equipment owners list construction, photography, vehicle, agriculture, electronic and event equipment, and customers browse, book and pay for it securely by the day, week or month.

**Live site:** https://YOUR-CLIENT.vercel.app &nbsp;·&nbsp; **API:** https://YOUR-SERVER.vercel.app &nbsp;·&nbsp; **Server repo:** https://github.com/YOUR-USERNAME/rentrig-server

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@rentrig.app` | `Admin123` |
| Owner | `owner@rentrig.app` | `Owner123` |
| Customer | `customer@rentrig.app` | `Customer123` |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

---

## Purpose

Most equipment sits idle most of the time, and renting it usually means phone calls and cash deposits. RentRig puts the whole process online. Owners list gear and admins verify it. Customers search, filter and book with exact dates and quantity. Payment runs through Stripe Checkout, and every party gets a dashboard with live analytics.

## Key features

**Authentication & security**
- Better Auth email/password sign-up (name, email, photo via imgbb upload or link, password) with uppercase, lowercase and 6+ character rules, plus Google login. Google users start as **Customer**.
- Better Auth JWT plugin issues short-lived **JWT access tokens** after login. The Express API verifies them against the public JWKS, and an axios interceptor attaches and refreshes them.
- Role-based access (Customer / Owner / Admin) is enforced twice. Server-side route guards in the App Router mean a reload never sends a logged-in user to `/login`. API middlewares `verifyToken`, `verifyRenter`, `verifyOwner` and `verifyAdmin` protect the endpoints.
- Users can't pick the admin role at sign-up and can't change their own role. Suspended accounts are blocked.

**Marketplace**
- Home page: animated hero with search, 6 featured approved items (MongoDB `limit`), categories with live counts, Why Choose Us, How It Works, Recently Added / Popular tabs, customer reviews, Trusted Owners and a CTA. Framer Motion is used throughout.
- All Equipment: **server-side** search (name/brand/category and location), filters (category, rental type, price range, availability), sorting (price ↑/↓, recently added, popular, top rated) and pagination. Filter state lives in the URL, so links can be shared.
- Equipment details (private): full specs, owner info, rental terms, reviews, similar items, and add/remove favorites (stored in MongoDB).
- Booking modal: dates, quantity, contact, delivery address and notes, with a live price summary. The server re-calculates the amount and checks availability, then redirects to **Stripe Checkout**. After payment the booking and payment records are created and a printable receipt is shown.

**Dashboards** (full-width, responsive, charts)
- **Customer:** overview, My Rentals (cancel before start, review after completion), Favorites, Payment History, Profile.
- **Owner:** analytics (earnings, monthly earnings chart, top equipment), Add Equipment (imgbb upload, pending status), My Equipment (update / delete / view), My Equipment Rental (confirmed → active → completed).
- **Admin:** platform analytics (users, equipment, bookings, pending approvals, completed rentals, revenue, monthly charts, role/status/category breakdowns), All Users (change role, suspend, delete), All Equipment (approve / reject with reason / update / delete), All Rentals.

**Extras**
- Dark / light theme toggle saved in localStorage, applied with no flash on load.
- Pagination on All Equipment and every dashboard table.
- Cron job (node-cron + Vercel Cron) that auto-completes rentals after their end date and returns units to stock.
- Email notifications to renter and owner when a booking is confirmed or completed (nodemailer).
- Verified reviews that only completed rentals can leave, with an auto-updated equipment rating.
- Branded loading screen, error boundary and 404 page. The footer uses the new X logo.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · DaisyUI 5 · Better Auth + MongoDB adapter + JWT plugin · TanStack Query · Framer Motion · Recharts · Stripe (via API) · imgbb

## npm packages used

| Package | Why |
| --- | --- |
| `next`, `react`, `react-dom` | App Router framework |
| `better-auth` | Email/password + Google auth, sessions, JWT/JWKS |
| `mongodb` | MongoDB driver for the Better Auth adapter |
| `@tanstack/react-query` | Data fetching, caching, mutations |
| `axios` | HTTP client with JWT interceptor |
| `framer-motion` | Animations (banner, featured, categories, reviews, extra sections) |
| `recharts` | Dashboard charts |
| `react-hot-toast` | Toast notifications |
| `sweetalert2` | Confirmations & success dialogs |
| `react-icons` | Icons (incl. the new X logo) |
| `server-only` | Keeps server modules out of client bundles |
| `tailwindcss`, `@tailwindcss/postcss`, `daisyui` | Styling & design system |

## Getting started

```bash
git clone https://github.com/YOUR-USERNAME/rentrig-client.git
cd rentrig-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Express API URL (no trailing slash) |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key |
| `BETTER_AUTH_URL` | This app's URL (e.g. `https://rentrig.vercel.app`) |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `MONGODB_URI`, `DB_NAME` | **Same** database as the server |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth – redirect URI `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `NEXT_PUBLIC_DEMO_*` (optional) | Fills the one-click demo login buttons |

### Deploying (Vercel)
1. Import the repo, add every variable above, and deploy.
2. Set the server's `CLIENT_URL` to this deployment URL. The API reads the JWKS from `<CLIENT_URL>/api/auth/jwks`.
3. In Google Cloud Console, add the production redirect URI.
4. Register an account, then run `npm run make-admin -- you@email.com` in the server to create the admin.

## Project structure

```
src/
  app/
    (main)/            public layout: Navbar → page → Footer
      page.js          home
      equipment/       all equipment + [id] details (private)
      payment/success/ Stripe return page
      login, register, about, contact, how-it-works
    dashboard/         private, role-aware dashboard
      (customer)/ (owner)/ (admin)/   role-guarded route groups
      profile/
    api/auth/[...all]/ Better Auth handler
  components/          home, equipment, dashboard, auth, shared UI
  lib/                 auth (server), auth-client, api (JWT axios), constants, utils
```
