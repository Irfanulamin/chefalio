import type { Metadata } from "next";
import { DM_Sans, Pinyon_Script } from "next/font/google";
import "./globals.css";

import { twMerge } from "tailwind-merge";
import { MainLayoutProvider } from "../components/providers/MainLayoutProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
});

const siteUrl = "https://chefalio.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chefalio",
    template: "Chefalio - %s",
  },
  description:
    "Chefalio is a recipe sharing and cookbook selling platform. Discover thousands of recipes, buy cookbooks from professional chefs, and share your culinary creations.",
  keywords: [
    "chefalio",
    "recipes",
    "cookbook",
    "chef",
    "cooking",
    "food",
    "recipe sharing",
    "buy cookbooks",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Chefalio",
    title: "Chefalio — Recipes & Cookbooks from Professional Chefs",
    description:
      "Discover recipes and buy cookbooks from professional chefs on Chefalio.",
    images: [
      {
        url: "/assets/about-us.png",
        width: 1200,
        height: 630,
        alt: "Chefalio — Recipes & Cookbooks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chefalio — Recipes & Cookbooks from Professional Chefs",
    description:
      "Discover recipes and buy cookbooks from professional chefs on Chefalio.",
    images: ["/assets/about-us.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Chefalio",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Chefalio",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/about-us.png`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={twMerge(pinyonScript.variable, dmSans.variable, "antialiased")}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <MainLayoutProvider>{children}</MainLayoutProvider>
      </body>
    </html>
  );
}
