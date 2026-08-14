"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { TrendUpIcon, TrendDownIcon } from "@phosphor-icons/react/dist/ssr"
import { Switch } from "@/components/ui/switch"
import { SPRING } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Shared chrome for every admin page — header, stat tiles, panels, status
 * pills. Pages used to each grow their own version of these (different
 * radius, different neutral ramp, different hover), which is what made the
 * console read as six different tools stitched together. One definition,
 * drawn from the same `--cs-*` tokens and `SPRING` the rest of the product
 * already uses, is what makes moving between them read as one product.
 */

// ─── Entrance ───────────────────────────────────────────────────────────────

/** Staggers its children in on mount — used to bring a page's tiles and
 *  panels on together instead of having them all just appear. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING.soft, delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── Page header ────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  description,
  action,
  icon,
  iconTone = "accent",
}: {
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  /** Optional leading glyph tile — used where the page names a single
     concept (Chef Applications) rather than a table of many rows. Each
     section gets its own hue (Users is blue, Orders is green, …) so the
     console's pages read as distinct places, the way a sidebar with
     colored icons does in Linear or Notion. */
  icon?: React.ElementType
  iconTone?: Tone
}) {
  return (
    <Reveal className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        {icon && <IconTile icon={icon} tone={iconTone} />}
        <div className="min-w-0">
          <h1 className="ui-title text-foreground">{title}</h1>
          {description && (
            <p className="ui-caption mt-0.5" style={{ color: "var(--cs-text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}

// ─── Tone system ────────────────────────────────────────────────────────────
// One palette, five hues plus neutral, shared by every colored surface in the
// console (stat glyphs, icon tiles, status pills). Each stat gets its own
// hue so a row of KPIs reads as distinct metrics at a glance — the way
// Stripe, Linear and Mercury badge their dashboard tiles — rather than four
// identical gray numbers that only differ by the label above them.

export type Tone = "accent" | "success" | "warning" | "danger" | "info" | "violet" | "neutral"

const TONE_STYLE: Record<Tone, { bg: string; fg: string }> = {
  accent: { bg: "var(--cs-accent-muted)", fg: "var(--cs-accent-text)" },
  success: { bg: "var(--cs-success-bg)", fg: "var(--cs-success-fg)" },
  warning: { bg: "var(--cs-warning-bg)", fg: "var(--cs-warning-fg)" },
  danger: { bg: "var(--cs-danger-bg)", fg: "var(--cs-danger-fg)" },
  info: { bg: "var(--cs-info-bg)", fg: "var(--cs-info-fg)" },
  violet: { bg: "var(--cs-violet-bg)", fg: "var(--cs-violet-fg)" },
  neutral: { bg: "var(--cs-surface-3)", fg: "var(--cs-text-secondary)" },
}

// ─── Stat card ──────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  index = 0,
  tone = "neutral",
  trend,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  index?: number
  /** Colors the glyph's tile — enough to code a stat's identity (revenue is
     green, a warning count is amber) without a full status pill
     overpowering a tile whose real content is the number. */
  tone?: Tone
  /** Trailing real values (not fabricated) — e.g. the last 30 days of this
     metric. Renders as a sparkline behind the number and a computed
     first-to-last % delta, the way Stripe/Linear/Mercury badge a KPI tile.
     Omit where no genuine series exists rather than reusing another
     metric's shape. */
  trend?: number[]
}) {
  const reduceMotion = useReducedMotion()
  const t = TONE_STYLE[tone]
  const gradId = `spark-${label.replace(/\s+/g, "")}`

  let delta: number | null = null
  if (trend && trend.length >= 2) {
    const first = trend.find((v) => v !== 0) ?? trend[0]
    const last = trend[trend.length - 1]
    delta = first !== 0 ? Math.round(((last - first) / Math.abs(first)) * 100) : null
  }

  return (
    <motion.div
      className="ui-card ui-card-interactive relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(90deg, ${t.fg}, color-mix(in oklab, ${t.fg} 30%, transparent))`,
        backgroundSize: "100% 3px",
        backgroundRepeat: "no-repeat",
      }}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING.soft, delay: reduceMotion ? 0 : index * 0.04 }}
    >
      <div className={cn("p-5", trend && trend.length >= 2 ? "pb-0" : undefined)}>
        <div className="flex items-center justify-between mb-3.5">
          <span className="ui-caption font-medium" style={{ color: "var(--cs-text-secondary)" }}>
            {label}
          </span>
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{ width: 26, height: 26, backgroundColor: t.bg, color: t.fg }}
          >
            <Icon size={13} weight={tone === "neutral" ? "regular" : "fill"} />
          </div>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[1.75rem] font-semibold text-foreground ui-numeric leading-none tracking-tight">
              {value}
            </p>
            {sub && (
              <p className="mt-1.5 ui-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                {sub}
              </p>
            )}
          </div>
          {delta !== null && (
            <span
              className="flex items-center gap-0.5 ui-micro font-semibold mb-1 shrink-0"
              style={{ color: delta >= 0 ? "var(--cs-success-fg)" : "var(--cs-danger-fg)" }}
            >
              {delta >= 0 ? <TrendUpIcon size={11} weight="bold" /> : <TrendDownIcon size={11} weight="bold" />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>
      {trend && trend.length >= 2 && (
        <div className="h-9 mt-2 -mb-px opacity-90">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.map((v) => ({ v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.fg} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={t.fg} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={t.fg}
                strokeWidth={1.75}
                fill={`url(#${gradId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel (generic bordered card, replaces raw rounded-xl/border-zinc) ────

export function Panel({
  children,
  className,
  padded = true,
  style,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div className={cn("ui-card", padded && "p-5", className)} style={style}>
      {children}
    </div>
  )
}

// ─── Status pill ────────────────────────────────────────────────────────────

export type StatusTone = "success" | "warning" | "danger" | "info" | "violet" | "neutral"

export function StatusPill({
  tone,
  icon: Icon,
  children,
  onClick,
  className,
}: {
  tone: StatusTone
  icon?: React.ElementType
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  const Comp = onClick ? "button" : "span"
  return (
    <Comp
      onClick={onClick}
      data-tone={tone}
      className={cn(
        "ui-status capitalize",
        onClick && "cursor-pointer transition-opacity duration-150 hover:opacity-75 active:scale-[0.97]",
        className,
      )}
    >
      {Icon && <Icon size={11} weight="fill" />}
      {children}
    </Comp>
  )
}

// ─── Status switch (for a per-row two-state field) ──────────────────────────
// The first version was a segmented control that spelled out both
// "Inactive" and "Active" on every single row — down a 35-row table that's
// 70 words of near-duplicate text, and nothing distinguishes which one is
// the *current* state at a glance. A switch is the control everyone already
// reads as "on/off, click to flip": one compact glyph, one label that
// names the current state, and the label's color is the only thing that
// needs to change as you scan down the column.

export function StatusSwitch({
  active,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: {
  active: boolean
  onChange: (next: boolean) => void
  activeLabel?: string
  inactiveLabel?: string
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <Switch
        checked={active}
        onCheckedChange={onChange}
        size="sm"
        className="data-checked:bg-(--cs-success-fg) data-unchecked:bg-(--cs-border-default)"
      />
      <span
        className="ui-micro font-semibold w-12"
        style={{ color: active ? "var(--cs-success-fg)" : "var(--cs-text-tertiary)" }}
      >
        {active ? activeLabel : inactiveLabel}
      </span>
    </label>
  )
}

// ─── Icon tile (used in headers / stat blocks that need a badge glyph) ────

export function IconTile({
  icon: Icon,
  tone = "accent",
  size = 36,
}: {
  icon: React.ElementType
  tone?: Tone
  size?: number
}) {
  const t = TONE_STYLE[tone]
  return (
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: size, height: size, backgroundColor: t.bg, color: t.fg }}
    >
      <Icon size={Math.round(size * 0.5)} weight="duotone" />
    </div>
  )
}
