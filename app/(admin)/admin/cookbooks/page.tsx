"use client"

import { useState, useMemo } from "react"
import { useAdminCookbooksTable } from "@/hooks/swr/use-admin-cookbooks-table"
import {
  useAdminDeleteCookbook,
  useAdminUpdateCookbook,
  useAdminApplyGlobalDiscount,
} from "@/hooks/useAdmin"
import type { Cookbook } from "@/types/cookbook.type"
import Image from "next/image"
import { DataTable } from "@/components/ui/data-table"
import { createCookbookColumns } from "./columns"
import { toast } from "sonner"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { BookOpenIcon, TagIcon } from "@phosphor-icons/react/dist/ssr"
import { PageHeader, Panel } from "@/components/Admin/AdminUI"

const DISCOUNT_PRESETS = [
  { label: "Off", value: 0 },
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
]

export default function AdminCookbooksPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Cookbook | null>(null)
  const [editForm, setEditForm] = useState({
    price: "",
    stockCount: "",
    discount: "",
  })
  const [pendingGlobalDiscount, setPendingGlobalDiscount] = useState<
    number | null
  >(null)

  const { cookbooks, pagination, isLoading, isFetching, refresh } =
    useAdminCookbooksTable({
      page,
      limit: 20,
      search: search || undefined,
    })

  const deleteCookbook = useAdminDeleteCookbook()
  const updateCookbook = useAdminUpdateCookbook()
  const applyGlobalDiscount = useAdminApplyGlobalDiscount()

  async function handleDelete(id: string) {
    try {
      await deleteCookbook.mutateAsync(id)
      toast.success("Cookbook deleted")
      refresh()
    } catch {
      toast.error("Failed to delete cookbook")
    }
  }

  function openEdit(cookbook: Cookbook) {
    setEditTarget(cookbook)
    setEditForm({
      price: String(cookbook.price),
      stockCount: String(cookbook.stockCount),
      discount: String(cookbook.discount ?? 0),
    })
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editTarget) return
    const price = parseFloat(editForm.price)
    const stockCount = parseInt(editForm.stockCount, 10)
    const discount = parseInt(editForm.discount, 10)
    if (isNaN(price) || price < 0 || isNaN(stockCount) || stockCount < 0) {
      toast.error("Invalid price or stock count")
      return
    }
    if (isNaN(discount) || discount < 0 || discount > 15) {
      toast.error("Discount must be between 0% and 15%")
      return
    }
    try {
      await updateCookbook.mutateAsync({
        id: editTarget._id,
        payload: { price, stockCount, discount },
      })
      toast.success("Cookbook updated")
      setEditTarget(null)
      refresh()
    } catch {
      toast.error("Failed to update cookbook")
    }
  }

  async function handleGlobalDiscount() {
    if (pendingGlobalDiscount === null) return
    try {
      await applyGlobalDiscount.mutateAsync(pendingGlobalDiscount)
      toast.success(
        pendingGlobalDiscount === 0
          ? "Global discount removed"
          : `${pendingGlobalDiscount}% discount applied to all cookbooks`,
      )
      setPendingGlobalDiscount(null)
      refresh()
    } catch {
      toast.error("Failed to apply global discount")
    }
  }

  const columns = useMemo(
    () =>
      createCookbookColumns({
        onEdit: openEdit,
        onDelete: handleDelete,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const totalPages = pagination?.totalPages ?? 1

  return (
    <>
      <title>Cookbooks – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <PageHeader
          title="Cookbooks"
          description={`Manage pricing, stock, discounts, and remove cookbooks · ${pagination?.total ?? 0} total`}
          icon={BookOpenIcon}
          iconTone="warning"
        />

        {/* Edit Modal */}
        <Dialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        >
          <DialogContent className="sm:max-w-sm flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Edit Cookbook</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 px-1">
              {editTarget && (
              <form onSubmit={handleUpdate} className="space-y-4 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-lg min-w-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                  <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-2)" }}>
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
                  <p className="text-sm font-medium text-foreground truncate min-w-0 flex-1">
                    {editTarget.title}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
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
                      className="w-full px-3 py-2 text-sm rounded-lg text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
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
                      className="w-full px-3 py-2 text-sm rounded-lg text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                    Discount (0–15%)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {DISCOUNT_PRESETS.map((p) => {
                      const active = parseInt(editForm.discount, 10) === p.value
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() =>
                            setEditForm((f) => ({
                              ...f,
                              discount: String(p.value),
                            }))
                          }
                          className="focus-ring flex-1 py-1.5 text-xs rounded-lg transition-[background-color,color,transform] duration-150 active:scale-[0.97] hover:text-foreground"
                          style={
                            active
                              ? { border: "1px solid var(--primary)", backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent-text)", fontWeight: 500 }
                              : { border: "1px solid var(--cs-border-default)", color: "var(--cs-text-secondary)" }
                          }
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="1"
                    value={editForm.discount}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, discount: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                    placeholder="Custom (0-15)"
                  />
                </div>
                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="focus-ring px-4 py-2 text-sm rounded-lg transition-colors hover:text-foreground"
                    style={{ border: "1px solid var(--cs-border-default)", color: "var(--cs-text-secondary)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateCookbook.isPending}
                    className="focus-ring px-4 py-2 text-sm rounded-lg bg-primary text-black font-medium hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50 transition-[background-color,transform] duration-150"
                  >
                    {updateCookbook.isPending ? "Saving…" : "Save"}
                  </button>
                </DialogFooter>
              </form>
            )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Global Discount */}
        <Panel padded={false} className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <TagIcon size={16} style={{ color: "var(--cs-text-tertiary)" }} />
            <span className="text-sm font-medium text-foreground">
              Global Discount
            </span>
          </div>
          <p className="text-xs flex-1 min-w-0" style={{ color: "var(--cs-text-tertiary)" }}>
            Apply a site-wide discount to all cookbooks at once (max 15%).
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {DISCOUNT_PRESETS.map((p) => {
              const active = pendingGlobalDiscount === p.value
              return (
                <button
                  key={p.value}
                  onClick={() => setPendingGlobalDiscount(p.value)}
                  className="focus-ring px-3 py-1.5 text-xs rounded-lg transition-[background-color,color,transform] duration-150 active:scale-[0.97] hover:text-foreground"
                  style={
                    active
                      ? { border: "1px solid var(--primary)", backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent-text)", fontWeight: 500 }
                      : { border: "1px solid var(--cs-border-default)", color: "var(--cs-text-secondary)" }
                  }
                >
                  {p.label}
                </button>
              )
            })}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={
                  pendingGlobalDiscount === null ||
                  applyGlobalDiscount.isPending
                }
                className="focus-ring px-3 py-1.5 text-xs rounded-lg bg-primary text-black font-medium hover:bg-primary/90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-[background-color,transform] duration-150 shrink-0"
              >
                {applyGlobalDiscount.isPending ? "Applying…" : "Apply"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apply global discount?</AlertDialogTitle>
                <AlertDialogDescription>
                  {pendingGlobalDiscount === 0
                    ? "This will remove the discount from all cookbooks."
                    : `This will apply a ${pendingGlobalDiscount}% discount to all cookbooks.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setPendingGlobalDiscount(null)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGlobalDiscount}
                  className="bg-primary text-black hover:bg-primary/90 border-0"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Panel>

        <DataTable
          columns={columns}
          data={cookbooks}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={BookOpenIcon}
          emptyMessage="No cookbooks found"
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          searchPlaceholder="Search cookbooks..."
          pagination={
            totalPages > 1
              ? {
                  page,
                  totalPages,
                  total: pagination?.total ?? 0,
                  itemLabel: "cookbooks",
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>
    </>
  )
}
