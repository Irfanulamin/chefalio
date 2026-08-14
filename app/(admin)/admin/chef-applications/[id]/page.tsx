"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/motion";
import {
  useChefApplicationById,
  useApproveChefApplication,
  useRejectChefApplication,
} from "@/hooks/useChefApplication";
import { toast } from "sonner";
import type { ApplicationStatus } from "@/types/chef-application.type";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  IdentificationCardIcon,
  GlobeIcon,
  YoutubeLogo,
  InstagramLogo,
  FacebookLogo,
  TwitterLogoIcon,
  TrophyIcon,
  UserCircleIcon,
  WarningCircleIcon,
  CalendarIcon,
} from "@phosphor-icons/react/dist/ssr";
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
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, Panel, StatusPill, type StatusTone } from "@/components/Admin/AdminUI";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; tone: StatusTone }
> = {
  pending: { label: "Pending Review", icon: ClockIcon, tone: "warning" },
  approved: { label: "Approved", icon: CheckCircleIcon, tone: "success" },
  rejected: { label: "Rejected", icon: XCircleIcon, tone: "danger" },
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 last:border-0"
      style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
    >
      <span className="text-xs font-medium sm:w-40 shrink-0" style={{ color: "var(--cs-text-secondary)" }}>{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function ExternalLink({ href }: { href?: string }) {
  if (!href) return <span style={{ color: "var(--cs-text-tertiary)" }}>—</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline break-all"
    >
      {href}
    </a>
  );
}

// ── Rejection dialog ──────────────────────────────────────────────────────────

function RejectDialog({
  onReject,
  isPending,
}: {
  onReject: (note: string) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="focus-ring flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-[background-color,transform] duration-150 active:scale-[0.97]"
          style={{
            border: "1px solid var(--cs-danger-edge)",
            backgroundColor: "var(--cs-danger-bg)",
            color: "var(--cs-danger-fg)",
          }}
        >
          <XCircleIcon size={16} weight="fill" />
          Reject
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Application</AlertDialogTitle>
          <AlertDialogDescription>
            Provide feedback so the applicant knows what to improve before
            resubmitting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain why the application is being rejected…"
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-red-400/40 resize-none transition mt-1"
          style={{
            border: "1px solid var(--cs-border-default)",
            backgroundColor: "var(--cs-surface-1)",
          }}
        />
        <p className="text-xs text-right" style={{ color: "var(--cs-text-tertiary)" }}>{note.length}/1000</p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!note.trim() || isPending}
            onClick={() => onReject(note.trim())}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Rejecting…" : "Confirm Rejection"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminChefApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const { application, isLoading } = useChefApplicationById(id);
  const approveMutation = useApproveChefApplication();
  const rejectMutation = useRejectChefApplication();

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <WarningCircleIcon size={40} style={{ color: "var(--cs-text-tertiary)" }} />
        <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>Application not found</p>
        <Link href="/admin/chef-applications" className="text-xs text-primary hover:underline">
          ← Back to applications
        </Link>
      </div>
    );
  }

  const user = typeof application.userId === "object" ? application.userId : null;
  const reviewer = typeof application.reviewedBy === "object" ? application.reviewedBy : null;
  const cfg = STATUS_CONFIG[application.status];

  const handleApprove = () => {
    approveMutation.mutate(application._id, {
      onSuccess: () => router.push("/admin/chef-applications"),
      onError: () => toast.error("Failed to approve application"),
    });
  };

  const handleReject = (note: string) => {
    rejectMutation.mutate(
      { id: application._id, rejectionNote: note },
      {
        onSuccess: () => router.push("/admin/chef-applications"),
        onError: () => toast.error("Failed to reject application"),
      },
    );
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back + actions */}
      <Reveal className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/chef-applications"
          className="focus-ring flex items-center gap-1.5 text-sm transition-colors hover:text-foreground"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          <ArrowLeftIcon size={14} weight="bold" /> Back to Applications
        </Link>

        {application.status === "pending" && (
          <div className="flex items-center gap-2">
            <RejectDialog
              onReject={handleReject}
              isPending={rejectMutation.isPending}
            />
            <button
              type="button"
              disabled={approveMutation.isPending}
              onClick={handleApprove}
              className="focus-ring flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 active:scale-[0.97] disabled:opacity-60"
            >
              <CheckCircleIcon size={16} weight="fill" />
              {approveMutation.isPending ? "Approving…" : "Approve"}
            </button>
          </div>
        )}
      </Reveal>

      {/* Status banner */}
      <Reveal delay={0.03}>
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium"
          style={{
            border: `1px solid var(--cs-${cfg.tone}-edge)`,
            backgroundColor: `var(--cs-${cfg.tone}-bg)`,
            color: `var(--cs-${cfg.tone}-fg)`,
          }}
        >
          <cfg.icon size={16} weight="fill" />
          {cfg.label}
          {application.reviewedAt && (
            <span className="ml-auto text-xs font-normal opacity-70">
              Reviewed {new Date(application.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {reviewer && ` by ${reviewer.fullName}`}
            </span>
          )}
        </div>
      </Reveal>

      {/* Rejection note */}
      {application.rejectionNote && (
        <Reveal delay={0.05}>
          <div
            className="rounded-2xl p-4"
            style={{ border: "1px solid var(--cs-danger-edge)", backgroundColor: "var(--cs-danger-bg)" }}
          >
            <p className="text-xs font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--cs-danger-fg)" }}>
              <WarningCircleIcon size={13} weight="fill" /> Rejection Note
            </p>
            <p className="text-sm" style={{ color: "var(--cs-danger-fg)" }}>
              {application.rejectionNote}
            </p>
          </div>
        </Reveal>
      )}

      {/* Applicant info */}
      <Reveal delay={0.07}>
        <Panel padded={false}>
          <div className="flex items-center gap-4 p-4" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            {user?.profile_url ? (
              <Image
                src={user.profile_url}
                alt={user.fullName}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                <UserCircleIcon size={24} style={{ color: "var(--cs-text-tertiary)" }} />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">
                {user?.fullName ?? application.fullName}
              </p>
              <p className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>{user?.email ?? "—"}</p>
              {user?.username && (
                <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>@{user.username}</p>
              )}
            </div>
            <div className="ml-auto text-xs text-right" style={{ color: "var(--cs-text-secondary)" }}>
              <CalendarIcon size={12} className="inline mr-1" />
              Submitted {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <div className="px-4">
            <InfoRow label="Full Name">{application.fullName}</InfoRow>
            <InfoRow label="Specialty">{application.specialty}</InfoRow>
            <InfoRow label="Years of Exp.">{application.yearsOfExperience} years</InfoRow>
            <InfoRow label="Bio">
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--cs-text-secondary)" }}>
                {application.bio}
              </p>
            </InfoRow>
          </div>
        </Panel>
      </Reveal>

      {/* KYC document */}
      <Reveal delay={0.09}>
        <Panel padded={false}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            <IdentificationCardIcon size={16} weight="duotone" className="text-primary" />
            <h2 className="ui-subheading text-foreground">KYC Document</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>Type:</span>
              <StatusPill tone="info">{application.kycType.replace("_", " ")}</StatusPill>
            </div>
            <div className="relative max-w-sm rounded-xl overflow-hidden" style={{ border: "1px solid var(--cs-border-subtle)" }}>
              <Image
                src={application.kycDocumentUrl}
                alt="KYC document"
                width={600}
                height={400}
                className="w-full object-contain"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              />
            </div>
            <a
              href={application.kycDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              Open in new tab
            </a>
          </div>
        </Panel>
      </Reveal>

      {/* Online presence */}
      <Reveal delay={0.11}>
        <Panel padded={false}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            <GlobeIcon size={16} weight="duotone" className="text-primary" />
            <h2 className="ui-subheading text-foreground">Online Presence</h2>
          </div>
          <div className="px-4">
            <InfoRow label={<span className="flex items-center gap-1"><GlobeIcon size={12} />Website</span> as unknown as string}>
              <ExternalLink href={application.referenceUrl} />
            </InfoRow>
            <InfoRow label={<span className="flex items-center gap-1"><YoutubeLogo size={12} />YouTube</span> as unknown as string}>
              <ExternalLink href={application.youtubeUrl} />
            </InfoRow>
            <InfoRow label={<span className="flex items-center gap-1"><InstagramLogo size={12} />Instagram</span> as unknown as string}>
              <ExternalLink href={application.instagramUrl} />
            </InfoRow>
            <InfoRow label={<span className="flex items-center gap-1"><FacebookLogo size={12} />Facebook</span> as unknown as string}>
              <ExternalLink href={application.facebookUrl} />
            </InfoRow>
            <InfoRow label={<span className="flex items-center gap-1"><TwitterLogoIcon size={12} />Twitter</span> as unknown as string}>
              <ExternalLink href={application.twitterUrl} />
            </InfoRow>
          </div>
        </Panel>
      </Reveal>

      {/* Achievements */}
      {application.achievements?.length > 0 && (
        <Reveal delay={0.13}>
          <Panel padded={false}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
              <TrophyIcon size={16} weight="duotone" className="text-primary" />
              <h2 className="ui-subheading text-foreground">Achievements</h2>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              {application.achievements.map((a) => (
                <span
                  key={a}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent-text)" }}
                >
                  {a}
                </span>
              ))}
            </div>
          </Panel>
        </Reveal>
      )}

      {/* Bottom action bar for pending — a materialized floating layer,
          not an opaque strip, so the page keeps scrolling visibly beneath
          it. */}
      {application.status === "pending" && (
        <motion.div
          className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl px-5 py-3"
          style={{
            border: "1px solid var(--cs-material-edge)",
            backgroundColor: "var(--cs-material-thick)",
            backdropFilter: "blur(var(--cs-material-blur))",
            WebkitBackdropFilter: "blur(var(--cs-material-blur))",
            boxShadow: "var(--cs-shadow-float)",
          }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING.soft}
        >
          <p className="text-sm mr-auto" style={{ color: "var(--cs-text-secondary)" }}>
            Make a decision on this application
          </p>
          <RejectDialog
            onReject={handleReject}
            isPending={rejectMutation.isPending}
          />
          <button
            type="button"
            disabled={approveMutation.isPending}
            onClick={handleApprove}
            className="focus-ring flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 active:scale-[0.97] disabled:opacity-60"
          >
            <CheckCircleIcon size={16} weight="fill" />
            {approveMutation.isPending ? "Approving…" : "Approve as Chef"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
