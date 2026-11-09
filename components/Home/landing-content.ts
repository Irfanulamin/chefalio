/**
 * Curated content for the public landing page.
 *
 * Every dish and book here is copied from a real Chefalio catalogue record
 * and credited to the chef who published it. Dishes are drawn (DishArt.tsx)
 * and the book's cover is drawn (BookCover.tsx), because most catalogue
 * photos are stock or taken from other sites. The catalogue also doesn't
 * record a book's contents, so the flip book's pages show the chef's own
 * recipes and say so.
 *
 * Entries marked `placeholder: true` fail a production build (see
 * `assertLandingContent`), so placeholder content can't ship by accident.
 */

import type { DishArtId } from "./DishArt";

export type Difficulty = "beginner" | "intermediate" | "advance";

export type LandingDish = {
  title: string;
  chef: string;
  difficulty: Difficulty;
  /** Which drawn dish to show */
  art: DishArtId;
  /** Describes the illustration for screen readers */
  alt: string;
  placeholder?: true;
};

export type BookRecipe = {
  title: string;
  difficulty: Difficulty;
  tags: string[];
  art: DishArtId;
  alt: string;
};

export type FeaturedCookbook = {
  /** Catalogue id, used to read the live price from `GET /cookbooks/:id` */
  id: string;
  title: string;
  chef: string;
  /** Used in "Printed and shipped by {chefFirstName}." */
  chefFirstName: string;
  /** Two or three recipe titles printed in the book. The catalogue doesn't
      record a book's contents, so leave this out until the chef confirms. */
  inside?: [string, string] | [string, string, string];
  /** How the book relates to the dishes shown above it */
  link:
    | { kind: "includes"; dishTitle: string }
    | { kind: "same-chef" }
    | { kind: "none" };
  /**
   * The chef's own recipes from the catalogue, shown as pages of the flip
   * book (a drawing on the left, the facts on the right). Only facts the
   * catalogue holds: title, difficulty and tags.
   */
  recipes: BookRecipe[];
  placeholder?: true;
};

/* Dishes are drawn, not photographed (see `DishArt.tsx`): one consistent
   look Chefalio owns, with no photo rights to worry about. Every title, chef
   and difficulty below is copied from the live catalogue record. */

export const HERO_DISH: LandingDish = {
  title: "Dhakaiya Beef Tehari",
  chef: "Daniel Humm",
  difficulty: "intermediate",
  art: "tehari",
  alt: "Illustration of beef tehari on a patterned plate, with pickled vegetables, yoghurt and a spoon",
};

export const PREVIEW_DISHES: LandingDish[] = [
  {
    title: "Roman Carbonara Classica",
    chef: "Heinz Beck",
    difficulty: "intermediate",
    art: "carbonara",
    alt: "Illustration of spaghetti carbonara with pancetta and parsley",
  },
  {
    title: "Chicken Rogan Josh",
    chef: "Gaggan Anand",
    difficulty: "beginner",
    art: "roganjosh",
    alt: "Illustration of chicken rogan josh with red pepper and coriander",
  },
  {
    title: "Matcha Warabi Mochi",
    chef: "Niki Nakayama",
    difficulty: "intermediate",
    art: "mochi",
    alt: "Illustration of matcha-dusted warabi mochi on a scalloped plate",
  },
];

/* Heinz Beck's book, so the line under it ("More from this chef.") is true:
   his carbonara is one of the previews. The catalogue's cover image for this
   book is a photo of a different author's book, so it isn't used. */
export const FEATURED_COOKBOOK: FeaturedCookbook = {
  // Fill in the catalogue id to show the live price. Until then the page
  // says "Price shown at checkout".
  id: "",
  title: "La Pergola: Rome from Above",
  chef: "Heinz Beck",
  chefFirstName: "Heinz",
  link: { kind: "same-chef" },
  recipes: [
    {
      title: "Roman Carbonara Classica",
      difficulty: "intermediate",
      tags: ["Italian", "Pasta", "Roman", "Classic"],
      art: "carbonara",
      alt: "Illustration of spaghetti carbonara with pancetta and parsley",
    },
    {
      title: "La Pergola Chocolate Tart",
      difficulty: "intermediate",
      tags: ["Italian", "Dessert", "Chocolate", "Tart"],
      art: "tart",
      alt: "Illustration of a chocolate tart with raspberries and sea salt",
    },
  ],
};

/** The names of entries that still need real content. */
export function pendingLandingContent(): string[] {
  const pending: string[] = [];
  if (HERO_DISH.placeholder) pending.push("HERO_DISH");
  PREVIEW_DISHES.forEach((d, i) => {
    if (d.placeholder) pending.push(`PREVIEW_DISHES[${i}]`);
  });
  if (FEATURED_COOKBOOK.placeholder) pending.push("FEATURED_COOKBOOK");
  return pending;
}

/**
 * Claims the cookbook section makes about the dishes above it. "Includes
 * {dish}, pictured above" must name a dish that is on the page, and "More
 * from this chef" needs one of those dishes to be by the book's chef.
 */
export function landingContentProblems(): string[] {
  const shown = [HERO_DISH, ...PREVIEW_DISHES.slice(0, 3)];
  const book = FEATURED_COOKBOOK;
  const link = book.link;
  const problems: string[] = [];

  if (link.kind === "includes" && !shown.some((d) => d.title === link.dishTitle)) {
    problems.push(
      `FEATURED_COOKBOOK.link names "${link.dishTitle}", which isn't shown on the page`,
    );
  }
  if (link.kind === "same-chef" && !shown.some((d) => d.chef === book.chef)) {
    problems.push(
      `FEATURED_COOKBOOK.link says "More from this chef", but no dish shown is by ${book.chef}`,
    );
  }
  if (book.recipes.length === 0 || book.recipes.length > 4) {
    problems.push("FEATURED_COOKBOOK.recipes needs 1 to 4 entries");
  }
  return problems;
}

/**
 * Fails a production build while any landing content is still a placeholder.
 * In development the page renders labelled placeholder blocks instead.
 */
export function assertLandingContent(): void {
  if (process.env.NODE_ENV !== "production") return;
  const pending = pendingLandingContent();
  if (pending.length > 0) {
    throw new Error(
      `Landing page content is still placeholder: ${pending.join(", ")}. ` +
        "Fill components/Home/landing-content.ts before building for production.",
    );
  }
  const problems = landingContentProblems();
  if (problems.length > 0) {
    throw new Error(`Landing page content is inconsistent: ${problems.join("; ")}.`);
  }
}

assertLandingContent();
