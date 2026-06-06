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
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { AdminUser } from "@/types/admin.type"

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  chef: "bg-primary/10 text-primary",
  user: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
}

export function createUserColumns({
  onRoleChange,
  onToggleActive,
  onDelete,
}: {
  onRoleChange: (id: string, role: string) => void
  onToggleActive: (id: string, current: boolean) => void
  onDelete: (id: string) => void
}): ColumnDef<AdminUser, unknown>[] {
  return [
    {
      id: "user",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          User
        </span>
      ),
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              <Image src={u.profile_url} alt={u.fullName} fill className="object-cover" sizes="32px" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate text-sm leading-tight">{u.fullName}</p>
              <p className="text-xs text-zinc-400 truncate">@{u.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "email",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:block">
          Email
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500 hidden sm:block truncate max-w-[180px]">{row.original.email}</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-75 transition-opacity ${ROLE_COLORS[u.role] ?? ""}`}
              >
                {u.role}
              </button>
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
          <button
            onClick={() => onToggleActive(u._id, u.isActive)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-75 transition-opacity ${
              u.isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {u.isActive ? (
              <CheckCircleIcon size={11} weight="fill" />
            ) : (
              <XCircleIcon size={11} weight="fill" />
            )}
            {u.isActive ? "Active" : "Inactive"}
          </button>
        )
      },
    },
    {
      id: "provider",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden md:block">
          Provider
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-zinc-400 capitalize hidden md:block">
          {row.original.authProvider}
        </span>
      ),
    },
    {
      id: "actions",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <TrashIcon size={14} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <strong>{row.original.fullName}</strong> and all their data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(row.original._id)}
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]
}
