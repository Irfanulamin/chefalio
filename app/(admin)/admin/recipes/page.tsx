"use client";

import { useState, useMemo } from "react";
import { useAdminRecipes, useAdminDeleteRecipe } from "@/hooks/useAdmin";
import Image from "next/image";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  MagnifyingGlassIcon,
  ForkKnifeIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  TrashIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
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

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advance: 2,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advance: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminRecipesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"none" | "difficulty-asc" | "difficulty-desc" | "engagement">("none");

  const { recipes, pagination, isLoading, isFetching } = useAdminRecipes({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const sortedRecipes = useMemo(() => {
    const list = [...recipes];
    if (sortBy === "difficulty-asc") {
      list.sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 0) - (DIFFICULTY_ORDER[b.difficulty] ?? 0));
    } else if (sortBy === "difficulty-desc") {
      list.sort((a, b) => (DIFFICULTY_ORDER[b.difficulty] ?? 0) - (DIFFICULTY_ORDER[a.difficulty] ?? 0));
    } else if (sortBy === "engagement") {
      list.sort((a, b) => (b.lovedCount * 2 + b.savedCount * 1.5) - (a.lovedCount * 2 + a.savedCount * 1.5));
    }
    return list;
  }, [recipes, sortBy]);

  const deleteRecipe = useAdminDeleteRecipe();

  async function handleDelete(id: string) {
    try {
      await deleteRecipe.mutateAsync(id);
      toast.success("Recipe deleted");
    } catch {
      toast.error("Failed to delete recipe");
    }
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <title>Recipes – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">Recipes</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            Search, review, or permanently delete any recipe published on the platform · {pagination?.total ?? 0} total
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlassIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

          {/* Sort buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-zinc-400 mr-1">Sort:</span>
            {(
              [
                { label: "None", value: "none" },
                { label: "Difficulty ↑", value: "difficulty-asc" },
                { label: "Difficulty ↓", value: "difficulty-desc" },
                { label: "Engagement", value: "engagement" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={[
                  "px-2.5 py-1 text-xs rounded-lg border transition-colors",
                  sortBy === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div
          className={[
            "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-opacity duration-150",
            isFetching ? "opacity-60" : "",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3"><Skeleton className="h-3 w-12" /></th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell"><Skeleton className="h-3 w-12" /></th>
                    <th className="text-left px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-16" /></th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-20" /></th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-12 rounded-md shrink-0" />
                          <Skeleton className="h-3.5 w-36" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="space-y-1.5">
                          <Skeleton className="h-3 w-28" />
                          <Skeleton className="h-2.5 w-20" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : sortedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-zinc-400">
              <ForkKnifeIcon size={24} />
              <p className="text-sm">No recipes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Recipe
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:table-cell">
                      Author
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden md:table-cell">
                      Difficulty
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden lg:table-cell">
                      Engagement
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {sortedRecipes.map((recipe) => (
                    <tr
                      key={recipe._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            {recipe.images[0] && (
                              <Image
                                src={recipe.images[0]}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <p className="font-medium text-foreground truncate max-w-48 text-sm">
                            {recipe.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-foreground">
                          {recipe.authorId.fullName}
                        </p>
                        <p className="text-xs text-zinc-400">
                          @{recipe.authorId.username}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={[
                            "inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                            DIFFICULTY_COLORS[recipe.difficulty] ?? "",
                          ].join(" ")}
                        >
                          {recipe.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <HeartIcon
                              size={11}
                              weight="fill"
                              className="text-red-400"
                            />
                            {recipe.lovedCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookmarkSimpleIcon
                              size={11}
                              weight="fill"
                              className="text-primary"
                            />
                            {recipe.savedCount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <TrashIcon size={14} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &ldquo;
                                {recipe.title}&rdquo;. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(recipe._id)}
                                className="bg-red-500 hover:bg-red-600 text-white border-0"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-400">
              Page {page} of {totalPages} · {pagination?.total ?? 0} recipes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeftIcon size={12} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRightIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
