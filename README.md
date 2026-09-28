# Voltrix Components

A full-stack electronics-components e-commerce store: real product database,
persistent per-account cart, authentication, order history, and Stripe
Checkout payments.

Built with Next.js 14 (App Router, TypeScript), Prisma + SQLite, custom
JWT-cookie auth, Tailwind CSS, and Stripe.

This is an **original demo storefront** with a fictional brand and catalog —
visually and structurally inspired by corporate electronics distributors
(navy/gold theme, multi-tier category nav, trust badges), but no branding,
logo, product copy, or imagery is copied from any real company.

## Setup

Requires Node 20+ (this project was built and tested against **22.17.0** —
if you use nvm, `nvm use` in this directory will pick it up from `.nvmrc`).

```bash
nvm use            # or: nvm use 22.17.0
npm install
cp .env.example .env
# edit .env: at minimum generate a real JWT_SECRET (see comment in the file)
```

### Database

```bash
npx prisma migrate dev --name init   # already run once; re-run is a no-op if up to date
npm run db:seed                      # seeds 8 categories, 42 products, and a demo account
```

Demo login: **demo@voltrix.test** / **voltrixdemo**

### Run

```bash
npm run dev
```

Visit http://localhost:3000. Browsing, search, accounts, cart and order
history all work immediately — no external services required for any of
that.

## Stripe payments (test mode)

Checkout is real Stripe Checkout, not a mock — you'll need your own free
Stripe test-mode credentials:

1. Get test API keys from https://dashboard.stripe.com/test/apikeys and put
   them in `.env` as `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. The Stripe CLI is required to forward webhook events to your local
   server (this is what flips an order from `PENDING` to `PAID`). It's
   already installed on this machine at `~/.local/bin/stripe` — if you're
   setting this up elsewhere: `brew install stripe/stripe-cli/stripe`, or
   download a binary from https://github.com/stripe/stripe-cli/releases.
3. In a separate terminal, with the dev server running:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the `whsec_...` it prints into `.env` as `STRIPE_WEBHOOK_SECRET`,
   then restart `npm run dev` so it picks up the new value. **Keep `stripe
   listen` running** for the whole time you're testing checkout — without
   it, orders will stay stuck at `PENDING` forever, since the webhook is the
   only thing that ever marks an order paid (see `app/api/webhooks/stripe/route.ts`).
4. Add something to your cart, go to `/checkout`, click **Pay with
   Stripe**, and pay with the test card `4242 4242 4242 4242`, any future
   expiry date, any CVC, any ZIP. You'll land on `/checkout/success` and the
   order will appear under **Order history**.

Without Stripe keys configured, the app still works end-to-end right up to
the "Pay with Stripe" button — clicking it shows a clean inline error
instead of crashing, so you can demo/develop everything else with zero
Stripe setup.

## Testing

```bash
npx playwright install chromium   # once
npm run test:e2e
```

`tests/e2e/shop-flow.spec.ts` covers: register → browse a category → open a
product → add to cart → view cart totals → reach checkout → confirm the
Stripe-key-missing error path degrades cleanly; plus search and the
auth-redirect-from-checkout guard.

## Project structure

```
app/            Routes (App Router) — pages + the one Stripe webhook Route Handler
actions/        Server Actions — auth, cart mutations, checkout session creation
components/     UI: layout (Navbar/Footer), product, category, cart, ui primitives
lib/            Prisma client, auth (JWT/bcrypt), Stripe client, cart/order helpers
prisma/         schema.prisma, migrations, seed.ts
public/images/  Category + product photography
tests/e2e/      Playwright
```

## Design decisions worth knowing about

- **SQLite via Prisma** — a real relational database with migrations, zero
  external service to stand up. `prisma/dev.db` (gitignored); inspect it
  directly with `sqlite3 prisma/dev.db`.
- **Custom auth, not NextAuth** — signed JWT in an httpOnly cookie
  (`lib/auth.ts`), verified in `middleware.ts` (Edge-compatible via `jose`).
  Chosen over NextAuth v5 to avoid depending on a still-beta API.
- **Cart requires an account.** Browsing and search are public; "Add to
  cart" redirects to sign-in/register if needed. This keeps the cart
  DB-backed and avoids guest-cart/merge-on-login complexity.
- **The Stripe webhook is the only thing that ever sets an order to
  `PAID`.** The `/checkout/success` redirect page only displays status — it
  never trusts the redirect itself as proof of payment.
- **Currency is USD**, independent of the navy/gold visual theme, to avoid
  India-specific Stripe test-mode quirks unrelated to the actual ask.
- All product/category photography is sourced from Pexels (free-to-use
  stock), resized locally, and reviewed for readable competitor branding
  before inclusion — none of it depicts real Voltrix products, since
  Voltrix isn't a real company.
