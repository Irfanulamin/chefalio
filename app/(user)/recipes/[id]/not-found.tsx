import Link from "next/link";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";

export default function RecipeNotFound() {
  return (
    <div className="page-root flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center px-4 max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "var(--cs-accent-muted)" }}
        >
          <ForkKnifeIcon size={28} style={{ color: "var(--cs-accent)" }} />
        </div>
        <h1
          className="text-2xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Recipe not found
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--cs-text-secondary)" }}>
          This recipe doesn&apos;t exist or may have been removed by the chef.
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
          style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
        >
          Browse all recipes
        </Link>
      </div>
    </div>
  );
}
