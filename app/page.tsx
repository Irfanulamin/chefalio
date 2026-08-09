import type { Metadata } from "next";
import { Header } from "../components/common/Header";
import { Hero } from "../components/Home/Hero";
import { SocialProof } from "../components/Home/SocialProof";
import { Personas } from "../components/Home/Personas";
import { Features } from "../components/Home/Features";
import { HowItWorks } from "../components/Home/HowItWorks";
import { Testimonials } from "../components/Home/Testimonials";
import { Pricing } from "../components/Home/Pricing";
import { AboutUs } from "../components/Home/AboutUs";
import { FAQ } from "../components/Home/FAQ";
import { CTA } from "../components/Home/CTA";
import Footer from "../components/common/Footer";

export const metadata: Metadata = {
  title: "Chefalio",
  description:
    "Chefalio is a marketplace for chef-tested recipes and cookbooks. Browse thousands of recipes for free, buy cookbooks from professional chefs, and publish and sell your own.",
};

/**
 * Section order follows the questions a visitor actually asks, in order:
 * what is this → is it real → is it for me → what does it do → how does it
 * work → who says so → what does it cost → why does it exist → what am I
 * still unsure about → alright, where do I start.
 *
 * Backgrounds alternate base / raised down the page (see `.surface-raised`
 * in globals.css), so neighbouring sections meet through a gradient instead
 * of a hard colour seam.
 */
export default function Home() {
  return (
    <div className="landing-root">
      <Header />
      <Hero />
      <SocialProof />
      <Personas />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <AboutUs />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
