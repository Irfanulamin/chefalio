"use client";

import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

export default function ChefError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <WarningCircleIcon size={28} weight="fill" style={{ color: "#b91c1c" }} />
        </div>

        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--cs-text-primary)" }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-1" style={{ color: "var(--cs-text-secondary)" }}>
          An error occurred in your chef studio.
        </p>
        {error.message && (
          <p
            className="text-xs font-mono mb-6 px-3 py-2 rounded-lg w-full text-left truncate"
            style={{ backgroundColor: "var(--cs-surface-3)", color: "var(--cs-text-tertiary)" }}
          >
            {error.message}
          </p>
        )}

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={reset}
            className="w-full py-2.5 px-6 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Try again
          </button>
          <Link
            href="/chef/dashboard"
            className="w-full py-2.5 px-6 rounded-xl text-sm text-center transition-colors duration-150"
            style={{ border: "1px solid var(--cs-border-default)", color: "var(--cs-text-secondary)" }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
