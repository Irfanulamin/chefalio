"use client"

import { useState, useMemo, useCallback } from "react"
import { useAdminRecipesTable } from "@/hooks/swr/use-admin-recipes-table"
import { useAdminDeleteRecipe } from "@/hooks/useAdmin"
import { DataTable } from "@/components/ui/data-table"
import { DeleteDialog } from "@/components/common/DeleteDialog"
import { createRecipeColumns, type AdminRecipeRow } from "./columns"
import { toast } from "sonner"
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr"
import { PageHeader } from "@/components/Admin/AdminUI"

export default function AdminRecipesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { recipes, pagination, isLoading, isFetching, refresh } =
    useAdminRecipesTable({ page, limit: 20, search: search || undefined })

  const { mutate: deleteRecipe, isPending: isDeleting } = useAdminDeleteRecipe()

  // Single controlled dialog holding the target row, rather than an
  // AlertDialog mounted inside every action cell — see DeleteDialog.
  const [deleting, setDeleting] = useState<AdminRecipeRow | null>(null)

  const handleDelete = useCallback(() => {
    if (!deleting) return
    deleteRecipe(deleting._id, {
      onSuccess: () => {
        toast.success("Recipe deleted")
        setDeleting(null)
        refresh()
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to delete recipe"),
    })
  }, [deleting, deleteRecipe, refresh])

  const columns = useMemo(
    () => createRecipeColumns({ onDelete: setDeleting }),
    [],
  )

  const totalPages = pagination?.totalPages ?? 1

  return (
    <>
      <title>Recipes – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <PageHeader
          title="Recipes"
          description={`Search, review, or delete any recipe on the platform · ${pagination?.total ?? 0} total`}
          icon={ForkKnifeIcon}
          iconTone="violet"
        />

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

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        kind="recipe"
        name={deleting?.title}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
