# ZUGZWANG — Personal Chess Coaching Website

A premium, single-page chess coaching site built to do one thing: get visitors to **make one move on a real chessboard**, then **book a free intro call** or **message you on WhatsApp**.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix/shadcn-style UI · Motion · react-chessboard + chess.js · Supabase (PostgreSQL + Auth) · Cal.com · WhatsApp click-to-chat · Vercel.

---

## 1. Features

| Area | What it does |
| --- | --- |
| Floating pill navbar | Active-section indicator, mobile hamburger, "Book a FREE Call" opens the Cal.com modal |
| Hero | Original SVG logo, tilted 3D board, floating pieces |
| One-Move Challenge | Real board: drag-and-drop **and** click-to-move, legal moves only (chess.js), illegal moves never consume the move, locks after one legal move, shows `1. e4`, then opens the "Nice move!" modal (Cal.com / WhatsApp / contact form). No reset button. |
| Booking | Embedded Cal.com calendar (real availability, visitor's timezone) + modal. Never shows fake slots. |
| Learning pathways | Four coaching areas |
| Awards | Timeline driven by `awards` in config. Empty → elegant intro, never fake achievements |
| About | Editable profile, philosophy, approach, socials |
| India Time | Flip clock using `Intl.DateTimeFormat` with `Asia/Kolkata`; day (sun, clouds) / night (moon, stars, sleeping owl, Zzz) |
| Feedback | Stored in Supabase, **hidden until you approve it** |
| Contact form | Zod-validated, honeypot, timing check, rate limit, consent, saved to `leads` |
| Admin `/admin` | Supabase Auth login restricted to `ADMIN_EMAIL`, stats, status filter, status editing, feedback approval, Excel-compatible CSV export |
| SEO | Metadata, Open Graph image, favicon, sitemap, robots, JSON-LD |

---

## 2. Quick start (local)

Requirements: **Node.js 20.9+** and npm. No Docker needed.

```bash
npm install
cp .env.example .env.local     # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. The site runs without Supabase configured (forms will show a friendly error and suggest WhatsApp), so you can design first and connect services later.

Useful scripts:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run build       # Production build
npm run start       # Serve the production build
```

---

## 3. Edit your content — one file

Everything lives in **`src/config/site.ts`**. Search for `TODO(owner)`:

- `coach` — name, intro, philosophy, teaching approach, photo (`/public/coach.jpg`, then set `profileImage: "/coach.jpg"`)
- `booking.calUrl` — replace `YOUR_CAL_USERNAME`
- `booking.callDurationMinutes` — display value (set the real length in Cal.com)
- `social` — URLs still containing `YOUR_` are automatically hidden
- `buyMeACoffeeUrl`
- `awards` — add **only verified** entries: `{ title, type, year, description, link }`
- `time.coordinates` — e.g. `{ latitude: 13.0827, longitude: 80.2707 }` to enable real SunCalc sunrise/sunset. While `null`, 06:00–18:00 IST is used.
- `contact.whatsappNumber` — already set to `918667219230`

---

## 4. Supabase setup

1. Create a project at https://supabase.com.
2. **SQL Editor → New query →** paste all of `supabase/schema.sql` → **Run**. This creates `leads` and `feedback`, enables and **forces Row Level Security**, and revokes all browser access to `leads`.
3. **Project Settings → API**: copy the URL, the publishable/anon key and the secret/service-role key into `.env.local`.
4. **Authentication → Users → Add user**: create *your* account with the email you set as `ADMIN_EMAIL` (tick "Auto confirm"). **Authentication → Sign In / Providers**: disable "Allow new users to sign up" so nobody else can create accounts.
5. Visit `/admin` and sign in.

### Security model
- `leads` has RLS on and **no policies** → anonymous visitors can't read or write it.
- All inserts go through `/api/leads`, which validates with Zod and uses the secret key **server-side only** (`import "server-only"` makes the build fail if it leaks into client code).
- `/admin`, `/api/admin/export` and `/api/admin/update` re-verify the session with `supabase.auth.getUser()` **and** require the email to equal `ADMIN_EMAIL` on every request.
- CSV export neutralises spreadsheet formula injection and includes a UTF-8 BOM so Excel opens it correctly.
- `.env*` (except `.env.example`), `*.csv` and database dumps are git-ignored.

---

## 5. Cal.com setup

1. Create a free account at https://cal.com.
2. Create an event type with slug `free-chess-call` (15 minutes) and set your availability and timezone (Asia/Kolkata).
3. Set `booking.calUrl` in `src/config/site.ts` to `https://cal.com/<your-username>/free-chess-call`.

Visitors see your real availability converted to their own timezone, and receive Cal.com's confirmation email. Until you configure the URL, the booking area shows a WhatsApp fallback instead of fake slots.

---

## 6. WhatsApp

Click-to-chat uses `https://wa.me/918667219230?text=<url-encoded message>`. The default message is `contact.defaultMessage`; the chessboard modal appends the move the visitor played.

---

## 7. Deploy: GitHub → Vercel

```bash
git init
git add .
git status            # confirm .env.local is NOT listed
git commit -m "Initial commit: Zugzwang"
git branch -M main
git remote add origin https://github.com/<you>/zugzwang.git
git push -u origin main
```

Then at https://vercel.com: **Add New → Project →** import the repo → add the environment variables from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your production URL) → **Deploy**.

Recommended after launch: add your domain in Vercel, and turn on Vercel Firewall rate limiting (the built-in limiter is per-instance memory).

---

## 8. Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URL, sitemap, Open Graph |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Publishable key, used only for admin sign-in |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Secret key for inserts/reads. Never expose. |
| `ADMIN_EMAIL` | server only | The only account allowed into `/admin` |

---

## 9. Project structure

```
src/
  app/            page.tsx, layout.tsx, globals.css, admin/, privacy/, terms/,
                  api/leads, api/feedback, api/admin/{export,update}, sitemap, robots, icon, OG image
  components/     Navbar, Hero, InteractiveChessboard, BookingSection, BookingProvider, CalEmbed,
                  AboutSection, AwardsSection, IndiaClock, LearningPathways, FeedbackSection,
                  ContactForm, ContactSection, Testimonials, WhatsAppButton, Footer, Logo, ui/
  config/site.ts  ← edit this
  lib/            supabase.ts, admin-auth.ts, validation.ts, rate-limit.ts, utils.ts
  proxy.ts        keeps the admin session fresh
supabase/schema.sql
```

---

## 10. Before you go live — checklist

- [ ] Fill every `TODO(owner)` in `src/config/site.ts`
- [ ] Run `supabase/schema.sql`; create your admin user; disable public sign-ups
- [ ] Set the Cal.com URL and test a booking
- [ ] Review and adapt the **Privacy Policy** and **Terms** (templates, not legal advice)
- [ ] Add real photo, awards and social links (nothing is invented for you)
- [ ] Rotate any key that was ever shared or committed
