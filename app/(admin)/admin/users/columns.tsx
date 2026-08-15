"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TrashIcon } from "@phosphor-icons/react/dist/ssr"
import { StatusPill, StatusSwitch } from "@/components/Admin/AdminUI"
import type { AdminUser } from "@/types/admin.type"

const ROLE_TONE: Record<string, "info" | "success" | "neutral"> = {
  admin: "info",
  chef: "success",
  user: "neutral",
}

export function createUserColumns({
  onRoleChange,
  onToggleActive,
  onDelete,
}: {
  onRoleChange: (id: string, role: string) => void
  onToggleActive: (id: string, current: boolean) => void
  onDelete: (user: AdminUser) => void
}): ColumnDef<AdminUser, unknown>[] {
  return [
    {
      id: "user",
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          User
        </span>
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
              <Image src={u.profile_url} alt={u.fullName} fill className="object-cover" sizes="32px" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate text-sm leading-tight">{u.fullName}</p>
              <p className="text-xs truncate" style={{ color: "var(--cs-text-tertiary)" }}>@{u.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "email",
      meta: { className: "hidden sm:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Email
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs truncate max-w-[180px] block" style={{ color: "var(--cs-text-secondary)" }}>{row.original.email}</span>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <StatusPill tone={ROLE_TONE[u.role] ?? "neutral"} className="hover:opacity-75 active:scale-[0.97]">
                {u.role}
              </StatusPill>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["user", "chef", "admin"].map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => onRoleChange(u._id, r)}
                  className={u.role === r ? "font-semibold" : ""}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      id: "status",
      accessorKey: "isActive",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <StatusSwitch
            active={u.isActive}
            onChange={() => onToggleActive(u._id, u.isActive)}
          />
        )
      },
    },
    {
      id: "provider",
      meta: { className: "hidden md:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Provider
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs capitalize" style={{ color: "var(--cs-text-tertiary)" }}>
          {row.original.authProvider}
        </span>
      ),
    },
    {
      id: "actions",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`Delete ${row.original.fullName}`}
          onClick={() => onDelete(row.original)}
          className="focus-ring h-8 w-8 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:!text-[var(--cs-danger-fg)] hover:!bg-[var(--cs-danger-bg)]"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          <TrashIcon size={15} />
        </button>
      ),
    },
  ]
}
