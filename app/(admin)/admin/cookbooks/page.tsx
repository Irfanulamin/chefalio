"use client";

import { useState } from "react";
import {
  useAdminCookbooks,
  useAdminDeleteCookbook,
  useAdminUpdateCookbook,
} from "@/hooks/useAdmin";
import type { Cookbook } from "@/hooks/useCookbook";
import Image from "next/image";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  TrashIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PencilSimpleIcon,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCookbooksPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Cookbook | null>(null);
  const [editForm, setEditForm] = useState({ price: "", stockCount: "" });

  const { cookbooks, pagination, isLoading, isFetching } = useAdminCookbooks({
    page,
    limit: 20,
    search: debouncedSearch,
  });

  const deleteCookbook = useAdminDeleteCookbook();
  const updateCookbook = useAdminUpdateCookbook();

  async function handleDelete(id: string) {
    try {
      await deleteCookbook.mutateAsync(id);
      toast.success("Cookbook deleted");
    } catch {
      toast.error("Failed to delete cookbook");
    }
  }

  function openEdit(cookbook: Cookbook) {
    setEditTarget(cookbook);
    setEditForm({
      price: String(cookbook.price),
      stockCount: String(cookbook.stockCount),
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    const price = parseFloat(editForm.price);
    const stockCount = parseInt(editForm.stockCount, 10);
    if (isNaN(price) || price < 0 || isNaN(stockCount) || stockCount < 0) {
      toast.error("Invalid price or stock count");
      return;
    }
    try {
      await updateCookbook.mutateAsync({
        id: editTarget._id,
        payload: { price, stockCount },
      });
      toast.success("Cookbook updated");
      setEditTarget(null);
    } catch {
      toast.error("Failed to update cookbook");
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

        {/* Edit Modal */}
        <Dialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Cookbook</DialogTitle>
            </DialogHeader>
            {editTarget && (
              <form onSubmit={handleUpdate} className="space-y-4 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                    {editTarget.cookbook_image && (
                      <Image
                        src={editTarget.cookbook_image}
                        alt={editTarget.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {editTarget.title}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={editForm.stockCount}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          stockCount: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateCookbook.isPending}
                    className="px-4 py-2 text-sm rounded-lg bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {updateCookbook.isPending ? "Saving…" : "Save"}
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3"><Skeleton className="h-3 w-16" /></th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell"><Skeleton className="h-3 w-12" /></th>
                    <th className="text-left px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-10" /></th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-10" /></th>
                    <th className="px-4 py-3 w-10" />
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-36" />
                            <Skeleton className="h-2.5 w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="space-y-1.5">
                          <Skeleton className="h-3 w-28" />
                          <Skeleton className="h-2.5 w-20" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-12" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-10" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                        <button
                          onClick={() => openEdit(cookbook)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit price & stock"
                        >
                          <PencilSimpleIcon size={14} />
                        </button>
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
