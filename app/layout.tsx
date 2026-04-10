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

export const metadata: Metadata = {
  title: {
    default: "Chefalio",
    template: "Chefalio - %s",
  },
  description:
    "Chefalio is a recipe sharing platform and cookbook selling website built with Next.js 13, Shadcn and Tailwind CSS.",
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
      suppressHydrationWarning
    >
      <body>
        <MainLayoutProvider>{children}</MainLayoutProvider>
      </body>
    </html>
  );
}
