import type { Metadata } from "next";
import { Header } from "../components/common/Header";
import { Hero } from "../components/Home/Hero";
import { SocialProof } from "../components/Home/SocialProof";
import { Personas } from "../components/Home/Personas";
import { Features } from "../components/Home/Features";
import { HowItWorks } from "../components/Home/HowItWorks";
import { AboutUs } from "../components/Home/AboutUs";
import { FAQ } from "../components/Home/FAQ";
import { CTA } from "../components/Home/CTA";
import Footer from "../components/common/Footer";

export const metadata: Metadata = {
  title: "Chefalio",
  description:
    "Chefalio is a marketplace for chef-tested recipes and cookbooks. Browse thousands of recipes for free, buy cookbooks from professional chefs, and publish and sell your own.",
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <SocialProof />
      <Personas />
      <Features />
      <HowItWorks />
      <AboutUs />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
