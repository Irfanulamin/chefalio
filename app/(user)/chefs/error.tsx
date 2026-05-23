"use client";
import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

export default function ChefsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-root flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center px-4 max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "#fee2e2" }}
        >
          <WarningCircleIcon size={28} style={{ color: "#b91c1c" }} />
        </div>
        <h1
          className="text-2xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Something went wrong
        </h1>
        <p className="text-sm mb-5" style={{ color: "var(--cs-text-secondary)" }}>
          We couldn&apos;t load the chefs page.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Try again
          </button>
          <Link
            href="/chefs"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{
              backgroundColor: "var(--cs-surface-2)",
              color: "var(--cs-text-secondary)",
              border: "1px solid var(--cs-border-default)",
            }}
          >
            Back to chefs
          </Link>
        </div>
      </div>
    </div>
  );
}
