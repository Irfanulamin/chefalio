"use client";

import { useState } from "react";
import { useAdminCookbooks, useAdminDeleteCookbook } from "@/hooks/useAdmin";
import Image from "next/image";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
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

export default function AdminCookbooksPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const { cookbooks, pagination, isLoading, isFetching } = useAdminCookbooks({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const deleteCookbook = useAdminDeleteCookbook();

  async function handleDelete(id: string) {
    try {
      await deleteCookbook.mutateAsync(id);
      toast.success("Cookbook deleted");
    } catch {
      toast.error("Failed to delete cookbook");
    }
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <title>Cookbooks – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">Cookbooks</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {pagination?.total ?? 0} total cookbooks
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search cookbooks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        {/* Table */}
        <div
          className={[
            "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-opacity duration-150",
            isFetching ? "opacity-60" : "",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <BookOpenIcon
                size={24}
                className="text-zinc-300 dark:text-zinc-700 animate-pulse"
              />
            </div>
          ) : cookbooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-zinc-400">
              <BookOpenIcon size={24} />
              <p className="text-sm">No cookbooks found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Cookbook
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:table-cell">
                      Author
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden md:table-cell">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden lg:table-cell">
                      Stock
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {cookbooks.map((cookbook) => (
                    <tr
                      key={cookbook._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            {cookbook.cookbook_image && (
                              <Image
                                src={cookbook.cookbook_image}
                                alt={cookbook.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-48 text-sm">
                              {cookbook.title}
                            </p>
                            <p className="text-xs text-zinc-400 truncate max-w-48">
                              {cookbook.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-foreground">
                          {cookbook.authorId.fullName}
                        </p>
                        <p className="text-xs text-zinc-400">
                          @{cookbook.authorId.username}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm font-medium text-foreground">
                          ${cookbook.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={[
                            "text-xs font-medium tabular-nums",
                            cookbook.stockCount === 0
                              ? "text-red-500"
                              : cookbook.stockCount < 5
                                ? "text-amber-500"
                                : "text-zinc-500",
                          ].join(" ")}
                        >
                          {cookbook.stockCount} left
                        </span>
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
                              <AlertDialogTitle>
                                Delete cookbook?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &ldquo;
                                {cookbook.title}&rdquo;. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cookbook._id)}
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
              Page {page} of {totalPages} · {pagination?.total ?? 0} cookbooks
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
