"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useChefRecipesTable } from "@/hooks/swr/use-chef-recipes-table"
import { useDeleteRecipe, useUpdateRecipe } from "@/hooks/useChefs"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createChefRecipeColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { EditSheet } from "@/components/Chef/studio/EditSheet"
import { DeleteDialog } from "@/components/Chef/studio/DeleteDialog"
import RecipeForm from "@/components/Chef/RecipeForm"
import { toast } from "sonner"
import Image from "next/image"
import { PlusIcon, ForkKnifeIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr"
import { DIFFICULTY } from "@/components/Chef/studio/viz"
import type { Recipe } from "@/types/recipes.type"

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

const EDIT_FORM_ID = "chef-recipe-edit-form"

/**
 * The phone layout for a recipe row.
 *
 * Five columns squeezed into 380px is not a table, it's a squeeze — so
 * below `sm` the same record is a card: the image big enough to recognise,
 * the title unclipped, and the two numbers that matter on one line.
 */
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-16 rounded-lg overflow-hidden shrink-0"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        {recipe.images[0] && (
          <Image src={recipe.images[0]} alt="" fill className="object-cover" sizes="64px" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {recipe.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-[2px] shrink-0"
            style={{ backgroundColor: DIFFICULTY[recipe.difficulty] ?? "var(--cv-ord-2)" }}
          />
          <span className="text-[11px] capitalize" style={{ color: "var(--cs-text-tertiary)" }}>
            {recipe.difficulty === "advance" ? "advanced" : recipe.difficulty}
          </span>
          <span
            className="text-[11px] tabular-nums"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {recipe.lovedCount} loves · {recipe.savedCount} saves
          </span>
        </div>
      </div>
      <CaretRightIcon size={13} style={{ color: "var(--cs-text-tertiary)" }} />
    </div>
  )
}

export default function ChefRecipesPage() {
  const { recipes, isLoading, isFetching, refresh } = useChefRecipesTable()
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe()
  const { mutateAsync: updateRecipe, isPending: isSaving } = useUpdateRecipe()

  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    difficulty: "",
  })

  /**
   * Edit and delete are both single controlled overlays holding the target
   * row, rather than a dialog mounted inside every action cell. The row
   * object comes straight from the table, so opening the editor costs no
   * request at all — the old `/chef/recipes/[id]/edit` route navigated away,
   * refetched the entire recipe list, and then did a `.find()` on it to
   * recover the row the user had just clicked.
   */
  const [editing, setEditing] = useState<Recipe | null>(null)
  const [deleting, setDeleting] = useState<Recipe | null>(null)

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

  const handleSave = useCallback(
    async (values: Parameters<typeof updateRecipe>[0]["payload"]) => {
      if (!editing) return
      try {
        await updateRecipe({ id: editing._id, payload: values })
        toast.success("Recipe updated.", { position: "bottom-right" })
        setEditing(null)
        refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update recipe.",
          { position: "bottom-right" },
        )
      }
    },
    [editing, updateRecipe, refresh],
  )

  const handleDelete = useCallback(() => {
    if (!deleting) return
    deleteRecipe(deleting._id, {
      onSuccess: () => {
        toast.success("Recipe deleted.", { position: "bottom-right" })
        setDeleting(null)
        refresh()
      },
      onError: () =>
        toast.error("Failed to delete recipe.", { position: "bottom-right" }),
    })
  }, [deleting, deleteRecipe, refresh])

  const columns = useMemo(
    () => createChefRecipeColumns({ onEdit: setEditing, onDelete: setDeleting }),
    [],
  )

  return (
    <>
      <title>Recipes – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1
              className="text-xl font-semibold tracking-[-0.018em]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              My recipes
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} published
            </p>
          </div>
          <Link href="/chef/recipes/create">
            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg">
              <PlusIcon size={13} weight="bold" />
              New recipe
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isFetching={isFetching}
          /* Filtering is an in-memory `Array.filter`, so the list responds
             on the keystroke rather than 400ms after it. */
          instantSearch
          /* The row is the recipe — pressing it opens the recipe. */
          onRowClick={setEditing}
          renderCard={(recipe) => <RecipeCard recipe={recipe} />}
          emptyIcon={ForkKnifeIcon}
          emptyMessage={
            search || filterValues.difficulty
              ? "No recipes match your filter"
              : "No recipes yet"
          }
          emptyAction={
            !search && !filterValues.difficulty ? (
              <Link href="/chef/recipes/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create recipe
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

      <EditSheet
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit recipe"
        description={editing?.title}
        formId={EDIT_FORM_ID}
        isSubmitting={isSaving}
      >
        {editing && (
          /* Keyed on the row id so switching rows remounts the form with the
             new defaults instead of keeping the previous recipe's state. */
          <RecipeForm
            key={editing._id}
            formId={EDIT_FORM_ID}
            hideSubmit
            initialData={editing}
            onSubmit={handleSave}
            isSubmitting={isSaving}
          />
        )}
      </EditSheet>

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
