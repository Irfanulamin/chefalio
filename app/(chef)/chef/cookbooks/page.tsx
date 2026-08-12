"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useChefCookbooksTable } from "@/hooks/swr/use-chef-cookbooks-table"
import { useDeleteCookbook, useUpdateCookbook } from "@/hooks/useChefs"
import { DataTable } from "@/components/ui/data-table"
import { createChefCookbookColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { EditSheet } from "@/components/Chef/studio/EditSheet"
import { DeleteDialog } from "@/components/Chef/studio/DeleteDialog"
import CookbookForm from "@/components/Chef/CookbookForn"
import { toast } from "sonner"
import Image from "next/image"
import { PlusIcon, BookOpenIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr"
import type { Cookbook } from "@/types/cookbook.type"

const EDIT_FORM_ID = "chef-cookbook-edit-form"

/** Phone layout for a cookbook row — see the note on RecipeCard. */
function CookbookCard({ cookbook }: { cookbook: Cookbook }) {
  const out = cookbook.stockCount === 0
  const low = cookbook.stockCount > 0 && cookbook.stockCount < 5

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-16 rounded-lg overflow-hidden shrink-0"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        <Image
          src={cookbook.cookbook_image}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" style={{ color: "var(--cs-text-primary)" }}>
          {cookbook.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--cs-text-primary)" }}
          >
            ${cookbook.price.toFixed(2)}
          </span>
          <span
            className="text-[11px] tabular-nums"
            style={{
              color: out
                ? "var(--cs-danger-fg)"
                : low
                  ? "var(--cs-warning-fg)"
                  : "var(--cs-text-tertiary)",
            }}
          >
            {out ? "Out of stock" : `${cookbook.stockCount} in stock`}
          </span>
        </div>
      </div>
      <CaretRightIcon size={13} style={{ color: "var(--cs-text-tertiary)" }} />
    </div>
  )
}

export default function ChefCookbooksPage() {
  const { cookbooks, isLoading, isFetching, refresh } = useChefCookbooksTable()
  const { mutate: deleteCookbook, isPending: isDeleting } = useDeleteCookbook()
  const { mutateAsync: updateCookbook, isPending: isSaving } = useUpdateCookbook()

  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Cookbook | null>(null)
  const [deleting, setDeleting] = useState<Cookbook | null>(null)

  const filtered = useMemo(() => {
    if (!search) return cookbooks
    const q = search.toLowerCase()
    return cookbooks.filter((c) => c.title.toLowerCase().includes(q))
  }, [cookbooks, search])

  const handleSave = useCallback(
    async (values: {
      title: string
      description: string
      price: number
      stockCount: number
      image: File[]
    }) => {
      if (!editing) return
      try {
        await updateCookbook({
          id: editing._id,
          payload: {
            title: values.title,
            description: values.description,
            price: values.price,
            stockCount: values.stockCount,
            ...(values.image?.length > 0 ? { image: values.image[0] } : {}),
          },
        })
        toast.success("Cookbook updated.", { position: "bottom-right" })
        setEditing(null)
        refresh()
      } catch {
        toast.error("Failed to update cookbook.", { position: "bottom-right" })
      }
    },
    [editing, updateCookbook, refresh],
  )

  const handleDelete = useCallback(() => {
    if (!deleting) return
    deleteCookbook(deleting._id, {
      onSuccess: () => {
        toast.success("Cookbook deleted.", { position: "bottom-right" })
        setDeleting(null)
        refresh()
      },
      onError: () =>
        toast.error("Failed to delete cookbook.", { position: "bottom-right" }),
    })
  }, [deleting, deleteCookbook, refresh])

  const columns = useMemo(
    () => createChefCookbookColumns({ onEdit: setEditing, onDelete: setDeleting }),
    [],
  )

  return (
    <>
      <title>Cookbooks – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1
              className="text-xl font-semibold tracking-[-0.018em]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              My cookbooks
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              {cookbooks.length} cookbook{cookbooks.length !== 1 ? "s" : ""} published
            </p>
          </div>
          <Link href="/chef/cookbooks/create">
            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg">
              <PlusIcon size={13} weight="bold" />
              New cookbook
            </Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isFetching={isFetching}
          instantSearch
          onRowClick={setEditing}
          renderCard={(cookbook) => <CookbookCard cookbook={cookbook} />}
          emptyIcon={BookOpenIcon}
          emptyMessage={search ? "No cookbooks found" : "No cookbooks yet"}
          emptyAction={
            !search ? (
              <Link href="/chef/cookbooks/create">
                <Button size="sm" className="rounded-lg gap-1.5 h-8 text-xs mt-1">
                  <PlusIcon size={13} weight="bold" />
                  Create cookbook
                </Button>
              </Link>
            ) : undefined
          }
          onSearchChange={setSearch}
          searchPlaceholder="Search cookbooks…"
        />
      </div>

      <EditSheet
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit cookbook"
        description={editing?.title}
        formId={EDIT_FORM_ID}
        isSubmitting={isSaving}
      >
        {editing && (
          <CookbookForm
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
        kind="cookbook"
        name={deleting?.title}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
