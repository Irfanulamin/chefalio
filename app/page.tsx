import type { Metadata } from "next";
import { Header } from "../components/common/Header";
import { Banner } from "../components/Home/Banner";
import { TextTicker } from "../components/Home/TextTicker";
import { Features } from "../components/Home/Features";
import { AboutUs } from "../components/Home/AboutUs";
import { FAQ } from "../components/Home/FAQ";
import Footer from "../components/common/Footer";

export const metadata: Metadata = {
  title: "Chefalio",
  description:
    "Chefalio is your home for discovering recipes and buying cookbooks from professional chefs. Share your culinary creations and grow as a cook.",
};

export default function Home() {
  return (
    <>
      <Header />
      <Banner />
      <Features />
      <TextTicker />
      <AboutUs />
      <FAQ />
      <Footer />
    </>
  );
}
