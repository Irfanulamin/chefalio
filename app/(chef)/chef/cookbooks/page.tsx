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
  WarningCircleIcon,
  CurrencyDollarIcon,
  StackIcon,
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
import GridLoader from "@/components/ui/GridLoading";

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
    <div className="group flex flex-col rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={cookbook.cookbook_image}
          alt={cookbook.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/70 px-2.5 py-1 rounded-full">
            <CurrencyDollarIcon
              size={13}
              weight="bold"
              className="text-primary"
            />
            <span className="text-xs font-bold text-foreground">
              ${cookbook.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/70 px-2.5 py-1 rounded-full">
            <StackIcon
              size={13}
              weight="bold"
              className="text-muted-foreground"
            />
            <span className="text-xs font-medium text-foreground">
              {cookbook.stockCount} left
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-1">
          {cookbook.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {cookbook.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link
            href={`/chef/cookbooks/${cookbook._id}/edit`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 gap-1.5 rounded-lg"
            >
              <PencilSimpleIcon size={13} weight="bold" />
              Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
              >
                <TrashIcon size={13} weight="bold" />
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
                  <AlertDialogTitle>Delete Cookbook</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>&quot;{cookbook.title}&quot;</strong>? This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(cookbook._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 rounded-xl"
                >
                  {isDeleting ? (
                    <GridLoader label="Deleting cookbook..." />
                  ) : (
                    "Delete"
                  )}
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
        toast.success("Cookbook deleted successfully!", {
          position: "bottom-right",
        }),
      onError: () =>
        toast.error("Failed to delete cookbook.", { position: "bottom-right" }),
    });
  };

  return (
    <>
      <title>My Cookbooks – Chefalio Chef</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <BookOpenIcon size={22} weight="fill" className="text-primary" />
              My Cookbooks
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your published cookbooks
            </p>
          </div>
          <Link href="/chef/cookbooks/create">
            <Button className="gap-2 rounded-xl">
              <PlusIcon size={16} weight="bold" />
              New Cookbook
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
            placeholder="Search cookbooks..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <GridLoader label="Chef cookbooks..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <BookOpenIcon
                size={26}
                weight="duotone"
                className="text-primary"
              />
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {search ? "No cookbooks match your search" : "No cookbooks yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Try a different keyword"
                  : "Publish your first cookbook to get started"}
              </p>
            </div>
            {!search && (
              <Link href="/chef/cookbooks/create">
                <Button size="sm" className="rounded-xl gap-2">
                  <PlusIcon size={14} weight="bold" />
                  Create Cookbook
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length} cookbook{filtered.length !== 1 ? "s" : ""}
            </p>
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
          </div>
        )}
      </div>
    </>
  );
}
