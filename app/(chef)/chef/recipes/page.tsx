"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useChefRecipesTable } from "@/hooks/swr/use-chef-recipes-table"
import { useDeleteRecipe } from "@/hooks/useChefs"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createChefRecipeColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PlusIcon, ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr"

const DIFFICULTY_FILTER: FilterConfig = {
  key: "difficulty",
  type: "pill",
  options: [
    { label: "All", value: "" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advance" },
  ],
}

export default function ChefRecipesPage() {
  const { recipes, isLoading, isFetching, refresh } = useChefRecipesTable()
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe()
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    difficulty: "",
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const diff = filterValues.difficulty
    return recipes.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      const matchesDiff = !diff || r.difficulty === diff
      return matchesSearch && matchesDiff
    })
  }, [recipes, search, filterValues.difficulty])

  function handleDelete(id: string) {
    deleteRecipe(id, {
      onSuccess: () => {
        toast.success("Recipe deleted.", { position: "bottom-right" })
        refresh()
      },
      onError: () =>
        toast.error("Failed to delete recipe.", { position: "bottom-right" }),
    })
  }

  const columns = useMemo(
    () => createChefRecipeColumns({ onDelete: handleDelete, isDeleting }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDeleting],
  )

  return (
    <>
      <title>Recipes – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--cs-text-primary)" }}>
              My Recipes
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} published
            </p>
          </div>
          <Link href="/chef/recipes/create">
            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg">
              <PlusIcon size={13} weight="bold" />
              New Recipe
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={ForkKnifeIcon}
          emptyMessage={search || filterValues.difficulty ? "No recipes match your filter" : "No recipes yet"}
          emptyAction={
            !search && !filterValues.difficulty ? (
              <Link href="/chef/recipes/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create Recipe
                </Button>
              </Link>
            ) : undefined
          }
          onSearchChange={setSearch}
          searchPlaceholder="Search recipes or tags…"
          filterConfigs={[DIFFICULTY_FILTER]}
          filterValues={filterValues}
          onFilterChange={(key, value) =>
            setFilterValues((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>
    </>
  )
}
