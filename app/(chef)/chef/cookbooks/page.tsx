"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useChefCookbooksTable } from "@/hooks/swr/use-chef-cookbooks-table"
import { useDeleteCookbook } from "@/hooks/useChefs"
import { DataTable } from "@/components/ui/data-table"
import { createChefCookbookColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PlusIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr"

export default function ChefCookbooksPage() {
  const { cookbooks, isLoading, isFetching, refresh } = useChefCookbooksTable()
  const { mutate: deleteCookbook, isPending: isDeleting } = useDeleteCookbook()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search) return cookbooks
    const q = search.toLowerCase()
    return cookbooks.filter((c) => c.title.toLowerCase().includes(q))
  }, [cookbooks, search])

  function handleDelete(id: string) {
    deleteCookbook(id, {
      onSuccess: () => {
        toast.success("Cookbook deleted.", { position: "bottom-right" })
        refresh()
      },
      onError: () =>
        toast.error("Failed to delete cookbook.", { position: "bottom-right" }),
    })
  }

  const columns = useMemo(
    () => createChefCookbookColumns({ onDelete: handleDelete, isDeleting }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDeleting],
  )

  return (
    <>
      <title>Cookbooks – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              My Cookbooks
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              {cookbooks.length} cookbook{cookbooks.length !== 1 ? "s" : ""}{" "}
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

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={BookOpenIcon}
          emptyMessage={search ? "No cookbooks found" : "No cookbooks yet"}
          emptyAction={
            !search ? (
              <Link href="/chef/cookbooks/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create Cookbook
                </Button>
              </Link>
            ) : undefined
          }
          onSearchChange={setSearch}
          searchPlaceholder="Search cookbooks…"
        />
      </div>
    </>
  )
}
