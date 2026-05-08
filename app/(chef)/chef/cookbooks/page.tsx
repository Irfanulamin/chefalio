"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMyCookbooks, useDeleteCookbook } from "@/hooks/useChefs";
import { Cookbook } from "@/hooks/useCookbook";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  BookOpenIcon,
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

function CookbookCard({
  cookbook,
  onDelete,
  isDeleting,
}: {
  cookbook: Cookbook;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={cookbook.cookbook_image}
          alt={cookbook.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="text-sm font-bold text-white tabular-nums">
            ${cookbook.price.toFixed(2)}
          </span>
          <span className="text-xs text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
            {cookbook.stockCount} in stock
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {cookbook.title}
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
          {cookbook.description}
        </p>

        <div className="flex items-center gap-2 mt-4">
          <Link href={`/chef/cookbooks/${cookbook._id}/edit`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 gap-1.5 text-xs rounded-lg border-zinc-200 dark:border-zinc-700"
            >
              <PencilSimpleIcon size={12} />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
              >
                <TrashIcon size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete cookbook?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>&quot;{cookbook.title}&quot;</strong> will be
                  permanently removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg h-9">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(cookbook._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 rounded-lg h-9 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default function ChefCookbooksPage() {
  const { myCookbooks, isLoading } = useMyCookbooks();
  const { mutate: deleteCookbook, isPending: isDeleting } = useDeleteCookbook();
  const [search, setSearch] = useState("");

  const filtered = myCookbooks.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    deleteCookbook(id, {
      onSuccess: () =>
        toast.success("Cookbook deleted.", { position: "bottom-right" }),
      onError: () =>
        toast.error("Failed to delete cookbook.", { position: "bottom-right" }),
    });
  };

  return (
    <>
      <title>Cookbooks – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              My Cookbooks
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              {myCookbooks.length} cookbook{myCookbooks.length !== 1 ? "s" : ""}{" "}
              published
            </p>
          </div>
          <Link href="/chef/cookbooks/create">
            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg">
              <PlusIcon size={13} weight="bold" />
              New Cookbook
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
            placeholder="Search cookbooks…"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1 rounded-lg" />
                    <Skeleton className="h-8 w-9 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 py-16 flex flex-col items-center gap-3 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <BookOpenIcon size={20} className="text-zinc-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {search ? "No cookbooks found" : "No cookbooks yet"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {search
                  ? "Try a different search term"
                  : "Publish your first cookbook to get started"}
              </p>
            </div>
            {!search && (
              <Link href="/chef/cookbooks/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create Cookbook
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cookbook) => (
              <CookbookCard
                key={cookbook._id}
                cookbook={cookbook}
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
