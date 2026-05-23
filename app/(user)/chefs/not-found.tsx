import Link from "next/link";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr";

export default function ChefsNotFound() {
  return (
    <div className="page-root flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center px-4 max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "var(--cs-accent-muted)" }}
        >
          <UsersIcon size={28} style={{ color: "var(--cs-accent)" }} />
        </div>
        <h1
          className="text-2xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Chef not found
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--cs-text-secondary)" }}>
          This chef profile doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/chefs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
          style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
        >
          Browse chefs
        </Link>
      </div>
    </div>
  );
}
