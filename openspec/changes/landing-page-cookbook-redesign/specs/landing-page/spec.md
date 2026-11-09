# Spec Delta

## Purpose

Defines what the public landing page at `/` shows, in what order, where each action leads a guest, and how it behaves on phones, by keyboard and under reduced motion, so that a visitor sees real food, knows who made it, and understands what a free account gives them.

## ADDED Requirements

### Requirement: Section order
Between the header and the footer, the landing page SHALL render exactly these sections in order: Hero, Recipe previews (`#recipes`), Featured cookbook (`#cookbook`), For chefs (`#for-chefs`), FAQ (`#faq`), Closing call to action.

#### Scenario: Guest scrolls the page
- **WHEN** a signed-out visitor loads `/` and scrolls to the end
- **THEN** they pass the six sections in that order, followed by the footer, and no pricing table, testimonial, stats band, admin preview or feature walkthrough appears

### Requirement: Header for guests
For signed-out visitors, the header SHALL show only the Chefalio logo and the links Cookbooks, For chefs and Sign in. Cookbooks and For chefs SHALL jump to `#cookbook` and `#for-chefs` on the landing page. The signed-in header SHALL be unchanged.

#### Scenario: Jump from the header
- **WHEN** a guest activates "Cookbooks" or "For chefs" in the header, on desktop or in the mobile menu
- **THEN** the page scrolls to the matching section with normal scrolling, and the section heading is not hidden under the sticky header

#### Scenario: Header on another public page
- **WHEN** a guest activates "For chefs" in the header on `/sign-in` or `/privacy-policy`
- **THEN** they land on `/#for-chefs`

### Requirement: Hero offers sign-up with one credited dish
The hero SHALL show the H1 "Find a recipe you'll want to cook again", the sentence "Discover free recipes, follow the chefs behind them, and buy their printed cookbooks.", a "Create a free account" button, and one dish photograph captioned with its title, chef and difficulty.

#### Scenario: Sign-up is visible early on a phone
- **WHEN** a guest opens `/` at 390×844 or 360×740
- **THEN** the H1 and the "Create a free account" button are fully visible without scrolling, and the photo follows below them

#### Scenario: Hero on desktop
- **WHEN** a guest opens `/` at 1440×900
- **THEN** the copy and button sit beside the photograph, and the caption shows the dish title, chef name and difficulty

### Requirement: Recipe previews are curated and inert
The Recipe previews section SHALL show the heading "What looks good tonight?" and at most three dish cards. Each card SHALL show a photograph, dish name, chef and difficulty. Cards SHALL NOT be links and SHALL NOT contain search, filter, save, love or follow controls. The section's only action SHALL be "Sign up to explore recipes".

#### Scenario: Guest inspects a preview card
- **WHEN** a guest hovers, clicks or tabs across the recipe cards
- **THEN** nothing navigates and nothing receives focus inside the cards, and the next focus stop is the "Sign up to explore recipes" button

### Requirement: Featured cookbook shows real, current details
The Featured cookbook section SHALL show the book's real cover, its title, the chef, the current price, and two or three recipe titles it contains. It SHALL also show the line "Printed and shipped by {chef}. Track your order under Activity." and a "Sign up to buy this book" button. The current price SHALL be read from the live catalogue, and the original price SHALL be shown struck through when a discount applies.

#### Scenario: Book is discounted
- **WHEN** the featured book has a discount greater than zero in the catalogue
- **THEN** the section shows the discounted price and the original price struck through, both matching what a signed-in buyer would see

#### Scenario: Live price unavailable
- **WHEN** the catalogue cannot be reached at build or revalidation time
- **THEN** the section shows "Price shown at checkout" instead of any price, and never shows a possibly stale figure

### Requirement: Featured cookbook states its link to the dishes
When a featured dish is one of the book's recipes, the section SHALL say "Includes {dish}, pictured above." When it is only by the same chef, the section SHALL say "More from this chef." When neither applies, it SHALL show no connection line.

#### Scenario: Dish is in the book
- **WHEN** the content marks the hero or a preview dish as included in the featured book
- **THEN** the section shows "Includes {dish name}, pictured above."

### Requirement: Flip-through book
The featured cookbook SHALL be shown as a book a visitor can page through, by dragging or tapping a corner or with "Previous page" / "Next page" buttons that also accept ← and →. Its pages SHALL print only catalogue facts, and the title, price and buy button SHALL stay visible beside it.

#### Scenario: Book contents
- **WHEN** the visitor pages through the book
- **THEN** they see the drawn cover, one spread per featured recipe (a drawing on the left; title, chef, difficulty and tags on the right, labelled as the chef's recipes on Chefalio), a closing page and the back board

#### Scenario: Keyboard user pages through
- **WHEN** a keyboard user tabs to "Next page" and presses Enter, Space or →
- **THEN** the next spread turns into view, the page count is announced, focus stays on the button, and the button stays focusable at the last spread

#### Scenario: Narrow screen
- **WHEN** the book is narrower than 520 px
- **THEN** it shows one page at a time and a tap on a page's left edge turns back

### Requirement: For chefs section
The For chefs section SHALL show the heading "Turn your recipes into a cookbook.", state that recipes are published free, that chefs set their printed book's price and keep 80% of each sale, and SHALL state in one line that applications include ID verification and a review. Its only action SHALL be "Create an account to apply", linking to `/sign-up`.

#### Scenario: Chef reads the section
- **WHEN** a guest reads the For chefs section
- **THEN** they see the 80% figure once, one line about ID verification and review, and one button to `/sign-up`

### Requirement: FAQ answers four questions
The FAQ SHALL answer, briefly and in this order: Are recipes free? Are cookbooks printed? Where can I track my order? How do I become a chef? All answers SHALL be visible without expanding anything.

#### Scenario: Order tracking answer
- **WHEN** a guest reads "Where can I track my order?"
- **THEN** the answer names Activity in their account, and the page does not claim purchased books appear in a digital library

### Requirement: Guest routing
Every sign-up action on the page SHALL link to `/sign-up`, and "Sign in" SHALL link to `/sign-in`. No control on the page or in its header or footer SHALL link a guest to a route that requires sign-in (`/recipes`, `/cookbooks`, `/chefs`, `/apply-chef`, `/activity`), and no link SHALL point to an anchor missing from the page.

#### Scenario: Link audit
- **WHEN** every `href` rendered for a signed-out visitor on `/` is listed
- **THEN** each is one of `/`, `/sign-up`, `/sign-in`, `/privacy-policy`, `/terms-of-service`, `/#cookbook`, `/#for-chefs` or `/#faq`, and every anchor exists on the page

### Requirement: Truthful content
The page, header and footer SHALL NOT contain weekly payout claims, cook times, ratings, review counts, platform statistics, earnings examples, testimonials, ingredient/diet/time filters, subscriptions, AI features, guest browsing, or claims that purchased books appear instantly in a digital library. Every featured dish and cookbook SHALL be real catalogue content credited to the chef who published it.

#### Scenario: Copy audit
- **WHEN** the rendered text of `/` is searched for "weekly", "payout", "min", "rating", "★", "subscription", "browse free", "diet", "ingredient", "AI" and "library"
- **THEN** none appear, except "library" in the FAQ's mention of saved recipes, if used

#### Scenario: Placeholder content in production
- **WHEN** a production build runs while any landing content entry is still marked as a placeholder
- **THEN** the build fails with a message naming the missing entries

### Requirement: Keyboard and focus
All interactive controls SHALL be reachable by Tab in visual order, SHALL show a visible focus indicator with at least 3:1 contrast against warm paper backgrounds, and SHALL NOT be hidden under the sticky header when focused.

#### Scenario: Tab through the page
- **WHEN** a keyboard user tabs from the top of `/` to the footer
- **THEN** focus visits the header links, the hero button, "Sign up to explore recipes", the book's "Previous page" and "Next page" buttons, "Sign up to buy this book", "Create an account to apply", the closing button and the footer links, in that order, with a visible ring on each

### Requirement: Touch targets and mobile layout
On viewports from 320 to 768 px wide, every link and button SHALL have a touch target of at least 44×44 px, sections SHALL stack into one column, and the page SHALL NOT scroll horizontally.

#### Scenario: Narrow phone
- **WHEN** the page is viewed at 320 px wide
- **THEN** there is no horizontal scroll, dish cards stack, the cookbook cover sits above its details, and all buttons are full width

### Requirement: Reduced motion
Motion SHALL be limited to the book's page turn, small press and hover feedback, and slow constant motion on decorative doodles (badges, stars, sparkles), which SHALL be hidden from assistive technology and SHALL NOT respond to scroll. Under `prefers-reduced-motion: reduce`, the book SHALL switch spreads directly with no page-turn animation, and no other element SHALL move.

#### Scenario: Reduced motion enabled
- **WHEN** a visitor with reduced motion pages through the featured book
- **THEN** spreads swap instantly, there's no page-turn animation, and scrolling the page triggers no animation anywhere
- **AND** every decorative doodle is still, with no rotation, bobbing or wiggle

### Requirement: Normal scrolling
The page SHALL NOT hijack, smooth-override, pin or scrub scrolling, and no element SHALL animate because of scroll position.

#### Scenario: Scroll with wheel and touch
- **WHEN** a visitor scrolls with a wheel, trackpad or touch
- **THEN** the page scrolls at native speed and no section pins, fades in or moves in response
