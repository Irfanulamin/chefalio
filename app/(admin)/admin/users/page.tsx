"use client";

import { useState } from "react";
import { useAllUsers, useAdminUpdateUser } from "@/hooks/useAdmin";
import Image from "next/image";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  MagnifyingGlassIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const ROLE_COLORS: Record<string, string> = {
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  chef: "bg-primary/10 text-primary",
  user: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

type RoleFilter = "user" | "chef" | "admin" | undefined;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  const { users, pagination, isLoading, isFetching } = useAllUsers({
    page,
    limit: 20,
    search: debouncedSearch,
    role: roleFilter,
    isActive: activeFilter,
  });

  const updateUser = useAdminUpdateUser();

  async function handleToggleActive(id: string, current: boolean) {
    try {
      await updateUser.mutateAsync({ id, payload: { isActive: !current } });
      toast.success(current ? "User deactivated" : "User activated");
    } catch {
      toast.error("Failed to update user");
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    try {
      await updateUser.mutateAsync({ id, payload: { role: newRole } });
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  }

  const totalPages = pagination?.pages ?? 1;

  const roleOptions: { label: string; value: RoleFilter }[] = [
    { label: "All roles", value: undefined },
    { label: "Member", value: "user" },
    { label: "Chef", value: "chef" },
    { label: "Admin", value: "admin" },
  ];

  return (
    <>
      <title>Users – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">Users</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {pagination?.total ?? 0} total users
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-52">
            <MagnifyingGlassIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {roleOptions.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => {
                setRoleFilter(value);
                setPage(1);
              }}
              className={[
                "px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors shrink-0",
                roleFilter === value
                  ? "bg-primary text-black border-primary"
                  : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
              ].join(" ")}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => {
              setActiveFilter(activeFilter === true ? undefined : true);
              setPage(1);
            }}
            className={[
              "px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors shrink-0",
              activeFilter === true
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
            ].join(" ")}
          >
            Active only
          </button>
          <button
            onClick={() => {
              setActiveFilter(activeFilter === false ? undefined : false);
              setPage(1);
            }}
            className={[
              "px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors shrink-0",
              activeFilter === false
                ? "bg-red-500 text-white border-red-500"
                : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
            ].join(" ")}
          >
            Inactive only
          </button>
        </div>

        {/* Table */}
        <div
          className={[
            "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-opacity duration-150",
            isFetching ? "opacity-60" : "",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3"><Skeleton className="h-3 w-10" /></th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell"><Skeleton className="h-3 w-10" /></th>
                    <th className="text-left px-4 py-3"><Skeleton className="h-3 w-8" /></th>
                    <th className="text-left px-4 py-3"><Skeleton className="h-3 w-12" /></th>
                    <th className="text-left px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-16" /></th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-2.5 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-3 w-36" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-14 rounded-full" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-12" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-7 w-20 rounded-lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-zinc-400">
              <UsersIcon size={24} />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden md:table-cell">
                      Provider
                    </th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={user.profile_url}
                              alt={user.fullName}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate leading-tight text-sm">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500 hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={[
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-75 transition-opacity",
                                ROLE_COLORS[user.role] ?? "",
                              ].join(" ")}
                            >
                              {user.role}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {["user", "chef", "admin"].map((r) => (
                              <DropdownMenuItem
                                key={r}
                                onClick={() => handleRoleChange(user._id, r)}
                                className={
                                  user.role === r ? "font-semibold" : ""
                                }
                              >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            user.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                          ].join(" ")}
                        >
                          {user.isActive ? (
                            <CheckCircleIcon size={11} weight="fill" />
                          ) : (
                            <XCircleIcon size={11} weight="fill" />
                          )}
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400 capitalize hidden md:table-cell">
                        {user.authProvider}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleToggleActive(user._id, user.isActive)
                          }
                          disabled={updateUser.isPending}
                          className={[
                            "text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium disabled:opacity-50",
                            user.isActive
                              ? "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400"
                              : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-700 dark:hover:text-emerald-400",
                          ].join(" ")}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-400">
              Page {page} of {totalPages} · {pagination?.total ?? 0} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeftIcon size={12} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRightIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
