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
import { PageHeader } from "@/components/User/shared/PageHeader";
import { SegmentedTabs, type Segment } from "@/components/User/shared/SegmentedTabs";

type Tab = "saved" | "loved" | "orders";
const VALID_TABS: Tab[] = ["saved", "loved", "orders"];

const TABS: readonly Segment<Tab>[] = [
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
      <div className="app-root">
        <div className="page-content">
          <PageHeader
            title="Activity"
            lede="Recipes you've saved or loved, and everything you've bought."
          />

          <div className="mb-6">
            <SegmentedTabs
              segments={TABS}
              value={activeTab}
              onChange={handleTabChange}
              label="Activity sections"
            />
          </div>

          {activeTab === "saved" && <SavedRecipesSection />}
          {activeTab === "loved" && <LovedRecipesSection />}
          {activeTab === "orders" && <OrdersSection />}
        </div>
      </div>
    </>
  );
}
