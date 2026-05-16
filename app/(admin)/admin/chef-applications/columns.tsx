"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import Link from "next/link"
import { SortableHeader } from "@/components/ui/data-table"
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import type { ChefApplication, ApplicationStatus } from "@/types/chef-application.type"

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; classes: string }
> = {
  pending: {
    label: "Pending",
    icon: ClockIcon,
    classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircleIcon,
    classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircleIcon,
    classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
}

export function createChefApplicationColumns(): ColumnDef<ChefApplication, unknown>[] {
  return [
    {
      id: "applicant",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Applicant
        </span>
      ),
      cell: ({ row }) => {
        const app = row.original
        const user = typeof app.userId === "object" ? app.userId : null
        return (
          <div className="flex items-center gap-3">
            {user?.profile_url ? (
              <Image
                src={user.profile_url}
                alt={user.fullName}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <UserCircleIcon size={18} className="text-zinc-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {user?.fullName ?? app.fullName}
              </p>
              <p className="text-xs text-zinc-500">{user?.email ?? "—"}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "specialty",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:block">
          Specialty
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:block">
          {row.original.specialty}
        </span>
      ),
    },
    {
      id: "experience",
      accessorKey: "yearsOfExperience",
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden md:block">
          <SortableHeader column={column} title="Exp." />
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden md:block">
          {row.original.yearsOfExperience}y
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const cfg = STATUS_CONFIG[row.original.status]
        const Icon = cfg.icon
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              cfg.classes,
            )}
          >
            <Icon size={11} weight="fill" />
            {cfg.label}
          </span>
        )
      },
    },
    {
      id: "submitted",
      accessorFn: (row) => new Date(row.createdAt).getTime(),
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden lg:block">
          <SortableHeader column={column} title="Submitted" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500 hidden lg:block">
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "review",
      size: 80,
      header: () => null,
      cell: ({ row }) => (
        <Link
          href={`/admin/chef-applications/${row.original._id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Review <ArrowRightIcon size={11} weight="bold" />
        </Link>
      ),
    },
  ]
}
