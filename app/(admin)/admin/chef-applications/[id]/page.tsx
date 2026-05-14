"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  useChefApplicationById,
  useApproveChefApplication,
  useRejectChefApplication,
} from "@/hooks/useChefApplication";
import { cn } from "@/lib/utils";
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
  ChefHatIcon,
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ElementType; banner: string }
> = {
  pending: {
    label: "Pending Review",
    icon: ClockIcon,
    banner: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircleIcon,
    banner: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircleIcon,
    banner: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="text-xs font-medium text-zinc-500 sm:w-40 shrink-0">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function ExternalLink({ href }: { href?: string }) {
  if (!href) return <span className="text-zinc-400">—</span>;
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
          className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
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
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 resize-none transition mt-1"
        />
        <p className="text-xs text-zinc-400 text-right">{note.length}/1000</p>
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
        <WarningCircleIcon size={40} className="text-zinc-400" />
        <p className="text-sm text-zinc-500">Application not found</p>
        <Link href="/admin/chef-applications" className="text-xs text-primary hover:underline">
          ← Back to applications
        </Link>
      </div>
    );
  }

  const user = typeof application.userId === "object" ? application.userId : null;
  const reviewer = typeof application.reviewedBy === "object" ? application.reviewedBy : null;
  const cfg = STATUS_CONFIG[application.status];
  const StatusIcon = cfg.icon;

  const handleApprove = () => {
    approveMutation.mutate(application._id, {
      onSuccess: () => router.push("/admin/chef-applications"),
    });
  };

  const handleReject = (note: string) => {
    rejectMutation.mutate(
      { id: application._id, rejectionNote: note },
      { onSuccess: () => router.push("/admin/chef-applications") },
    );
  };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Back + actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/chef-applications"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-foreground transition-colors"
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
              className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
            >
              <CheckCircleIcon size={16} weight="fill" />
              {approveMutation.isPending ? "Approving…" : "Approve"}
            </button>
          </div>
        )}
      </div>

      {/* Status banner */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium",
          cfg.banner,
        )}
      >
        <StatusIcon size={16} weight="fill" />
        {cfg.label}
        {application.reviewedAt && (
          <span className="ml-auto text-xs font-normal opacity-70">
            Reviewed {new Date(application.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {reviewer && ` by ${reviewer.fullName}`}
          </span>
        )}
      </div>

      {/* Rejection note */}
      {application.rejectionNote && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
            <WarningCircleIcon size={13} weight="fill" /> Rejection Note
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            {application.rejectionNote}
          </p>
        </div>
      )}

      {/* Applicant info */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 p-4">
          {user?.profile_url ? (
            <Image
              src={user.profile_url}
              alt={user.fullName}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <UserCircleIcon size={24} className="text-zinc-400" />
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">
              {user?.fullName ?? application.fullName}
            </p>
            <p className="text-xs text-zinc-500">{user?.email ?? "—"}</p>
            {user?.username && (
              <p className="text-xs text-zinc-400">@{user.username}</p>
            )}
          </div>
          <div className="ml-auto text-xs text-zinc-500 text-right">
            <CalendarIcon size={12} className="inline mr-1" />
            Submitted {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        <div className="px-4">
          <InfoRow label="Full Name">{application.fullName}</InfoRow>
          <InfoRow label="Specialty">{application.specialty}</InfoRow>
          <InfoRow label="Years of Exp.">{application.yearsOfExperience} years</InfoRow>
          <InfoRow label="Bio">
            <p className="whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-400">
              {application.bio}
            </p>
          </InfoRow>
        </div>
      </div>

      {/* KYC document */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <IdentificationCardIcon size={16} weight="duotone" className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">KYC Document</h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">Type:</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
              {application.kycType.replace("_", " ")}
            </span>
          </div>
          <div className="relative max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <Image
              src={application.kycDocumentUrl}
              alt="KYC document"
              width={600}
              height={400}
              className="w-full object-contain bg-zinc-50 dark:bg-zinc-900"
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
      </div>

      {/* Online presence */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <GlobeIcon size={16} weight="duotone" className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Online Presence</h2>
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
      </div>

      {/* Achievements */}
      {application.achievements?.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
            <TrophyIcon size={16} weight="duotone" className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Achievements</h2>
          </div>
          <div className="flex flex-wrap gap-2 p-4">
            {application.achievements.map((a) => (
              <span
                key={a}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom action bar for pending */}
      {application.status === "pending" && (
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm px-5 py-3 shadow-lg">
          <p className="text-sm text-zinc-500 mr-auto">
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
            className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            <CheckCircleIcon size={16} weight="fill" />
            {approveMutation.isPending ? "Approving…" : "Approve as Chef"}
          </button>
        </div>
      )}
    </div>
  );
}
