# Design

## Context

See `proposal.md` for motivation, the inspection findings and the final copy. Requirements are in `specs/landing-page/spec.md`.

Constraints that shape the approach:
- **Light theme only.** Dark mode was removed in `refactor(theme): remove dark mode and theme toggle`, and there's one `:root` token set.
- **Design system.** The `--cs-*` tokens, the `.type-*` and `.ui-*` scales, and `lib/motion.ts` springs are the house vocabulary. DM Sans is already loaded in `app/layout.tsx`, and Pinyon Script is used for the wordmark.
- **No usable catalogue content.** The catalogue has no recipe-to-cookbook link, no interior pages, and no featured-ready photos (see proposal, *What I found*).
- **One public read.** `GET /cookbooks/:id` is public. Recipe, chef and listing endpoints require sign-in.
- **Fixed auth flow.** After sign-up and verification, a `user` lands on `/recipes`. There's no return-to parameter.

## Goals / Non-Goals

**Goals:**
- The page renders only from curated, truthful content, and production can't ship with placeholders.
- The featured book's price is always current or not shown at all.
- One signature interaction ("Peek inside") with full keyboard, touch and reduced-motion support. Everything else is still.
- Most of the page renders on the server. Client JS is limited to `CookbookPeek` and the existing `Header`.

**Non-Goals:**
- Changing auth flows (for example, `?next=/apply-chef`), backend endpoints, the auth panels' captions, or the catalogue's celebrity-named accounts. These are all flagged in the proposal for separate changes.
- Live recipe previews. The previews are curated marketing content, as briefed.
- A new design system. The warm palette is scoped to the landing page.

## Decisions

### D1. One curated content file, guarded at build time
`components/Home/landing-content.ts` exports typed `HERO_DISH`, `PREVIEW_DISHES` (max 3) and `FEATURED_COOKBOOK`:

```ts
type Difficulty = "beginner" | "intermediate" | "advance";
type Photo = { src: string; alt: string; width: number; height: number };
type LandingDish = { title: string; chef: string; difficulty: Difficulty; photo: Photo; placeholder?: true };
type FeaturedCookbook = {
  id: string;              // catalogue id, for the live price
  title: string; chef: string; chefFirstName: string;
  cover: Photo;
  inside: [string, string] | [string, string, string];
  link: { kind: "includes"; dishTitle: string } | { kind: "same-chef" } | { kind: "none" };
  spreads?: Photo[];       // 0–4 interior spreads; absent → no Peek inside
  placeholder?: true;
};
```

A `assertLandingContent()` call at module load throws during `next build` (`NODE_ENV === "production"`) if any entry has `placeholder: true`, and it lists which ones. In development, placeholders render as a hatched paper block labelled with the asset still needed, so the layout can be reviewed before the photos arrive. Difficulty is shown through the existing `lib/recipe-display.ts` label helper ("advance" → "Advanced").

**Why:** there's no catalogue query that returns honest featured content (no link from book to recipes, unusable images, celebrity-named accounts). A reviewed file is the only way to guarantee every name, photo and claim is real, and the build guard makes "we forgot to swap the placeholder" impossible.
**Alternative:** query top-loved recipes live. Rejected because the top results are celebrity-named accounts with mismatched or stock images. That's exactly what we're removing.

### D2. The featured book's price is read live, with an honest fallback
`FeaturedCookbook` (a server component) fetches `GET {NEXT_PUBLIC_API_URL}/cookbooks/{id}` with `next: { revalidate: 3600 }` and passes only `price`, `discount` and `title` to `cookbookPrice()`, the same helper the app's `CookbookCard` uses. If the request fails, or the returned title doesn't match `FEATURED_COOKBOOK.title`, it renders "Price shown at checkout".

**Why:** prices and discounts (0–15%) change in Chef Studio and admin. A hard-coded price would drift into a wrong claim, and showing no price is better than a wrong one.
**Note:** the response also contains the author's email. We read only the three fields above and never render or log anything else.

### D3. Composition varies as you scroll
| Section | Desktop (≥1024) | Phone (<768) | Ground |
|---|---|---|---|
| Hero | 5/7 split: copy left, one large dish photo right (4:5 crop, max 680 px tall), caption on a paper strip under the photo | Copy → button → photo (4:3) → caption | `--paper` |
| Recipe previews | Heading row, then a compact row of 3 cards (4:3 photos) | One column | `--paper` |
| Featured cookbook | Wide stage: book on the left (cover with soft shadow and page-edge), details on the right, with generous space | Book stage above details | `--paper-deep` (one contrasting band) |
| For chefs | Heading and body left, a short three-item fact list right (Free to publish · You set the price · You ship it). 80% appears once, in the body | Stacked | `--paper` |
| FAQ | Heading left (sticky off), four Q&As right, separated by hairlines | Stacked | `--paper` |
| Closing + footer | Centred heading and button, then a compact one-row footer | Footer links wrap to two rows | `--paper-deep` |

Sections get `scroll-margin-top` equal to the header height, so anchor jumps don't hide headings. The page uses normal document scrolling with no `scroll-behavior` override and no scroll listeners.

### D4. A warm paper palette scoped to the landing page, with one accent
New landing-only tokens on a `.landing` wrapper (other pages are unaffected):

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAF6EE` | main ground |
| `--paper-deep` | `#F1E8D8` | the cookbook band and closing band |
| `--ink` | `#1C1915` | headings and body (16.8:1 on paper) |
| `--ink-soft` | `#5B5248` | secondary text (7.0:1) |
| `--rule` | `#E2D7C4` | hairlines and card edges |
| accent | brand lime `--primary #A7D129` (button fill, ink text) plus its text tint `--cs-accent-text #4D6B16` (small labels, links, 5.9:1 on paper) | one hue, two jobs |

The focus ring is a 2 px `--ink` outline with a 2 px offset (well over 3:1 on both papers).

**Why lime:** it keeps brand continuity with the product the visitor lands in after sign-up.
**Alternative:** a warm terracotta (`#B4532A`) would suit the paper more naturally. It's listed under Open Questions, and swapping it only touches the tokens.

### D5. Typography: DM Sans throughout, bold and tight for headings
Headings use the app's own DM Sans at weight 700 through `.display-1`/`.display-2`/`.display-3`: `clamp(2.5rem, 5.4vw, 4.375rem)`/1.02 at -0.045em, `clamp(1.875rem, 3.4vw, 2.75rem)`/1.08 at -0.035em, and `clamp(1.25rem, 2vw, 1.5rem)`/1.2, with `text-wrap: balance`. No extra font is loaded. (Revised 2026-11-09: Instrument Serif was tried and rejected by the product owner as generic.)

**Why:** a serif display face gives the cookbook feeling, while DM Sans keeps the UI consistent with the app. The existing `.type-display` is tuned for DM Sans at weight 700, so the serif gets its own classes rather than overriding it.

### D6. Peek inside (`CookbookPeek`, the only client island)
- **Structure:** a fixed-aspect stage (the spread's aspect, default 3:2) that holds the cover, centred, and the spread layer. Because the stage size never changes, opening it causes no layout shift. The title, price and button live in the sibling details column, so they stay visible throughout.
- **Control:** a `<button aria-expanded aria-controls="peek-stage">` labelled "Peek inside" / "Back to cover". With 2+ spreads, "Previous page" and "Next page" buttons appear, plus an `aria-live="polite"` "Page n of N", and they're disabled at the ends. Everything is native buttons, so click, tap, Enter and Space all work. Focus stays on the control that was used.
- **Motion:** the cover turns open around its left edge (`rotateY` 0 → -165°, `perspective: 1600px`, `SPRING.soft`) to reveal the spread, and between spreads there's a 150 ms crossfade. Pressing a button gives `whileTap` scale 0.97 with `SPRING.snappy`.
- **Reduced motion:** `useReducedMotion()` switches to a conditional render that swaps the images instantly, with no transform and no fade.
- **Loading:** spread images preload on the button's `pointerenter`/`focus`, so the first open isn't blank. The cover is `priority` only if the section is above the fold (it isn't), otherwise lazy.
- **No spreads:** the component renders the cover and the "Inside:" list, with no button and no client JS beyond what's static.

**Why a turn instead of a modal:** opening the book in place keeps the price and buy button in view, which the brief requires, and the motion is earned by a real action.

### D7. Header and footer
`Header`'s guest links become `[{Cookbooks, "/#cookbook"}, {For chefs, "/#for-chefs"}]`, plus a Sign in link. "Get started" is removed from the guest bar because the hero owns sign-up. Below `lg`, the existing sheet menu lists the same two anchors, and Sign in stays visible in the bar. The signed-in branch isn't touched. `Footer` is rebuilt as one compact row (logo · Cookbooks · For chefs · FAQ · Sign in · Privacy Policy · Terms of Service · ©), and every gated link and dead anchor is dropped. Both are shared with the auth and legal pages. The absolute `/#…` anchors work from there.

### D8. Deletions
Delete the sections and helpers listed in the proposal's *Remove* list. Remove `react-fast-marquee` and `components/kibo-ui/marquee` (their only importer is `SocialProof`, so this is verified before deleting). Drop the `.landing-root`, `.surface-raised` and `.surface-glow` CSS rules, but keep `.surface-base` (used by `LegalPage`). Remove `time`/`rating` from `Dish`/`AuthPanel` in `imagery.ts`, which nothing renders. The `components/Home/motion.ts` re-export goes once nothing imports it. Dependency changes use pnpm 11.22 (the version `node_modules` was installed with), and `pnpm-workspace.yaml` and `backend/` stay untouched (monorepo).

### D9. Doodles (added 2026-11-09 at the owner's request)
`components/Home/Doodles.tsx` draws scalloped seals, starbursts, sparkles and a squiggle as inline SVG, in lime plus two decoration-only colours (`--tomato #E4572E`, `--butter #F4C542`). The hero has a rotating badge reading "Free recipes ✦ Follow chefs ✦ Printed cookbooks" and a star on the photo. Recipe cards carry a difficulty seal, the cookbook sits on a slow-turning burst with a "Printed & shipped" sticker, For chefs has a "Publish ✦ Set your price ✦ Ship it" badge, and the FAQ and closing sections have a few stars. Motion is CSS only (spin 18–60 s, bob 5 s, wiggle on hover), all decoration is `aria-hidden`, and everything stops under reduced motion. `.landing` uses `overflow-x: clip` so shapes hanging off edges never cause horizontal scroll.

### D10. Drawn dishes instead of photos (added 2026-11-09 at the owner's request)
The catalogue's photos were inconsistent and mostly taken from other sites, and they clashed with the drawn cover and doodles. `components/Home/DishArt.tsx` draws each featured dish as a flat, top-down plate in the landing palette (tehari, carbonara, rogan josh, matcha mochi), with seeded detail so server and client markup match. The hero is a landscape table scene (plate on a scalloped placemat, pickles, yoghurt, spoon) in a 50/50 split with the copy, so the headline sets in 2–3 lines. Motion: steam rises, the hero plate turns over 140 s, sparkles twinkle, and a card's plate turns 28° on hover; all of it stops under reduced motion. Titles, chefs and difficulties still come from real catalogue records. Real photos stay in the app, where chefs upload their own.

## Risks / Trade-offs

- [The page can't go live until the content arrives] → This is intentional (D1). The dev build renders labelled placeholders so the design can be reviewed and approved first.
- [The API is unreachable at build or revalidation time] → Fall back to "Price shown at checkout" (D2). It never shows a stale number.
- [Header changes also show on the auth and legal pages] → The links stay valid there, and the signed-in header is unchanged. Review `/sign-in` and `/privacy-policy` during QA.
- [The page-turn feels heavy on low-end phones] → It's a single transformed element (compositor only) with no filters or blur. Reduced motion skips it.
- [Lime on cream may read acidic] → It's limited to one button fill per screen and small olive labels. The alternative accent is ready (D4).

## Migration Plan

Pure frontend change to `/`, plus the shared header and footer, shipped as one PR on a feature branch. Rollback is a revert. No data or API changes, and no new redirects (no route is renamed).

## Open Questions

- **Accent:** keep the brand lime, or use terracotta for the landing page only? This is a token swap and doesn't change the structure.
- **Return to apply:** should a later change add a `?next=/apply-chef` return path after sign-up, so "Create an account to apply" lands on the application? That's out of scope here, and the copy is already worded so it doesn't promise it.
