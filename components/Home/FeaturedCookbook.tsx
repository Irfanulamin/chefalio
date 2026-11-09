import Link from "next/link";
import { cookbookPrice } from "@/lib/recipe-display";
import { FEATURED_COOKBOOK } from "./landing-content";
import { CookbookFlip } from "./CookbookFlip";
import { buildBookPages } from "./BookPages";
import { Burst, Seal } from "./Doodles";

type Price = ReturnType<typeof cookbookPrice>;

/**
 * The book's price is read live from the public `GET /cookbooks/:id`, because
 * chefs and admins change prices and discounts and a hard-coded figure would
 * drift into a wrong claim. Only `title`, `price` and `discount` are read.
 * The response also carries the author's email, which is never used.
 *
 * Any failure, or a title that no longer matches the curated entry, falls
 * back to "Price shown at checkout": no price beats a wrong one.
 */
async function livePrice(): Promise<Price | null> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const book = FEATURED_COOKBOOK;
  if (!base || !book.id || book.placeholder) return null;

  try {
    const res = await fetch(
      `${base.replace(/\/$/, "")}/cookbooks/${encodeURIComponent(book.id)}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;

    const body: unknown = await res.json();
    const data = (body as { data?: Record<string, unknown> } | null)?.data;
    if (!data) return null;

    const { title, price, discount } = data;
    if (typeof title !== "string" || title.trim() !== book.title.trim()) {
      return null;
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return null;
    }

    return cookbookPrice(price, typeof discount === "number" ? discount : 0);
  } catch {
    return null;
  }
}

export async function FeaturedCookbook() {
  const book = FEATURED_COOKBOOK;
  const price = await livePrice();

  const link =
    book.link.kind === "includes"
      ? `Includes ${book.link.dishTitle}, pictured above.`
      : book.link.kind === "same-chef"
        ? "More from this chef."
        : null;

  return (
    <section
      id="cookbook"
      style={{ backgroundColor: "var(--paper-deep)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <CookbookFlip
            pages={buildBookPages(book)}
            label={`${book.title} by ${book.chef}, a book you can page through`}
            backdrop={
              <Burst
                className="landing-spin-slow aspect-square h-[110%] w-auto"
                color="color-mix(in oklab, var(--landing-accent) 55%, var(--paper-deep))"
              />
            }
            sticker={
              <Seal
                fill="var(--tomato)"
                className="landing-tilt landing-wiggle w-20 sm:w-24"
                style={{ ["--tilt" as string]: "12deg" }}
              >
                Printed &amp; shipped
              </Seal>
            }
          />
        </div>

        <div className="lg:col-span-5">
          <p
            className="type-label"
            style={{ color: "var(--landing-accent-text)" }}
          >
            Featured cookbook
          </p>
          <h2 className="display-2 mt-3">{book.title}</h2>

          <p className="type-body mt-4 flex flex-wrap items-baseline gap-x-2">
            <span style={{ color: "var(--ink-soft)" }}>by {book.chef}</span>
            <span aria-hidden style={{ color: "var(--ink-soft)" }}>
              ·
            </span>
            {price ? (
              <span className="font-semibold">
                {price.current}
                {price.original && (
                  <>
                    {" "}
                    <s
                      className="font-normal"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      <span className="sr-only">was </span>
                      {price.original}
                    </s>
                  </>
                )}
              </span>
            ) : (
              <span style={{ color: "var(--ink-soft)" }}>
                Price shown at checkout
              </span>
            )}
          </p>

          {book.inside && (
            <p className="type-body mt-6">
              <span className="font-semibold">Inside:</span>{" "}
              {book.inside.join(", ")}
            </p>
          )}

          {link && (
            <p
              className={`type-body ${book.inside ? "mt-2" : "mt-6"}`}
              style={{ color: "var(--ink-soft)" }}
            >
              {link}
            </p>
          )}

          <p className="type-body mt-6" style={{ color: "var(--ink-soft)" }}>
            Printed and shipped by {book.chefFirstName}. Track your order under
            Activity.
          </p>

          <Link href="/sign-up" className="landing-button landing-focus mt-8">
            Sign up to buy this book
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCookbook;
