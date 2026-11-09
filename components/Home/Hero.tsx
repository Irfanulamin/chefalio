import Link from "next/link";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";
import { difficultyDisplay } from "@/lib/recipe-display";
import { HERO_DISH } from "./landing-content";
import { HeroTable } from "./DishArt";
import { Sparkle, SpinBadge, Squiggle, Star } from "./Doodles";

/**
 * One promise, one action, one dish. The dish is a real recipe from the
 * catalogue, credited to its chef, drawn as a table seen from above.
 *
 * The copy and the picture share the width evenly, so the headline sets in
 * two or three lines rather than a word per line, and the picture is
 * landscape. On phones the copy and button come first, so "Create a free
 * account" is on the first screen even at 360 × 740.
 */
export function Hero() {
  const dish = HERO_DISH;

  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-8 md:pb-24 md:pt-32"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <Sparkle
            className="landing-bob absolute -top-8 right-2 h-9 w-9 sm:right-10"
            color="var(--butter)"
          />
          <Sparkle
            className="landing-bob absolute -top-1 right-12 h-4 w-4 sm:right-20"
            style={{ animationDelay: "-2s" }}
          />

          <h1 className="display-1 max-w-[15ch]">
            Find a recipe you&rsquo;ll want to cook{" "}
            <span className="relative inline-block whitespace-nowrap">
              again
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full md:-bottom-3 md:h-4" />
            </span>
          </h1>
          <p
            className="type-body-lg mt-6 max-w-[38ch]"
            style={{ color: "var(--ink-soft)" }}
          >
            Discover free recipes, follow the chefs behind them, and buy their
            printed cookbooks.
          </p>
          <Link href="/sign-up" className="landing-button landing-focus mt-8">
            Create a free account
          </Link>
        </div>

        <figure>
          <div className="relative">
            <HeroTable dish={dish.art} label={dish.alt} />

            <SpinBadge
              id="hero-badge"
              text="Free recipes ✦ Follow chefs ✦ Printed cookbooks ✦ "
              center={<ForkKnifeIcon weight="fill" className="h-[30%] w-[30%]" />}
              className="landing-wiggle absolute left-3 top-3 w-24 sm:w-28 lg:-left-10 lg:-top-10 lg:w-32"
            />
            <Star className="landing-spin-reverse absolute -bottom-5 right-5 h-12 w-12 lg:-bottom-6 lg:-right-6 lg:h-14 lg:w-14" />
          </div>

          <figcaption
            className="type-caption mt-4 flex flex-wrap gap-x-2"
            style={{ color: "var(--ink-soft)" }}
          >
            <span className="font-semibold" style={{ color: "var(--ink)" }}>
              {dish.title}
            </span>
            <span aria-hidden>·</span>
            <span>{dish.chef}</span>
            <span aria-hidden>·</span>
            <span>{difficultyDisplay(dish.difficulty).label}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default Hero;
