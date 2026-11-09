import { difficultyDisplay } from "@/lib/recipe-display";
import type { BookRecipe, FeaturedCookbook } from "./landing-content";
import { DISH_TINT, DishArt, SPARKLE_PATH } from "./DishArt";
import { BookBack, BookCover } from "./BookCover";

/**
 * The pages of the featured flip book. Each recipe is a spread: the drawing
 * on the left, its facts on the right. Text is sized in `cqw` because every
 * page is a size container, so a page scales as one piece.
 *
 * Only catalogue facts are printed (title, chef, difficulty, tags). The
 * pages say these are the chef's recipes on Chefalio, not a scan of the
 * book's contents, which the catalogue doesn't record.
 */

function Folio({ n }: { n: number }) {
  return (
    <p
      className="mt-auto text-center text-[3cqw] tabular-nums"
      style={{ color: "var(--ink-soft)" }}
    >
      {n}
    </p>
  );
}

function ArtPage({ recipe, n, uid }: { recipe: BookRecipe; n: number; uid: string }) {
  return (
    <div
      className="relative flex size-full flex-col items-center px-[8cqw] pb-[7cqw] pt-[10cqw]"
      style={{ backgroundColor: DISH_TINT[recipe.art] }}
    >
      <svg aria-hidden viewBox="-12 -12 24 24" className="absolute right-[9cqw] top-[9cqw] w-[7cqw]">
        <path d={SPARKLE_PATH} fill="var(--tomato)" />
      </svg>
      <div className="grid flex-1 place-items-center">
        <DishArt dish={recipe.art} uid={uid} label={recipe.alt} className="w-[86cqw]" />
      </div>
      <Folio n={n} />
    </div>
  );
}

function RecipePage({
  recipe,
  chef,
  n,
}: {
  recipe: BookRecipe;
  chef: string;
  n: number;
}) {
  return (
    <div className="flex size-full flex-col px-[10cqw] pb-[7cqw] pt-[12cqw]">
      <p
        className="text-[3.2cqw] font-semibold uppercase"
        style={{ letterSpacing: "0.18em", color: "var(--landing-accent-text)" }}
      >
        From {chef}&rsquo;s kitchen
      </p>
      <p
        className="mt-[4cqw] text-[9cqw] font-bold"
        style={{ lineHeight: 1.02, letterSpacing: "-0.035em", textWrap: "balance" }}
      >
        {recipe.title}
      </p>
      <div className="mt-[5cqw] h-[2px] w-[12cqw]" style={{ backgroundColor: "var(--tomato)" }} />

      <dl className="mt-[6cqw] grid grid-cols-[auto_1fr] gap-x-[5cqw] gap-y-[2.5cqw] text-[3.8cqw]">
        <dt style={{ color: "var(--ink-soft)" }}>Chef</dt>
        <dd className="font-medium">{chef}</dd>
        <dt style={{ color: "var(--ink-soft)" }}>Difficulty</dt>
        <dd className="font-medium">{difficultyDisplay(recipe.difficulty).label}</dd>
      </dl>

      <ul className="mt-[6cqw] flex flex-wrap gap-[2cqw]">
        {recipe.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full px-[3cqw] py-[1cqw] text-[3.2cqw] font-medium"
            style={{ backgroundColor: "var(--paper-deep)" }}
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-[8cqw] text-[3.6cqw] leading-snug" style={{ color: "var(--ink-soft)" }}>
        The full recipe is free to read on Chefalio with an account.
      </p>
      <Folio n={n} />
    </div>
  );
}

function ClosingPage({ chefFirstName, n }: { chefFirstName: string; n: number }) {
  return (
    <div className="flex size-full flex-col px-[10cqw] pb-[7cqw] pt-[12cqw]">
      <p
        className="text-[8cqw] font-bold"
        style={{ lineHeight: 1.04, letterSpacing: "-0.035em", textWrap: "balance" }}
      >
        Want it on your shelf?
      </p>
      <p className="mt-[5cqw] text-[3.8cqw] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        This cookbook is printed and shipped by {chefFirstName}. Track your
        order under Activity.
      </p>
      <Folio n={n} />
    </div>
  );
}

/** Cover, a spread per recipe, a closing page, and the back board. */
export function buildBookPages(book: FeaturedCookbook) {
  const pages = [
    <BookCover key="cover" title={book.title} chef={book.chef} />,
  ];
  book.recipes.forEach((recipe, i) => {
    pages.push(
      <ArtPage key={`art-${i}`} recipe={recipe} n={pages.length} uid={`book-${i}`} />,
      <RecipePage key={`text-${i}`} recipe={recipe} chef={book.chef} n={pages.length + 1} />,
    );
  });
  pages.push(
    <ClosingPage key="closing" chefFirstName={book.chefFirstName} n={pages.length} />,
    <BookBack key="back" line="Recipes from the chefs who cook them." />,
  );
  return pages;
}
