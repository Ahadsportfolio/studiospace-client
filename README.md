# StudioSpace

**Peer-to-peer creative workspace and production studio sharing platform.**

🔗 **Live site:** https://YOUR-CLIENT-URL.vercel.app
🖥️ **Server repo:** https://github.com/YOUR-USERNAME/studiospace-server
🔌 **API:** https://YOUR-SERVER-URL

## Features
- Browse, search, filter and sort creative studios (photo studios, film stages, podcast lounges, music suites, workshops)
- Studio details with gallery carousel, amenities, host info and reviews
- Real-time booking with live price summary and double-booking prevention (overlapping Confirmed slots are rejected)
- Secure auth: email/password and Google login with JWT in HTTPOnly cookies
- Hosts can add, update and delete listings and confirm or decline booking requests
- My Bookings with status badges (Pending, Confirmed, Completed, Cancelled) and cancellation
- Dark / light theme toggle across the whole app
- Skeleton loaders, custom 404, friendly empty states and toast notifications everywhere
- Fully responsive on mobile, tablet and desktop

## Tech stack
- Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI
- BetterAuth (MongoDB adapter), JWT (HTTPOnly cookies)
- Sonner, Swiper, next-themes, lucide-react
- Server: Express.js, MongoDB (see server repo)

## Local setup
```bash
git clone https://github.com/YOUR-USERNAME/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```
Run the server repo first (`npm run dev` on port 5000) and set `NEXT_PUBLIC_API_URL=http://localhost:5000`.

## Examiner test credentials
| Role | Email | Password |
|---|---|---|
| Host (has listings) | host@studiospace.com | Host123 |
| Creator | creator@studiospace.com | Creator123 |

> Replace with the real accounts you create before submission.
