"use client"

import { useState, useMemo } from "react"
import { useAdminRecipesTable } from "@/hooks/swr/use-admin-recipes-table"
import { useAdminDeleteRecipe } from "@/hooks/useAdmin"
import { DataTable } from "@/components/ui/data-table"
import { createRecipeColumns } from "./columns"
import { toast } from "sonner"
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr"

export default function AdminRecipesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { recipes, pagination, isLoading, isFetching, refresh } =
    useAdminRecipesTable({ page, limit: 20, search: search || undefined })

  const deleteRecipe = useAdminDeleteRecipe()

  async function handleDelete(id: string) {
    try {
      await deleteRecipe.mutateAsync(id)
      toast.success("Recipe deleted")
      refresh()
    } catch {
      toast.error("Failed to delete recipe")
    }
  }

  const columns = useMemo(
    () => createRecipeColumns({ onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const totalPages = pagination?.totalPages ?? 1

  return (
    <>
      <title>Recipes – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Recipes</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            Search, review, or delete any recipe on the platform ·{" "}
            {pagination?.total ?? 0} total
          </p>
        </div>

        <DataTable
          columns={columns}
          data={recipes}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={ForkKnifeIcon}
          emptyMessage="No recipes found"
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          searchPlaceholder="Search recipes..."
          pagination={
            totalPages > 1
              ? {
                  page,
                  totalPages,
                  total: pagination?.total ?? 0,
                  itemLabel: "recipes",
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>
    </>
  )
}
