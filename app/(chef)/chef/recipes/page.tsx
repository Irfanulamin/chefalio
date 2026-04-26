"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMyRecipes, useDeleteRecipe } from "@/hooks/useChefs";
import { Recipe } from "@/types/recipes.type";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  ForkKnifeIcon,
  MagnifyingGlassIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { GridLoader } from "@/components/ui/GridLoading";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  advance: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
};

function RecipeRow({
  recipe,
  onDelete,
  isDeleting,
}: {
  recipe: Recipe;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-white dark:bg-zinc-900 hover:shadow-sm transition-shadow">
      {/* Thumbnail */}
      <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
        <Image
          src={recipe.images[0]}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {recipe.title}
          </h3>
          <Badge
            className={`text-[10px] font-semibold uppercase tracking-wider border-0 px-2 py-0.5 ${DIFFICULTY_STYLES[recipe.difficulty]}`}
          >
            {recipe.difficulty}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {recipe.description}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-muted-foreground">
            ❤️ {recipe.lovedCount.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            🔖 {recipe.savedCount.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {recipe.tags
              .slice(0, 2)
              .map((t) => `#${t}`)
              .join(" ")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/chef/recipes/${recipe._id}/edit`}>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <PencilSimpleIcon size={14} weight="bold" />
            Edit
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
            >
              <TrashIcon size={14} weight="bold" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                  <WarningCircleIcon
                    size={20}
                    weight="fill"
                    className="text-red-500"
                  />
                </span>
                <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>&quot;{recipe.title}&quot;</strong>? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(recipe._id)}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 rounded-xl"
              >
                {isDeleting ? (
                  <GridLoader label="Deleting recipe..." />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function ChefRecipesPage() {
  const { myRecipes, isLoading } = useMyRecipes();
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();
  const [search, setSearch] = useState("");

  const filtered = myRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = (id: string) => {
    deleteRecipe(id, {
      onSuccess: () =>
        toast.success("Recipe deleted successfully!", {
          position: "bottom-right",
        }),
      onError: () =>
        toast.error("Failed to delete recipe.", { position: "bottom-right" }),
    });
  };

  return (
    <>
      <title>My Recipes – Chefalio Chef</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <ForkKnifeIcon size={22} weight="fill" className="text-primary" />
              My Recipes
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage all your published recipes
            </p>
          </div>
          <Link href="/chef/recipes/create">
            <Button className="gap-2 rounded-xl">
              <PlusIcon size={16} weight="bold" />
              New Recipe
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <GridLoader label="Loading recipes..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <ForkKnifeIcon
                size={26}
                weight="duotone"
                className="text-primary"
              />
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {search ? "No recipes match your search" : "No recipes yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Try a different keyword"
                  : "Create your first recipe to get started"}
              </p>
            </div>
            {!search && (
              <Link href="/chef/recipes/create">
                <Button size="sm" className="rounded-xl gap-2">
                  <PlusIcon size={14} weight="bold" />
                  Create Recipe
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((recipe) => (
              <RecipeRow
                key={recipe._id}
                recipe={recipe}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
