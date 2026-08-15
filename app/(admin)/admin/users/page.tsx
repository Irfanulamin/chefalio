"use client"

import { useState, useMemo, useCallback } from "react"
import { useAdminUsersTable } from "@/hooks/swr/use-admin-users-table"
import {
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminCreateUser,
} from "@/hooks/useAdmin"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { DeleteDialog } from "@/components/common/DeleteDialog"
import { createUserColumns } from "./columns"
import type { AdminUser } from "@/types/admin.type"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AtIcon,
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  UserIcon,
  ChefHatIcon,
  CrownSimpleIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr"
import { PageHeader } from "@/components/Admin/AdminUI"

const EMPTY_FORM = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "user",
}

type RoleFilter = "user" | "chef" | "admin" | ""
type ActiveFilter = "" | "true" | "false"

const ROLE_FILTER_CONFIG: FilterConfig = {
  key: "role",
  type: "pill",
  options: [
    { label: "All roles", value: "" },
    { label: "Member", value: "user" },
    { label: "Chef", value: "chef" },
    { label: "Admin", value: "admin" },
  ],
}

const ACTIVE_FILTER_CONFIG: FilterConfig = {
  key: "isActive",
  type: "segmented",
  options: [
    { label: "All", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ],
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    role: "",
    isActive: "",
  })
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)

  const role = filterValues.role as RoleFilter
  const isActiveStr = filterValues.isActive as ActiveFilter

  const { users, pagination, isLoading, isFetching, refresh } =
    useAdminUsersTable({
      page,
      limit: 20,
      search: search || undefined,
      role: role || undefined,
      isActive:
        isActiveStr === "true"
          ? true
          : isActiveStr === "false"
            ? false
            : undefined,
    })

  const updateUser = useAdminUpdateUser()
  const { mutate: deleteUser, isPending: isDeleting } = useAdminDeleteUser()
  const createUser = useAdminCreateUser()

  // Single controlled dialog holding the target row, rather than an
  // AlertDialog mounted inside every action cell — see DeleteDialog.
  const [deleting, setDeleting] = useState<AdminUser | null>(null)

  const handleDeleteUser = useCallback(() => {
    if (!deleting) return
    deleteUser(deleting._id, {
      onSuccess: () => {
        toast.success("User deleted")
        setDeleting(null)
        refresh()
      },
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to delete user"),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleting, deleteUser])

  async function handleToggleActive(id: string, current: boolean) {
    try {
      await updateUser.mutateAsync({ id, payload: { isActive: !current } })
      toast.success(current ? "User deactivated" : "User activated")
      refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user")
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    try {
      await updateUser.mutateAsync({ id, payload: { role: newRole } })
      toast.success("Role updated")
      refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role")
    }
  }


  function closeCreateModal() {
    setCreateOpen(false)
    setForm(EMPTY_FORM)
    setShowPassword(false)
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await createUser.mutateAsync(form)
      toast.success("User created")
      closeCreateModal()
      refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user")
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const columns = useMemo(
    () =>
      createUserColumns({
        onRoleChange: handleRoleChange,
        onToggleActive: handleToggleActive,
        onDelete: setDeleting,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const totalPages =
    pagination?.pages ??
    (pagination?.total ? Math.ceil(pagination.total / 20) : 1)

  return (
    <>
      <title>Users – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <PageHeader
          title="Users"
          description={`Manage accounts, roles, and status · ${pagination?.total ?? 0} total`}
          icon={UsersIcon}
          iconTone="info"
          action={
            <button
              onClick={() => setCreateOpen(true)}
              className="focus-ring flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-black hover:bg-primary/90 active:scale-[0.97] transition-[background-color,transform] duration-150 shrink-0"
            >
              <PlusIcon size={13} weight="bold" />
              Create User
            </button>
          }
        />

        {/* Create User Dialog */}
        <Dialog
          open={createOpen}
          onOpenChange={(open) => !open && closeCreateModal()}
        >
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  {form.fullName.trim() ? (
                    <span className="text-sm font-bold text-primary select-none">
                      {form.fullName
                        .trim()
                        .split(/\s+/)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <UserCircleIcon size={22} className="text-primary/50" />
                  )}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base">Create new user</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    Fill in the details below to add a member to the platform.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cs-text-tertiary)" }} />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg text-foreground placeholder:text-(--cs-text-tertiary) outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                    Username
                  </label>
                  <div className="relative">
                    <AtIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cs-text-tertiary)" }} />
                    <input
                      type="text"
                      required
                      placeholder="janedoe"
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg text-foreground placeholder:text-(--cs-text-tertiary) outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                  Email address
                </label>
                <div className="relative">
                  <EnvelopeSimpleIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cs-text-tertiary)" }} />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg text-foreground placeholder:text-(--cs-text-tertiary) outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                  Password
                </label>
                <div className="relative">
                  <LockSimpleIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--cs-text-tertiary)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full pl-8 pr-10 py-2 text-sm rounded-lg text-foreground placeholder:text-(--cs-text-tertiary) outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors p-0.5 hover:text-foreground"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    {showPassword ? <EyeSlashIcon size={15} /> : <EyeIcon size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
                  Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        value: "user",
                        label: "Member",
                        desc: "Browse & buy",
                        Icon: UserIcon,
                        tone: "neutral",
                      },
                      {
                        value: "chef",
                        label: "Chef",
                        desc: "Publish content",
                        Icon: ChefHatIcon,
                        tone: "accent",
                      },
                      {
                        value: "admin",
                        label: "Admin",
                        desc: "Full access",
                        Icon: CrownSimpleIcon,
                        tone: "info",
                      },
                    ] as const
                  ).map(({ value, label, desc, Icon, tone }) => {
                    const isActive = form.role === value
                    const toneVars: Record<string, { fg: string; bg: string; border: string }> = {
                      neutral: { fg: "var(--cs-text-primary)", bg: "var(--cs-surface-3)", border: "var(--cs-border-default)" },
                      accent: { fg: "var(--cs-accent-text)", bg: "var(--cs-accent-muted)", border: "color-mix(in oklab, var(--primary) 45%, transparent)" },
                      info: { fg: "var(--cs-info-fg)", bg: "var(--cs-info-bg)", border: "var(--cs-info-edge)" },
                    }
                    const t = toneVars[tone]
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, role: value }))}
                        className="focus-ring flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-[transform,background-color,border-color] duration-150 cursor-pointer active:scale-[0.97]"
                        style={
                          isActive
                            ? { borderColor: t.border, backgroundColor: t.bg }
                            : { borderColor: "var(--cs-border-subtle)" }
                        }
                      >
                        <Icon
                          size={18}
                          weight={isActive ? "fill" : "regular"}
                          style={{ color: isActive ? t.fg : "var(--cs-text-tertiary)" }}
                        />
                        <span
                          className="text-xs font-semibold leading-tight"
                          style={{ color: isActive ? "var(--cs-text-primary)" : "var(--cs-text-secondary)" }}
                        >
                          {label}
                        </span>
                        <span className="text-[10px] leading-tight" style={{ color: "var(--cs-text-tertiary)" }}>{desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <DialogFooter>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="focus-ring px-4 py-2 text-sm rounded-lg transition-[color,border-color] duration-150 hover:text-foreground"
                  style={{ border: "1px solid var(--cs-border-default)", color: "var(--cs-text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="focus-ring px-4 py-2 text-sm rounded-lg bg-primary text-black font-medium hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50 transition-[background-color,transform] duration-150"
                >
                  {createUser.isPending ? "Creating…" : "Create user"}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={UsersIcon}
          emptyMessage="No users found"
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          searchPlaceholder="Search name or email..."
          filterConfigs={[ROLE_FILTER_CONFIG, ACTIVE_FILTER_CONFIG]}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          pagination={
            totalPages > 1
              ? {
                  page,
                  totalPages,
                  total: pagination?.total ?? 0,
                  itemLabel: "users",
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        kind="user"
        name={deleting?.fullName}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </>
  )
}
