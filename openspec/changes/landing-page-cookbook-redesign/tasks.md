# Tasks

> Ask before running `pnpm build`, the dev server or any browser check. Verification otherwise uses `pnpm exec tsc --noEmit` and `pnpm exec eslint` on the touched files.
> **Blocked on content for go-live:** groups 1–8 can be built and reviewed with dev placeholders, but task 9.4 needs the assets listed in proposal.md (*Content you need to provide*).

## 1. Content model and guard

- [x] 1.1 Create `components/Home/landing-content.ts` with the `LandingDish` / `FeaturedCookbook` types, `HERO_DISH`, `PREVIEW_DISHES` and `FEATURED_COOKBOOK` (all `placeholder: true` for now) and `assertLandingContent()`. Verify: `tsc` passes, and with `NODE_ENV=production`, importing the module throws an error that lists every placeholder entry
- [x] 1.2 Add a dev-only `PlaceholderPhoto` (hatched paper block labelled with the asset needed) that renders when `placeholder` is set. Verify: it isn't reachable in production code paths (guarded by 1.1)

## 2. Foundations

- [x] 2.1 Heading font: bold DM Sans `.display-*` classes (Instrument Serif tried, then removed at the owner's request). Verify: `tsc` passes and no extra font loads
- [x] 2.2 Add the landing-scoped tokens (`--paper`, `--paper-deep`, `--ink`, `--ink-soft`, `--rule`), the `.display-1`/`.display-2` classes, the ink focus ring and `scroll-margin-top` under `.landing` in `app/globals.css`. Remove `.landing-root`, `.surface-raised` and `.surface-glow`, and keep `.surface-base`. Verify: grep shows no remaining users of the removed classes, and `LegalPage` still uses `.surface-base`

## 3. Header and footer

- [x] 3.1 Update `Header` guest links to Cookbooks (`/#cookbook`) and For chefs (`/#for-chefs`) plus Sign in (`/sign-in`) on desktop and in the mobile sheet, and remove "Get started" from the guest bar. Leave the signed-in branch as is. Verify: the guest-branch `href`s are exactly those three, and the signed-in code diff is empty
- [x] 3.2 Rebuild `Footer` as a compact row: Cookbooks, For chefs, FAQ, Sign in, Privacy Policy, Terms of Service, © year. Verify: no `href` points to `/recipes`, `/cookbooks`, `/chefs`, `/apply-chef` or a removed anchor

## 4. Hero and recipe previews

- [x] 4.1 Build `components/Home/Hero.tsx` (server): H1, sub, a "Create a free account" button to `/sign-up`, and the `HERO_DISH` photo (`priority`, explicit `sizes`) with a "{title} · {chef} · {difficulty}" caption, laid out per design D3. Verify: the copy matches proposal.md exactly
- [x] 4.2 Build `components/Home/RecipePreviews.tsx` (server): the "What looks good tonight?" heading, up to 3 inert cards (no links, no controls), and a "Sign up to explore recipes" button to `/sign-up`. Verify: the cards contain no `<a>` or `<button>` and render at most 3 even if more are configured

## 5. Featured cookbook and Peek inside

- [x] 5.1 Build `components/Home/FeaturedCookbook.tsx` (server): live price via `GET /cookbooks/:id` (`revalidate: 3600`, read only `price`, `discount` and `title`) through `cookbookPrice()`, with a title-mismatch or error fallback of "Price shown at checkout". It also shows the "Inside:" list, the connection line (includes / same-chef / none), the shipping line, and a "Sign up to buy this book" button to `/sign-up`. Verify: forcing the fetch to fail shows the fallback, and a discounted book shows the struck-through original
- [x] 5.2 Featured book as a flip book: vendored Kokonut UI `PageFlip` (`components/kokonutui/page-flip.tsx`, MIT, on framer-motion) wrapped by `CookbookFlip`, pages from `BookPages.tsx` (drawn cover, a spread per recipe, closing page, back board). Replaces the earlier Peek inside toggle

## 6. For chefs, FAQ, closing

- [x] 6.1 Build `components/Home/ForChefs.tsx` (server) with the copy from proposal.md, the three-item fact list and a "Create an account to apply" button to `/sign-up`. Verify: 80% appears once and the ID line appears once
- [x] 6.2 Rewrite `components/Home/FAQ.tsx` (server): the four Q&As from proposal.md, always visible. Verify: the copy matches exactly, with no "library" claim about books
- [x] 6.3 Rewrite `components/Home/CTA.tsx` (server): "Your next favourite recipe is a free account away." and a "Create a free account" button to `/sign-up`. Verify: there's a single button

## 7. Page assembly and cleanup

- [x] 7.1 Rewrite `app/page.tsx`: a `.landing` wrapper with Header, Hero, RecipePreviews, FeaturedCookbook, ForChefs, FAQ, CTA and Footer, plus updated metadata (no "thousands", no "browse free"). Verify: the section order matches the spec
- [x] 7.2 Delete `Beams`, `SocialProof`, `Personas`, `Features`, `HowItWorks`, `Testimonials`, `Pricing`, `AboutUs`, `HeroVisual`, `shared/useStaged`, `shared/Reveal`, `shared/SectionHeading`, `shared/Pressable`, `components/kibo-ui/marquee` and `components/Home/motion.ts` once grep confirms nothing else imports them. Verify: `tsc` and `eslint` pass on the touched files
- [x] 7.3 Remove `time`/`rating` from `imagery.ts` types and data. Verify: `AuthLayout` and the auth pages still type-check
- [x] 7.4 Remove `react-fast-marquee` with `npx pnpm@11.22.0 remove`. Verify: the lockfile diff only drops that package, and `pnpm-workspace.yaml` and `backend/` are unchanged

## 8. Truthfulness audit

- [x] 8.1 Grep the rendered components (Home, Header, Footer) for: weekly, payout, `\d+ ?min`, rating, ★, subscription, thousands, browse, diet, ingredient, AI, testimonial, `\$\d`. Verify: no hits outside the live price helper

## 9. Integration review (ask first)

- [ ] 9.1 Ask, then run `pnpm build` with placeholders still in place. Verify: it **fails** with the placeholder list (proves the guard)
- [ ] 9.2 Ask, then review `/` in the dev server at 1440×900, 1024×768, 768×1024, 390×844, 360×740 and 320×640. Verify: the spec's mobile scenarios hold (sign-up visible on the first screen at 390 and 360, no horizontal scroll, 44 px targets, stacked layout)
- [ ] 9.3 Keyboard and reduced-motion pass: Tab through the whole page, operate Peek inside with Enter and Space, and repeat with reduced motion emulated. Also check header anchors from `/sign-in` and `/privacy-policy`. Verify: every spec scenario under Keyboard, Peek inside, Reduced motion, Guest routing and Normal scrolling
- [ ] 9.4 Content is now taken from the catalogue (see `landing-content.ts`); still to do: add the featured book's id for the live price, the 2–3 "Inside:" titles, and optional spreads. Then, replace the placeholders in `landing-content.ts` (upload the photos to Cloudinary under `landing/`), then ask and run `pnpm build`. Verify: the build passes, and the live price matches the book in Chef Studio

## Workflow follow-up

- Commit on a feature branch with a Conventional Commit and no co-author, then open a PR.
- Archive with `/opsx:archive` after merge.
- Consider separate changes for the out-of-scope items flagged in proposal.md.
