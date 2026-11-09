import type { Metadata } from "next";
import { Header } from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Hero } from "../components/Home/Hero";
import { RecipePreviews } from "../components/Home/RecipePreviews";
import { FeaturedCookbook } from "../components/Home/FeaturedCookbook";
import { ForChefs } from "../components/Home/ForChefs";
import { FAQ } from "../components/Home/FAQ";
import { CTA } from "../components/Home/CTA";

export const metadata: Metadata = {
  title: "Chefalio",
  description:
    "Discover free recipes, follow the chefs behind them, and buy their printed cookbooks. Chefs publish for free and sell their own cookbooks.",
};

/**
 * Read top to bottom like a cookbook: a dish worth making, a few more,
 * the book they come from, a word for chefs, the questions people ask, and
 * one last invitation. Every name, photo and price is real (see
 * `components/Home/landing-content.ts`).
 */
export default function Home() {
  return (
    <div className="landing">
      <Header />
      <main>
        <Hero />
        <RecipePreviews />
        <FeaturedCookbook />
        <ForChefs />
        <FAQ />
      </main>
      <div style={{ backgroundColor: "var(--paper-deep)" }}>
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
