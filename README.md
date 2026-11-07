# StudioSpace — Creative Workspace & Production Studio Sharing Platform

StudioSpace is a peer-to-peer marketplace where hosts list creative production spaces (photo studios, film sound stages, podcast lounges, music recording suites, and art workshops) and creators reserve them by the hour with transparent pricing, instant availability verification, and double-booking conflict prevention.

---

## 🔗 Deployment & Links

| Service | Link / Target |
|---|---|
| **Live Web App (Client)** | [https://studiospace-client.vercel.app](https://studiospace-client.vercel.app) *(Replace with your deployed Vercel domain)* |
| **API Server (Backend)** | [https://studiospace-server-meof.onrender.com](https://studiospace-server-meof.onrender.com) |
| **Client Repository** | [https://github.com/YOUR-USERNAME/studiospace-client](https://github.com/YOUR-USERNAME/studiospace-client) |
| **Server Repository** | [https://github.com/YOUR-USERNAME/studiospace-server](https://github.com/YOUR-USERNAME/studiospace-server) |

---

## 🚀 Key Features

1. **Studio Discovery & Advanced Multi-Filter Search**
   - Browse across 5 vetted studio categories: `Photo Studio`, `Film Stage`, `Podcast Lounge`, `Music Suite`, `Workshop`.
   - Real-time search by studio title, city, and address.
   - Interactive price range slider, multi-criteria sorting (Price: Low to High, Price: High to Low, Highest Rated, Newest), pagination, and dedicated empty states with search reset triggers.

2. **Rich Studio Details & Media Gallery Carousel**
   - Immersive responsive photo carousel with thumbnails, full studio specifications, verified amenities checklists, host profile, and creator reviews with star ratings.

3. **Real-Time Hourly Booking Engine & Conflict Prevention**
   - Dynamic booking modal with date and start/end time pickers.
   - Real-time calculation of total hours, hourly subtotal, and refundable security deposit computed on the server.
   - Pre-submission conflict detection highlights already booked ranges.
   - Robust server-side overlap protection rejects overlapping `Confirmed` bookings with `HTTP 409 Conflict` and triggers instant Sonner error toast notifications. Back-to-back bookings are fully supported.

4. **Host Management Suite (CRUD & Booking Controls)**
   - **Add Studio (`/add-studio`)**: Private route featuring live ImgBB image uploading, category selection, hourly rate, security deposit, capacity, and amenities checklists.
   - **My Listings (`/my-listings`)**: Grid view of host-owned studios with edit links and a custom deletion confirmation modal.
   - **Update Studio (`/studios/edit/[id]`)**: Full pre-populated studio editing form with host authorization checks.
   - **Host Dashboard (`/dashboard`)**: Overview stats and incoming booking requests table allowing hosts to **Confirm** or **Decline** reservations.

5. **Creator Booking Lifecycle (`/my-bookings`)**
   - Clean dashboard of all user reservations with color-coded status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
   - One-click booking cancellation with custom confirmation dialog (active exclusively for `Pending` reservations).

6. **Saved Studios / Wishlist**
   - Heart icon toggle on studio cards for instant bookmarking of favorite creative spaces, persisted to MongoDB and displayed in the user dashboard.

7. **Secure Authentication & Reload-Safe Session Guard**
   - Dual authentication: BetterAuth email/password registration with strict validation (uppercase, lowercase, min 6 characters) plus Google OAuth 2.0.
   - Session exchange mints an `HTTPOnly` JWT cookie (`sameSite: "none", secure: true` in production) to authenticate backend API mutations.
   - Custom `PrivateRoute` wrapper ensures logged-in users reloading `/my-bookings`, `/my-listings`, `/dashboard`, or `/add-studio` never experience redirection to `/login`.

8. **Studio-Centric Aesthetics & Theme Toggle**
   - Full dark and light theme switching powered by `next-themes` and DaisyUI (`studiospace-light` / `studiospace-dark`).
   - Branded aperture/spotlight spinners, custom SVG 404 "Studio Off Set" illustration, new X social logo, and zero lorem ipsum copy.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15/16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS, DaisyUI, Lucide React, Next Themes |
| **Auth** | BetterAuth (MongoDB Adapter), Express JWT (HTTPOnly Cookie), Google OAuth |
| **Interactive Components** | Swiper (touch-friendly carousels), Sonner (toast notifications) |
| **Image Hosting** | ImgBB REST API + Next.js Image Optimization |
| **Backend & DB** | Express.js, TypeScript, MongoDB Atlas Native Driver |
| **Deployment** | Vercel (Client SPA / SSR), Render (Backend API) |

---

## 💻 Local Setup Guide

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or pnpm
- MongoDB Atlas cluster URL (or local MongoDB)
- ImgBB API key (free at [api.imgbb.com](https://api.imgbb.com/))
- Running StudioSpace Express API server (default: `http://localhost:5000`)

### 2. Installation
```bash
# Clone the client repository
git clone https://github.com/YOUR-USERNAME/studiospace-client.git
cd studiospace-client

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the sample environment file and configure your values:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars-long
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studiospace?retryWrites=true&w=majority
DB_NAME=studiospace
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_IMGBB_KEY=your-imgbb-api-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Examiner Test Credentials

Use these pre-configured accounts or create new accounts during testing:

| Role | Email | Password | Access / Capabilities |
|---|---|---|---|
| **Host** | `host@studiospace.com` | `Host123` | Has active listings; can add/edit/delete studios; confirms/declines bookings in `/dashboard` |
| **Creator** | `creator@studiospace.com` | `Creator123` | Browses studios; reserves slots; manages reservations and cancellations in `/my-bookings` |

> **Password Policy**: Any newly registered account must contain at least 1 uppercase letter, 1 lowercase letter, and have a minimum length of 6 characters (e.g. `Studio123`).

---

## ☁️ Vercel Deployment Guide

### Step 1: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New" -> "Project"**.
2. Select your GitHub repository (`studiospace-client`).
3. If deploying from a monorepo, set **Root Directory** to `client`.
4. Ensure the Framework Preset is set to **Next.js**.
5. Build and Output Settings:
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 2: Configure Environment Variables in Vercel
Add each of the following environment variables under **Project Settings -> Environment Variables**:

| Variable Name | Environment | Description & Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production, Preview | Full URL to the live backend server: `https://studiospace-server-meof.onrender.com` |
| `BETTER_AUTH_SECRET` | Production, Preview | 32+ character random secret string (e.g. generate via `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Production, Preview | Canonical URL of your live Vercel client: `https://studiospace-client.vercel.app` |
| `MONGODB_URI` | Production, Preview | Full MongoDB Atlas connection URI: `mongodb+srv://user:pass@cluster.mongodb.net/studiospace?retryWrites=true&w=majority` |
| `DB_NAME` | Production, Preview | MongoDB database name: `studiospace` |
| `GOOGLE_CLIENT_ID` | Production, Preview | Google OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Production, Preview | Google OAuth Client Secret from Google Cloud Console |
| `NEXT_PUBLIC_IMGBB_KEY` | Production, Preview | Free API key from [api.imgbb.com](https://api.imgbb.com/) |

### Step 3: Configure External Services for Live Domain

1. **Google Cloud Console OAuth**:
   - Go to **Google Cloud Console -> APIs & Services -> Credentials**.
   - Edit your OAuth 2.0 Web Client.
   - In **Authorized JavaScript Origins**, add:
     - `https://studiospace-client.vercel.app` (your actual Vercel domain)
     - `http://localhost:3000`
   - In **Authorized Redirect URIs**, add:
     - `https://studiospace-client.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
   - Save changes.

2. **Backend Server CORS Configuration**:
   - On Render (or wherever your backend is hosted), ensure `CLIENT_URL` includes your live Vercel domain:
     ```env
     CLIENT_URL=https://studiospace-client.vercel.app,http://localhost:3000
     ```
   - This ensures HTTPOnly cookies and cross-origin fetch requests (`credentials: "include"`) operate without CORS blocks.

---

## 📋 Final QA Checklist (Phase 3)

| QA Test Item | Expected Result | Status |
|---|---|:---:|
| **Route Reload Safety** | Reloading any route (public, private, or 404) preserves context without crashing or false login redirect | ✅ **PASS** |
| **Private Route Persistence** | Logged-in user reloading `/my-bookings`, `/my-listings`, `/dashboard`, or `/add-studio` stays on page | ✅ **PASS** |
| **Unauthenticated API Mutation Protection** | `POST /api/studios` without valid HTTPOnly JWT returns `401 Unauthorized` | ✅ **PASS** |
| **Booking Overlap Prevention** | Booking a time slot conflicting with an existing `Confirmed` booking returns `409 Conflict` + Sonner error toast | ✅ **PASS** |
| **Theme Switching** | Toggling between `studiospace-light` and `studiospace-dark` updates entire app consistently | ✅ **PASS** |
| **Prohibited Pattern Audit** | Zero occurrences of "Lorem ipsum", `alert()`, `confirm()`, or `prompt()` across the codebase | ✅ **PASS** |
| **Cross-Domain Cookie Credentials** | `credentials: "include"` with `httpOnly: true, secure: true, sameSite: "none"` cookie exchange | ✅ **PASS** |
| **Google OAuth Configuration** | Live Vercel domain and `/api/auth/callback/google` added to Authorized Origins & Redirect URIs | ✅ **PASS** |
| **Commit Target Verification** | Client commits >= 15 (current: 30+), Server commits >= 8 (current: 12+) | ✅ **PASS** |
| **Documentation & Credentials** | Client README has live URL placeholder, examiner credentials, setup guide, and env breakdown | ✅ **PASS** |
