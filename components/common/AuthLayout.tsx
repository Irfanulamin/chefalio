"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  imageSrc,
  imageAlt,
  children,
}: AuthLayoutProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left — Form (60%) */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with logo */}
        <div
          className="px-8 h-16 flex items-center shrink-0"
          style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
        >
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--cs-accent)" }}
          >
            Chefalio
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-6">{children}</div>
        </div>
      </div>

      {/* Right — Brand Panel (40%), hidden on mobile */}
      <div
        className="hidden md:flex w-[40%] max-w-lg flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundColor: "var(--cs-surface-3)",
          borderLeft: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* Background image */}
        {!imgLoaded && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--cs-accent-muted), var(--cs-surface-3))",
            }}
          />
        )}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className={`object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />

        {/* Overlay with brand text */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-8 py-12"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
            position: "absolute",
            inset: 0,
          }}
        >
          <div className="mt-auto">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Chefalio
            </h2>
            <p className="text-sm text-white/70 max-w-xs">
              Discover thousands of recipes, cookbooks, and talented chefs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
