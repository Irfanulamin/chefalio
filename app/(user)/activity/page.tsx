// app/(user)/activity/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedRecipesSection from "./_components/SavedRecipe";
import LovedRecipesSection from "./_components/LovedRecipe";
import {
  BookmarkSimpleIcon,
  HeartIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";
import OrdersSection from "./_components/Orders";

type Tab = "saved" | "loved" | "orders";
const VALID_TABS: Tab[] = ["saved", "loved", "orders"];

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab =
    rawTab && VALID_TABS.includes(rawTab) ? rawTab : "saved";

  const handleTabChange = (value: string) => {
    router.replace(`?tab=${value}`, { scroll: false });
  };

  return (
    <>
      <title>Chefalio - Activity</title>
      <div className="max-w-7xl mx-auto px-3 space-y-6 my-4 md:my-8">
        <div className="pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            View and manage your saved and loved recipes in one place. Keep track of your culinary journey and revisit your favorites anytime.
          </p>
        </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className=""
      >
        <TabsList className="p-1 mb-8" variant="pill">
          <TabsTrigger value="saved">
            <BookmarkSimpleIcon weight="fill" /> Saved
          </TabsTrigger>
          <TabsTrigger value="loved">
            <HeartIcon weight="fill" /> Favourites
          </TabsTrigger>
          <TabsTrigger value="orders">
            <PackageIcon weight="fill" /> Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {activeTab === "saved" && <SavedRecipesSection />}
        </TabsContent>
        <TabsContent value="loved">
          {activeTab === "loved" && <LovedRecipesSection />}
        </TabsContent>
        <TabsContent value="orders">
          {activeTab === "orders" && <OrdersSection />}
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}
