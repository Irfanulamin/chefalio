import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedRecipesSection from "./_components/SavedRecipe";
import LovedRecipesSection from "./_components/LovedRecipe";
import {
  BookmarkSimpleIcon,
  HeartIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";
import OrdersSection from "./_components/Orders";
export default function ActivityPage() {
  return (
    <>
      <div className="my-3 md:my-6">
        <h2 className="text-5xl font-pinyon-script font-bold text-primary italic capitalize mb-2 tracking-widest">
          Activity
        </h2>
        <p className="text-muted-foreground max-w-200">
          View and manage your saved and loved recipes in one place. Keep track
          of your culinary journey and revisit your favorites anytime. All your
          delicious discoveries, neatly organized for easy access.
        </p>
      </div>
      <Tabs
        defaultValue="saved-recipes"
        className="max-w-7xl mx-auto my-3 md:my-6 lg:my-12"
      >
        <TabsList className="p-1 mb-8" variant="pill">
          <TabsTrigger value="saved-recipes">
            <BookmarkSimpleIcon weight="fill" /> Saved
          </TabsTrigger>
          <TabsTrigger value="loved-recipes">
            <HeartIcon weight="fill" /> Favourites
          </TabsTrigger>
          <TabsTrigger value="orders">
            <PackageIcon weight="fill" /> Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="saved-recipes">
          <SavedRecipesSection />
        </TabsContent>
        <TabsContent value="loved-recipes">
          <LovedRecipesSection />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersSection />
        </TabsContent>
      </Tabs>
    </>
  );
}
