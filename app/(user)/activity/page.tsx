"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SavedRecipesSection from "./_components/SavedRecipe";
import LovedRecipesSection from "./_components/LovedRecipe";
import OrdersSection from "./_components/Orders";
import {
  BookmarkSimpleIcon,
  HeartIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";

type Tab = "saved" | "loved" | "orders";
const VALID_TABS: Tab[] = ["saved", "loved", "orders"];

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "saved", label: "Saved", Icon: BookmarkSimpleIcon },
  { id: "loved", label: "Favourites", Icon: HeartIcon },
  { id: "orders", label: "Orders", Icon: PackageIcon },
];

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "saved";

  const handleTabChange = (value: Tab) => {
    router.replace(`?tab=${value}`, { scroll: false });
  };

  return (
    <>
      <title>Chefalio — Activity</title>
      <div className="page-root">
        <div className="page-content">
          {/* Header */}
          <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Activity
            </h1>
            <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
              View and manage your saved and loved recipes in one place.
            </p>
          </div>

          {/* Tab bar */}
          <div
            className="flex gap-1 p-1 rounded-xl w-fit mb-6"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150"
                style={
                  activeTab === id
                    ? {
                        backgroundColor: "var(--cs-surface-1)",
                        color: "var(--cs-text-primary)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        border: "1px solid var(--cs-border-subtle)",
                      }
                    : { color: "var(--cs-text-secondary)" }
                }
              >
                <Icon
                  size={16}
                  weight={activeTab === id ? "fill" : "regular"}
                  style={activeTab === id ? { color: "var(--cs-accent)" } : undefined}
                />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "saved" && <SavedRecipesSection />}
          {activeTab === "loved" && <LovedRecipesSection />}
          {activeTab === "orders" && <OrdersSection />}
        </div>
      </div>
    </>
  );
}
