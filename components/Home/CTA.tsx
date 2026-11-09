import Link from "next/link";
import { Burst, Sparkle, Star } from "./Doodles";

/** The closing line and the page's last button, with a little confetti. */
export function CTA() {
  return (
    <section className="relative mx-auto max-w-3xl px-4 py-20 text-center md:px-8 md:py-28">
      <Burst className="landing-spin absolute left-2 top-10 h-12 w-12 md:-left-10 md:top-16 md:h-16 md:w-16" />
      <Sparkle className="landing-bob absolute right-6 top-8 h-8 w-8 md:-right-4 md:top-14 md:h-10 md:w-10" />
      <Star
        className="landing-spin-reverse absolute bottom-10 right-10 h-9 w-9 md:bottom-16 md:right-0"
        color="var(--landing-accent)"
      />
      <Sparkle
        className="landing-bob absolute bottom-14 left-10 h-5 w-5 md:bottom-20 md:left-4"
        color="var(--tomato)"
        style={{ animationDelay: "-2.5s" }}
      />

      <h2 className="display-2 relative">
        Your next favourite recipe is a free account away.
      </h2>
      <Link href="/sign-up" className="landing-button landing-focus relative mt-8">
        Create a free account
      </Link>
    </section>
  );
}

export default CTA;
