import Link from "next/link";
import { ChefHatIcon } from "@phosphor-icons/react/dist/ssr";
import { SpinBadge } from "./Doodles";

/**
 * The chef pitch, stated plainly. 80% is the backend's CHEF_PROFIT_RATE and
 * appears once, in the body. The fact list restates the other two points
 * rather than repeating the number.
 *
 * The button goes to sign-up, not /apply-chef: the application lives inside
 * an account, and sign-up has no "return to" step to carry someone there.
 */
const FACTS = [
  { term: "Free to publish", detail: "Share recipes with no fee." },
  { term: "You set the price", detail: "For your printed cookbook." },
  { term: "You ship it", detail: "Buyers follow each order under Activity." },
] as const;

export function ForChefs() {
  return (
    <section
      id="for-chefs"
      className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-14"
    >
      <div className="lg:col-span-7">
        <h2 className="display-2">Turn your recipes into a cookbook.</h2>
        <p className="type-body-lg mt-5 max-w-[52ch]">
          Publish your recipes for free. When you&rsquo;re ready, set a price
          for your printed cookbook and keep 80% of every sale. You ship each
          order, and buyers track it under Activity.
        </p>
        <p className="type-caption mt-4" style={{ color: "var(--ink-soft)" }}>
          Applications include ID verification and a review by our team.
        </p>
        <Link href="/sign-up" className="landing-button landing-focus mt-8">
          Create an account to apply
        </Link>
      </div>

      <div className="relative self-center lg:col-span-5">
        <SpinBadge
          id="chef-badge"
          text="Publish ✦ Set your price ✦ Ship it ✦ "
          fill="var(--butter)"
          center={<ChefHatIcon weight="fill" className="h-[32%] w-[32%]" />}
          className="landing-wiggle absolute -top-4 right-0 w-24 sm:w-28 lg:-right-6 lg:-top-20"
        />
        <dl>
          {FACTS.map((fact) => (
            <div
              key={fact.term}
              className="py-5 first:pt-0 last:pb-0"
              style={{ borderBottom: "1px solid var(--rule)" }}
            >
              <dt className="display-3">{fact.term}</dt>
              <dd className="type-caption mt-1" style={{ color: "var(--ink-soft)" }}>
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default ForChefs;
