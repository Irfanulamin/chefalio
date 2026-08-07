"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  BookOpenIcon,
  ChefHatIcon,
  CurrencyDollarIcon,
  ForkKnifeIcon,
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import { EASE } from "./motion";

/**
 * Static, presentational mocks of the real chef + admin dashboards.
 * No data hooks, no auth — sample arrays only. Colours mirror the constants
 * in app/(chef)/chef/dashboard and app/(admin)/admin/dashboard so the preview
 * matches what a user actually lands on.
 */

const ACCENT = "#A7D129";

const DIFFICULTY_COLORS = ["#a7d129", "#f59e0b", "#ef4444"];

/* All figures below are sample data for the marketing preview, not live metrics. */

const STATUS_DOT: Record<string, string> = {
  paid: "#34d399",
  shipped: "#60a5fa",
  delivered: "#a7d129",
  pending: "#fbbf24",
};

const uploadTrend = [
  { date: "Mar 1", count: 2 },
  { date: "Mar 3", count: 5 },
  { date: "Mar 5", count: 3 },
  { date: "Mar 7", count: 8 },
  { date: "Mar 9", count: 6 },
  { date: "Mar 11", count: 11 },
  { date: "Mar 13", count: 9 },
  { date: "Mar 15", count: 14 },
];

const revenueTrend = [
  { date: "Jan", value: 1840 },
  { date: "Feb", value: 2410 },
  { date: "Mar", value: 2180 },
  { date: "Apr", value: 3260 },
  { date: "May", value: 4020 },
  { date: "Jun", value: 3880 },
  { date: "Jul", value: 5140 },
];

const difficultySplit = [
  { name: "Beginner", value: 48 },
  { name: "Intermediate", value: 34 },
  { name: "Advanced", value: 18 },
];

const engagementBars = [
  { name: "Views", value: 92 },
  { name: "Likes", value: 64 },
  { name: "Saves", value: 47 },
  { name: "Buys", value: 31 },
];

const chefOrders = [
  { name: "Weeknight Italian", status: "paid", amount: "$24.00" },
  { name: "Fermentation Basics", status: "shipped", amount: "$32.00" },
  { name: "Sourdough Field Guide", status: "delivered", amount: "$18.00" },
  { name: "Knife Skills Vol. 2", status: "pending", amount: "$27.00" },
];

const topChefs = [
  { name: "Marco Rivera", meta: "42 recipes · 6 cookbooks", value: "$8,240" },
  { name: "Amara Osei", meta: "38 recipes · 4 cookbooks", value: "$6,910" },
  { name: "Yuki Tanaka", meta: "31 recipes · 5 cookbooks", value: "$5,480" },
  { name: "Lina Ferrari", meta: "27 recipes · 3 cookbooks", value: "$4,120" },
];

// ─── Shared primitives ───────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-medium truncate"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          {label}
        </span>
        <Icon size={12} style={{ color: "var(--cs-text-tertiary)" }} />
      </div>
      <p
        className="text-lg font-semibold tabular-nums leading-none"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-[10px] truncate"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        {sub}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg p-3 ${className}`}
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      <h3
        className="text-[11px] font-semibold mb-3"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function RowList({
  rows,
}: {
  rows: { name: string; meta?: string; status?: string; value: string }[];
}) {
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.name} className="flex items-center gap-2">
          {row.status ? (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_DOT[row.status] }}
            />
          ) : (
            <span
              className="h-5 w-5 shrink-0 rounded-full grid place-items-center text-[9px] font-semibold"
              style={{
                backgroundColor: "var(--cs-accent-muted)",
                color: "var(--cs-text-secondary)",
              }}
            >
              {row.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-medium truncate"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {row.name}
            </p>
            {(row.meta || row.status) && (
              <p
                className="text-[9px] truncate capitalize"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                {row.meta ?? row.status}
              </p>
            )}
          </div>
          <span
            className="text-[11px] font-semibold tabular-nums shrink-0"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 9, fill: "var(--cs-text-tertiary)" },
} as const;

// ─── Panels ──────────────────────────────────────────────────────────────────

function ChefPanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatCard label="Recipes" value="42" sub="+6 this month" icon={ForkKnifeIcon} />
        <StatCard label="Cookbooks" value="6" sub="2 in draft" icon={BookOpenIcon} />
        <StatCard label="Likes" value="3.1k" sub="+18% vs last" icon={HeartIcon} />
        <StatCard label="Earnings" value="$8,240" sub="Paid out weekly" icon={CurrencyDollarIcon} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Panel title="Recipe uploads, last 14 days" className="sm:col-span-3">
          <ResponsiveContainer width="100%" height={112}>
            <AreaChart data={uploadTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chefUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" {...axisProps} interval={1} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#chefUploads)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Recent orders" className="sm:col-span-2">
          <RowList rows={chefOrders.map((o) => ({ name: o.name, status: o.status, value: o.amount }))} />
        </Panel>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatCard label="Users" value="12,480" sub="+412 this week" icon={UsersIcon} />
        <StatCard label="Chefs" value="118" sub="9 pending review" icon={ChefHatIcon} />
        <StatCard label="Recipes" value="4,206" sub="Across 40 countries" icon={ForkKnifeIcon} />
        <StatCard label="Revenue" value="$52.9k" sub="+24% MoM" icon={CurrencyDollarIcon} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Panel title="Platform revenue" className="sm:col-span-3">
          <ResponsiveContainer width="100%" height={112}>
            <AreaChart data={revenueTrend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" {...axisProps} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#adminRevenue)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top chefs" className="sm:col-span-2">
          <RowList rows={topChefs} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Panel title="Recipes by difficulty" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie
                  data={difficultySplit}
                  dataKey="value"
                  innerRadius={22}
                  outerRadius={38}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {difficultySplit.map((entry, i) => (
                    <Cell key={entry.name} fill={DIFFICULTY_COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1.5">
              {difficultySplit.map((d, i) => (
                <li key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: DIFFICULTY_COLORS[i] }}
                  />
                  <span className="text-[10px]" style={{ color: "var(--cs-text-secondary)" }}>
                    {d.name}
                  </span>
                  <span
                    className="text-[10px] font-semibold tabular-nums"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {d.value}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Recipe interactions" className="sm:col-span-3">
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={engagementBars} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" {...axisProps} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={ACCENT} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

// ─── Frame ───────────────────────────────────────────────────────────────────

const VIEWS = [
  { id: "chef", label: "Chef", path: "chefalio.xyz/chef/dashboard" },
  { id: "admin", label: "Admin", path: "chefalio.xyz/admin/dashboard" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function DashboardPreview() {
  const [view, setView] = useState<ViewId>("chef");
  const active = VIEWS.find((v) => v.id === view)!;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-1)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(90,122,31,0.10)",
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-3 py-2.5"
        style={{
          borderBottom: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-2)",
        }}
      >
        <div className="flex gap-1.5 shrink-0">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: c, opacity: 0.75 }}
            />
          ))}
        </div>

        <div
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-2.5 py-1"
          style={{
            backgroundColor: "var(--cs-surface-3)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          <ShieldCheckIcon size={11} style={{ color: ACCENT }} />
          <AnimatePresence mode="wait">
            <motion.span
              key={active.path}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="truncate text-[10px] tabular-nums"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              {active.path}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* View toggle */}
        <div
          className="flex shrink-0 gap-0.5 rounded-full p-0.5"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
          role="tablist"
          aria-label="Dashboard preview"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className="relative cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              style={{
                color:
                  view === v.id ? "var(--primary-foreground)" : "var(--cs-text-secondary)",
              }}
            >
              {view === v.id && (
                <motion.span
                  layoutId="preview-toggle"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
              <span className="relative z-10">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel body */}
      <div className="p-3 sm:p-4" style={{ backgroundColor: "var(--cs-surface-1)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {view === "chef" ? <ChefPanel /> : <AdminPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardPreview;
