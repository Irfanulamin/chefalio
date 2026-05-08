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
import { Skeleton } from "@/components/ui/skeleton";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advance: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
    <tr className="group border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={recipe.images[0]}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate max-w-[240px]">
              {recipe.title}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-[240px]">
              {recipe.description}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell">
        <span
          className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${DIFFICULTY_BADGE[recipe.difficulty]}`}
        >
          {recipe.difficulty}
        </span>
      </td>
      <td className="py-3 px-3 hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              #{t}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-3 hidden lg:table-cell text-xs text-zinc-400 tabular-nums">
        {recipe.lovedCount.toLocaleString()} / {recipe.savedCount.toLocaleString()}
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center gap-1.5 justify-end">
          <Link href={`/chef/recipes/${recipe._id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs text-zinc-500 hover:text-foreground px-2.5"
            >
              <PencilSimpleIcon size={13} />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <TrashIcon size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>&quot;{recipe.title}&quot;</strong> will be permanently
                  removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg h-9">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(recipe._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 rounded-lg h-9 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
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
        toast.success("Recipe deleted.", { position: "bottom-right" }),
      onError: () =>
        toast.error("Failed to delete recipe.", { position: "bottom-right" }),
    });
  };

  return (
    <>
      <title>Recipes – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              My Recipes
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              {myRecipes.length} recipe{myRecipes.length !== 1 ? "s" : ""}{" "}
              published
            </p>
          </div>
          <Link href="/chef/recipes/create">
            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg">
              <PlusIcon size={13} weight="bold" />
              New Recipe
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <MagnifyingGlassIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes or tags…"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2.5 pl-4 pr-3 text-left"><Skeleton className="h-3 w-12" /></th>
                  <th className="py-2.5 px-3 text-left hidden sm:table-cell"><Skeleton className="h-3 w-16" /></th>
                  <th className="py-2.5 px-3 text-left hidden md:table-cell"><Skeleton className="h-3 w-8" /></th>
                  <th className="py-2.5 px-3 text-left hidden lg:table-cell"><Skeleton className="h-3 w-20" /></th>
                  <th className="py-2.5 pl-3 pr-4" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-40" />
                          <Skeleton className="h-2.5 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12 rounded" />
                        <Skeleton className="h-5 w-12 rounded" />
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <Skeleton className="h-3 w-16" />
                    </td>
                    <td className="py-3 pl-3 pr-4">
                      <div className="flex gap-1.5 justify-end">
                        <Skeleton className="h-7 w-16 rounded-lg" />
                        <Skeleton className="h-7 w-7 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 py-16 flex flex-col items-center gap-3 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <ForkKnifeIcon size={20} className="text-zinc-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {search ? "No recipes found" : "No recipes yet"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {search
                  ? "Try a different search term"
                  : "Create your first recipe to get started"}
              </p>
            </div>
            {!search && (
              <Link href="/chef/recipes/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create Recipe
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2.5 pl-4 pr-3 text-left text-xs font-medium text-zinc-400">
                    Recipe
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400 hidden sm:table-cell">
                    Difficulty
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400 hidden md:table-cell">
                    Tags
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400 hidden lg:table-cell">
                    Loves / Saves
                  </th>
                  <th className="py-2.5 pl-3 pr-4 text-right text-xs font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((recipe) => (
                  <RecipeRow
                    key={recipe._id}
                    recipe={recipe}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
