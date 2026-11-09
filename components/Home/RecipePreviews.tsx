import Link from "next/link";
import { difficultyDisplay } from "@/lib/recipe-display";
import { PREVIEW_DISHES, type Difficulty } from "./landing-content";
import { DISH_TINT, DishArt } from "./DishArt";
import { Burst, Seal } from "./Doodles";

/* Each difficulty gets its own sticker colour; the tilt alternates so the
   three cards don't look stamped out of one mould. */
const SEAL_FILL: Record<Difficulty, string> = {
  beginner: "var(--landing-accent)",
  intermediate: "var(--butter)",
  advance: "var(--tomato)",
};
const TILTS = ["-10deg", "8deg", "-5deg"];

/**
 * A taste of the catalogue, drawn. The cards are deliberately inert (no
 * links, no save or love controls) because a guest can't open a recipe yet;
 * the one action is the button underneath. Steam rises from the hot dishes,
 * and hovering a card gives its plate a little spin.
 */
export function RecipePreviews() {
  const dishes = PREVIEW_DISHES.slice(0, 3);
  if (dishes.length === 0) return null;

  return (
    <section
      id="recipes"
      className="mx-auto max-w-6xl px-4 pb-20 md:px-8 md:pb-28"
    >
      <h2 className="display-2 flex items-center gap-3">
        What looks good tonight?
        <Burst className="landing-spin h-9 w-9 shrink-0 md:h-11 md:w-11" />
      </h2>

      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {dishes.map((dish, i) => (
          <li key={`${dish.title}-${i}`} className="art-card">
            <div className="relative">
              <div
                className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl"
                style={{ backgroundColor: DISH_TINT[dish.art] }}
              >
                <DishArt
                  dish={dish.art}
                  uid={`preview-${i}`}
                  label={dish.alt}
                  className="aspect-square h-[94%] w-auto"
                />
              </div>
              <Seal
                fill={SEAL_FILL[dish.difficulty]}
                className="landing-tilt landing-wiggle absolute -right-2 -top-4 w-16"
                style={{ ["--tilt" as string]: TILTS[i % TILTS.length] }}
              >
                {difficultyDisplay(dish.difficulty).label}
              </Seal>
            </div>
            <p className="type-subheading mt-4">{dish.title}</p>
            <p className="type-caption mt-1" style={{ color: "var(--ink-soft)" }}>
              by {dish.chef}
            </p>
          </li>
        ))}
      </ul>

      <Link href="/sign-up" className="landing-button landing-focus mt-12">
        Sign up to explore recipes
      </Link>
    </section>
  );
}

export default RecipePreviews;
