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
      <div className="my-3 md:my-6">
        <h2 className="text-5xl font-pinyon-script font-bold text-primary italic capitalize mb-2 tracking-widest">
          Activity
        </h2>
        <p className="text-muted-foreground max-w-200">
          View and manage your saved and loved recipes in one place. Keep track
          of your culinary journey and revisit your favorites anytime.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="max-w-7xl mx-auto my-3 md:my-6 lg:my-12"
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
    </>
  );
}
