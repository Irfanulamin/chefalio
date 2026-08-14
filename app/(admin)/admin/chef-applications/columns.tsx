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
import { StatusPill, type StatusTone } from "@/components/Admin/AdminUI"
import type { ChefApplication, ApplicationStatus } from "@/types/chef-application.type"

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; tone: StatusTone }
> = {
  pending: { label: "Pending", icon: ClockIcon, tone: "warning" },
  approved: { label: "Approved", icon: CheckCircleIcon, tone: "success" },
  rejected: { label: "Rejected", icon: XCircleIcon, tone: "danger" },
}

export function createChefApplicationColumns(): ColumnDef<ChefApplication, unknown>[] {
  return [
    {
      id: "applicant",
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                <UserCircleIcon size={18} style={{ color: "var(--cs-text-tertiary)" }} />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {user?.fullName ?? app.fullName}
              </p>
              <p className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>{user?.email ?? "—"}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "specialty",
      meta: { className: "hidden sm:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Specialty
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
          {row.original.specialty}
        </span>
      ),
    },
    {
      id: "experience",
      accessorKey: "yearsOfExperience",
      enableSorting: true,
      meta: { className: "hidden md:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Exp." />,
      cell: ({ row }) => (
        <span className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
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
        return (
          <StatusPill tone={cfg.tone} icon={cfg.icon}>
            {cfg.label}
          </StatusPill>
        )
      },
    },
    {
      id: "submitted",
      accessorFn: (row) => new Date(row.createdAt).getTime(),
      enableSorting: true,
      meta: { className: "hidden lg:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Submitted" />,
      cell: ({ row }) => (
        <span className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>
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
