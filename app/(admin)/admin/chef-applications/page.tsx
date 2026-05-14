"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import {
  useAllChefApplications,
  useChefApplicationStats,
} from "@/hooks/useChefApplication";
import type { ApplicationStatus, ChefApplication } from "@/types/chef-application.type";
import { cn } from "@/lib/utils";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ChefHatIcon,
  ArrowRightIcon,
  UserCircleIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@/components/ui/skeleton";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; classes: string }
> = {
  pending: {
    label: "Pending",
    icon: ClockIcon,
    classes:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircleIcon,
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircleIcon,
    classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
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
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  classes,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  classes: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", classes)}>
          <Icon size={15} weight="fill" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function ApplicationRow({ app }: { app: ChefApplication }) {
  const user =
    typeof app.userId === "object" ? app.userId : null;

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
      <td className="py-3 px-4">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
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
      </td>
      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
        {app.specialty}
      </td>
      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
        {app.yearsOfExperience}y
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={app.status} />
      </td>
      <td className="py-3 px-4 text-xs text-zinc-500">
        {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </td>
      <td className="py-3 px-4">
        <Link
          href={`/admin/chef-applications/${app._id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Review <ArrowRightIcon size={11} weight="bold" />
        </Link>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: { label: string; value: ApplicationStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminChefApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const { applications, pagination, isLoading, isFetching } =
    useAllChefApplications(statusFilter, page);

  const { stats } = useChefApplicationStats();

  const filtered = debouncedSearch
    ? applications.filter((a) => {
        const user = typeof a.userId === "object" ? a.userId : null;
        const name = (user?.fullName ?? a.fullName).toLowerCase();
        const email = (user?.email ?? "").toLowerCase();
        const q = debouncedSearch.toLowerCase();
        return name.includes(q) || email.includes(q) || a.specialty.toLowerCase().includes(q);
      })
    : applications;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <ChefHatIcon size={18} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Chef Applications</h1>
          <p className="text-xs text-zinc-500">Review and manage chef applicants</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={stats?.total ?? 0}
          icon={ChefHatIcon}
          classes="bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon={ClockIcon}
          classes="bg-amber-100 dark:bg-amber-900/30 text-amber-500"
        />
        <StatCard
          label="Approved"
          value={stats?.approved ?? 0}
          icon={CheckCircleIcon}
          classes="bg-green-100 dark:bg-green-900/30 text-green-500"
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected ?? 0}
          icon={XCircleIcon}
          classes="bg-red-100 dark:bg-red-900/30 text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status tabs */}
        <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {TABS.map((t) => (
            <button
              key={String(t.value)}
              type="button"
              onClick={() => {
                setStatusFilter(t.value);
                setPage(1);
              }}
              className={cn(
                "px-4 py-1.5 text-xs font-medium transition-colors",
                statusFilter === t.value
                  ? "bg-primary text-white"
                  : "text-zinc-500 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, specialty…"
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                <th className="py-3 px-4 font-medium">Applicant</th>
                <th className="py-3 px-4 font-medium">Specialty</th>
                <th className="py-3 px-4 font-medium">Exp.</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Submitted</th>
                <th className="py-3 px-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="py-3 px-4">
                        <Skeleton className="h-4 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-zinc-400"
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <ApplicationRow key={app._id} app={app} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-4 py-3">
            <p className="text-xs text-zinc-500">
              {pagination.total} total · page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40 transition-colors"
              >
                <CaretLeftIcon size={12} />
              </button>
              <button
                type="button"
                disabled={page === pagination.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40 transition-colors"
              >
                <CaretRightIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
