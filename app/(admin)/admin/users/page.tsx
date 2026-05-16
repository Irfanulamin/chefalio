"use client"

import { useState, useMemo } from "react"
import { useAdminUsersTable } from "@/hooks/swr/use-admin-users-table"
import {
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminCreateUser,
} from "@/hooks/useAdmin"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createUserColumns } from "./columns"
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
    {
      label: "Active",
      value: "true",
      activeClassName: "bg-emerald-500 text-white shadow-sm",
    },
    {
      label: "Inactive",
      value: "false",
      activeClassName: "bg-red-500 text-white shadow-sm",
    },
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
  const deleteUser = useAdminDeleteUser()
  const createUser = useAdminCreateUser()

  async function handleToggleActive(id: string, current: boolean) {
    try {
      await updateUser.mutateAsync({ id, payload: { isActive: !current } })
      toast.success(current ? "User deactivated" : "User activated")
      refresh()
    } catch {
      toast.error("Failed to update user")
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    try {
      await updateUser.mutateAsync({ id, payload: { role: newRole } })
      toast.success("Role updated")
      refresh()
    } catch {
      toast.error("Failed to update role")
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser.mutateAsync(id)
      toast.success("User deleted")
      refresh()
    } catch {
      toast.error("Failed to delete user")
    }
  }

  function closeCreateModal() {
    setCreateOpen(false)
    setForm(EMPTY_FORM)
    setShowPassword(false)
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createUser.mutateAsync(form)
      toast.success("User created")
      closeCreateModal()
      refresh()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create user"
      toast.error(msg)
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
        onDelete: handleDeleteUser,
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Users</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              Manage accounts, roles, and status ·{" "}
              {pagination?.total ?? 0} total
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors shrink-0"
          >
            <PlusIcon size={13} weight="bold" />
            Create User
          </button>
        </div>

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
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Username
                  </label>
                  <div className="relative">
                    <AtIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="janedoe"
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Email address
                </label>
                <div className="relative">
                  <EnvelopeSimpleIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Password
                </label>
                <div className="relative">
                  <LockSimpleIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full pl-8 pr-10 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-0.5"
                  >
                    {showPassword ? <EyeSlashIcon size={15} /> : <EyeIcon size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
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
                        color: "text-zinc-500",
                        active: "border-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 dark:border-zinc-500",
                      },
                      {
                        value: "chef",
                        label: "Chef",
                        desc: "Publish content",
                        Icon: ChefHatIcon,
                        color: "text-primary",
                        active: "border-primary bg-primary/5",
                      },
                      {
                        value: "admin",
                        label: "Admin",
                        desc: "Full access",
                        Icon: CrownSimpleIcon,
                        color: "text-purple-500",
                        active: "border-purple-400 bg-purple-50 dark:bg-purple-900/20",
                      },
                    ] as const
                  ).map(({ value, label, desc, Icon, color, active }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: value }))}
                      className={[
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all cursor-pointer",
                        form.role === value
                          ? active
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        weight={form.role === value ? "fill" : "regular"}
                        className={form.role === value ? color : "text-zinc-400"}
                      />
                      <span
                        className={[
                          "text-xs font-semibold leading-tight",
                          form.role === value
                            ? "text-foreground"
                            : "text-zinc-500 dark:text-zinc-400",
                        ].join(" ")}
                      >
                        {label}
                      </span>
                      <span className="text-[10px] text-zinc-400 leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="px-4 py-2 text-sm rounded-lg bg-primary text-black font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
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
    </>
  )
}
