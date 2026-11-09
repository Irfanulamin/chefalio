# Proposal

## Why

The public landing page at chefalio.xyz should feel like opening a good cookbook: food that catches the eye, credit for the chef, and an obvious answer to "what do I get if I sign up?". Today it does the opposite. It runs ten sections, mock dashboards, pricing tiers, testimonials and a scroll-driven walkthrough, and it repeats claims the product doesn't support: weekly payouts, cook times, ratings, ingredient/diet/time filters, books landing "straight away" in a digital library, and guests browsing "for free".

This change replaces it with a six-part page built around what Chefalio actually does: free recipes behind a free account, chefs credited by name, and **printed** cookbooks that chefs ship and buyers track under Activity.

## What I found (inspection, 2026-11-09)

**Current page.** `app/page.tsx` renders `Hero`, `SocialProof`, `Personas`, `Features`, `HowItWorks`, `Testimonials`, `Pricing`, `AboutUs`, `FAQ` and `CTA`. That's about 4,600 lines in `components/Home/`. The unsupported claims, by file:

| Claim | Where |
|---|---|
| "Chef payouts now land weekly", "Payout this week", "Orders and payouts land… the same week", `PAYOUT = 1284` count-up | `Hero.tsx:93`, `HeroVisual.tsx:389`, `HowItWorks.tsx:46,389–430,706` |
| Invented cook times ("32 min", "Prep 10 min / Cook 22 min", "lamb, under 80 min") | `imagery.ts` (every dish), `HowItWorks.tsx:64,163–185`, `HeroVisual.tsx:47`, `Features.tsx:185` |
| Ratings ("4.9", 4.8/5, star rows) | `imagery.ts`, `HeroVisual.tsx:329`, `SocialProof.tsx`, `Testimonials.tsx` |
| Ingredient / diet / time filters | `Features.tsx:407`, `HowItWorks.tsx:31`, `Personas.tsx:59`, `HeroVisual.tsx` |
| Purchased books "land in your library straight away" | `FAQ.tsx:35–40`, `Personas.tsx:60`, `Features.tsx:684–739` |
| "Browse thousands… for free", "Free to browse" (guests can't browse) | `Hero.tsx:22,122`, `CTA.tsx:14,68` |
| Subscription framing, "Cancel nothing" | `Hero.tsx:24`, `CTA.tsx:14`, `Personas.tsx:61`, `Pricing.tsx` |
| Pricing tiers, admin dashboard preview, trust/security grid, earnings ($8,240) and testimonials, stats (120+, 40+ countries) | `Pricing.tsx`, `Personas.tsx` (Admins tab), `Features.tsx:761`, `Testimonials.tsx`, `SocialProof.tsx` |
| Footer and header link to gated routes (`/recipes`, `/cookbooks`, `/chefs`, `/apply-chef`) and to anchors that will no longer exist (`#personas`, `#features`, `#testimonials`, `#pricing`, `#about`) | `Footer.tsx:22–51`, `Header.tsx` guest links |

**Auth routes.** `/sign-up` and `/sign-in` are the only guest destinations. After sign-up, the visitor verifies their email, signs in, and lands on `/recipes` (role `user`). There's no "return to" parameter, so a "Create an account to apply" button can't drop someone onto `/apply-chef`. The copy must not promise that.

**Catalogue data available for previews.** I ran a read-only query of the production database: 31 chef accounts, 79 recipes, 46 cookbooks, with demo accounts excluded.
- Recipe images: only **2 of 79** were uploaded through the app (`recipe_images/…`). **38 use the same single Unsplash photo**, and the rest are web images whose file names often describe a different dish (for example, "Lemon Butter Salmon" is the image for "Scottish Langoustine").
- About half the chef accounts carry the **names of real, famous chefs** (Dominique Crenn, René Redzepi, Yotam Ottolenghi…), and their cookbooks are **titles of real published books** (*Noma*, *Alinea*, *Plenty*) with covers that appear to be taken from other sites.
- Every cookbook by a non-celebrity account uses the same Unsplash photo as its cover.
- A cookbook stores one cover image, title, description, author, price, stock and a discount (0–15%). It has **no list of the recipes inside it and no interior pages**.
- The dish names and chefs on today's landing page don't match the database. For example, `hi6xinq…` is captioned "Kabuli pulao by Amara Osei" but is "Dhakaiya Beef Tehari" by another account, and three of the four landing "chefs" don't exist.
- `GET /cookbooks/:id` is public, so a featured book's **current price can be read live** without sign-in.

**Conclusion: nothing in the catalogue can be featured honestly as it stands.** The page is designed to render from a curated content file that you fill in (see *Content you need to provide*), and a production build refuses to ship with placeholder content.

## What Changes

### Section order and final copy

| # | Section (anchor) | Copy |
|---|---|---|
| 0 | **Header** | Chefalio logo · **Cookbooks** · **For chefs** · **Sign in** |
| 1 | **Hero** (`#top`) | H1: **Find a recipe you'll want to cook again**<br>Sub: **Discover free recipes, follow the chefs behind them, and buy their printed cookbooks.**<br>Button: **Create a free account**<br>Photo caption: *{Dish title} · {Chef name} · {Difficulty}* |
| 2 | **Recipe previews** (`#recipes`) | H2: **What looks good tonight?**<br>Three cards: photo, dish name, chef, difficulty<br>Button: **Sign up to explore recipes** |
| 3 | **Featured cookbook** (`#cookbook`) | Label: **Featured cookbook**<br>H2: *{Book title}*<br>*by {Chef name}* · *{current price}* (original price struck through when a discount applies)<br>"**Inside:** {recipe 1}, {recipe 2}, {recipe 3}"<br>Connection line: either "**Includes {dish}, pictured above.**" or "**More from this chef.**"<br>Shipping line: **Printed and shipped by {Chef first name}. Track your order under Activity.**<br>Toggle: **Peek inside** / **Back to cover**<br>Button: **Sign up to buy this book** |
| 4 | **For chefs** (`#for-chefs`) | H2: **Turn your recipes into a cookbook.**<br>Body: **Publish your recipes for free. When you're ready, set a price for your printed cookbook and keep 80% of every sale. You ship each order, and buyers track it under Activity.**<br>Small line: **Applications include ID verification and a review by our team.**<br>Button: **Create an account to apply** |
| 5 | **FAQ** (`#faq`) | H2: **Questions**<br>**Are recipes free?** Yes. Create a free account to read and save recipes and follow chefs. You only pay if you buy a printed cookbook.<br>**Are cookbooks printed?** Yes. Every cookbook is a physical book, shipped to you by the chef who wrote it.<br>**Where can I track my order?** Under Activity in your account. Each order shows as paid, shipped, then delivered.<br>**How do I become a chef?** Create an account, then apply from it. We verify your ID and review your application. |
| 6 | **Closing + footer** | H2: **Your next favourite recipe is a free account away.**<br>Button: **Create a free account**<br>Footer: logo · Cookbooks · For chefs · FAQ · Sign in · Privacy Policy · Terms of Service · © {year} Chefalio |

### Button and link destinations (guests)

| Control | Destination |
|---|---|
| Logo | `/` |
| Header "Cookbooks" | `/#cookbook` |
| Header "For chefs" | `/#for-chefs` |
| Header "Sign in" | `/sign-in` |
| Hero "Create a free account" | `/sign-up` |
| "Sign up to explore recipes" | `/sign-up` |
| "Peek inside" / "Back to cover" | In-page toggle, no navigation |
| "Sign up to buy this book" | `/sign-up` |
| "Create an account to apply" | `/sign-up` |
| Closing "Create a free account" | `/sign-up` |
| Footer Cookbooks / For chefs / FAQ | `/#cookbook`, `/#for-chefs`, `/#faq` |
| Footer Sign in | `/sign-in` |
| Footer Privacy Policy / Terms of Service | `/privacy-policy`, `/terms-of-service` |

The header keeps its current signed-in behaviour (profile menu, notifications) unchanged. Dish cards and the cookbook cover are **not links**. The only actions are the labelled buttons.

### Keep / remove

- **Keep:** `Header` (rebuilt guest links), `Footer` (rebuilt, compact), the `cookbookPrice()` helper, `lib/motion.ts`, the `--cs-*` tokens, DM Sans, the Cloudinary loader (`cld()`), and the light-only theme.
- **Remove:** `Beams`, `SocialProof`, `Personas` (including the admin preview), `Features` (including the trust/security grid), `HowItWorks`, `Testimonials`, `Pricing`, `AboutUs`, `HeroVisual`, the old `Hero` / `FAQ` / `CTA` content, `shared/useStaged`, `shared/Reveal`, `shared/SectionHeading`, `shared/Pressable`, the kibo `Marquee` and `react-fast-marquee` (only `SocialProof` uses it), and the unused `time` / `rating` fields in `imagery.ts`. The landing page stops reading `DISHES` entirely. The dish and chef names stay only because the auth panels still caption with them (flagged below).
- **Add:** bold DM Sans display classes, a landing-scoped warm paper palette, a curated `landing-content.ts`, and a `CookbookPeek` component (the signature interaction).

## Content you need to provide

Nothing in the database meets these requirements today (see *What I found*).

1. **Hero dish (1):** a photo Chefalio owns or is licensed to use (landscape, at least 2000 px wide), plus its title, the chef (a real Chefalio chef who agrees to be featured) and its difficulty (beginner / intermediate / advanced).
2. **Recipe previews (3):** three visually different dishes (colour, plate, angle), each with the same four facts. The hero dish may be one of them, or kept separate.
3. **Featured cookbook (1):** which book (by a real Chefalio chef, **not** a celebrity-named account), its real front cover (at least 1200 px tall), and **2–3 recipe titles inside it** (the database doesn't store this). Also say whether any featured dish is in the book; that decides between "Includes {dish}, pictured above" and "More from this chef".
4. **Interior spread (optional, recommended):** 2–4 page images of the printed book (at least 1600 px wide each). Without these, "Peek inside" is replaced by the cover plus the "Inside:" recipe list, as you specified.
5. **Confirmation:** the chef's first name for the shipping line, and that 80% is the figure to publish (the backend uses `CHEF_PROFIT_RATE = 0.8`).

## Capabilities

### New Capabilities
- `landing-page`: the public marketing page at `/`. It covers section order and copy, content truthfulness, guest routing, the featured-cookbook "Peek inside" interaction, and mobile, keyboard and reduced-motion behaviour.

### Modified Capabilities
_None (no existing specs)._

## Impact

- **Code:** `app/page.tsx`, `app/globals.css` (landing palette, removal of `.landing-root` / `.surface-raised` / `.surface-glow`), `components/Home/*` (most files deleted, 6 new section components), `components/common/Header.tsx` (guest links), `components/common/Footer.tsx` (links and layout).
- **Shared pages:** `Header` is also used by the auth and legal pages, and `Footer` by the legal pages. The new links are absolute anchors (`/#cookbook`), so they still work from those pages.
- **Data:** one public read, `GET /cookbooks/:id`, for the featured book's live price, revalidated hourly. No backend changes.
- **Dependencies:** remove `react-fast-marquee`.
- **Out of scope, but flagged for you:**
  - The auth pages' photo panels (`AuthLayout`) still caption photos with invented names and chefs from `imagery.ts`.
  - `GET /cookbooks/:id` returns the author's **email address** to anyone.
  - The celebrity-named chef accounts and their book titles.
