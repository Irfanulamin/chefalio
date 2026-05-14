"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useMyChefApplication,
  useSubmitChefApplication,
  useResubmitChefApplication,
} from "@/hooks/useChefApplication";
import type { KycType } from "@/types/chef-application.type";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  WarningCircleIcon,
  UploadSimpleIcon,
  ImageIcon,
  XIcon,
  ChefHatIcon,
  LinkIcon,
  YoutubeLogo,
  InstagramLogo,
  FacebookLogo,
  TwitterLogoIcon,
  IdentificationCardIcon,
  GlobeIcon,
  TrophyIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react/dist/ssr";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormValues {
  fullName: string;
  bio: string;
  specialty: string;
  yearsOfExperience: string;
  kycType: KycType | "";
  kycDocument: File | null;
  referenceUrl: string;
  youtubeUrl: string;
  achievements: string[];
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
}

const EMPTY_FORM: FormValues = {
  fullName: "",
  bio: "",
  specialty: "",
  yearsOfExperience: "",
  kycType: "",
  kycDocument: null,
  referenceUrl: "",
  youtubeUrl: "",
  achievements: [],
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",
};

const KYC_LABELS: Record<KycType, string> = {
  passport: "Passport",
  nid: "National ID (NID)",
  driving_license: "Driving License",
};

const STEPS = ["Personal Info", "Identity (KYC)", "Online Presence"] as const;

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all",
                  done
                    ? "bg-primary border-primary text-white"
                    : active
                      ? "border-primary text-primary bg-primary/10"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-400",
                )}
              >
                {done ? <CheckCircleIcon size={16} weight="fill" /> : step}
              </div>
              <span
                className={cn(
                  "mt-1 text-[10px] font-medium hidden sm:block whitespace-nowrap",
                  active ? "text-primary" : "text-zinc-400",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-4 mx-1 transition-all",
                  done ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── KYC dropzone ──────────────────────────────────────────────────────────────

function KycDropzone({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const preview = file ? URL.createObjectURL(file) : null;

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onChange(accepted[0]);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: (rejected) => {
      const err = rejected[0]?.errors[0];
      if (err?.code === "file-too-large") toast.error("File must be under 5MB");
      else toast.error("Only JPG/PNG images are accepted");
    },
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex h-52 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden",
          isDragActive
            ? "border-sky-400 bg-sky-50/60 dark:bg-sky-950/30"
            : file
              ? "border-zinc-300 dark:border-zinc-600"
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 hover:border-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60",
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <Image
              src={preview}
              alt="KYC document"
              fill
              className="object-contain p-2"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors group">
              <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Click to replace
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/80 dark:bg-zinc-800">
              <ImageIcon size={20} weight="duotone" className="text-zinc-500" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {isDragActive ? "Drop to upload" : "Upload document photo"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                JPG or PNG · Max 5 MB
              </p>
            </div>
          </>
        )}
      </div>
      {file && (
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          <CheckCircleIcon size={13} weight="fill" className="text-green-500" />
          {file.name}
        </p>
      )}
    </div>
  );
}

// ── Achievement tag input ─────────────────────────────────────────────────────

function AchievementInput({
  achievements,
  onChange,
}: {
  achievements: string[];
  onChange: (a: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || achievements.includes(trimmed)) {
      setInput("");
      return;
    }
    onChange([...achievements, trimmed]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. Michelin Star 2022"
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          maxLength={80}
        />
        <button
          type="button"
          onClick={add}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
        >
          <PlusIcon size={16} weight="bold" />
        </button>
      </div>
      {achievements.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {achievements.map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium"
            >
              {a}
              <button
                type="button"
                onClick={() => onChange(achievements.filter((x) => x !== a))}
                className="ml-0.5 hover:text-red-500 transition-colors"
              >
                <XIcon size={10} weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
          icon ? "pl-9 pr-3" : "px-3",
        )}
      />
    </div>
  );
}

// ── Status views ──────────────────────────────────────────────────────────────

function PendingView() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <ClockIcon size={32} weight="duotone" className="text-amber-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Application Under Review
        </h2>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm">
          Your chef application has been submitted and is being reviewed by our
          admin team. We&apos;ll notify you once a decision is made.
        </p>
      </div>
      <div className="mt-2 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-6 py-3 text-sm text-amber-700 dark:text-amber-400 font-medium">
        Status: Pending Review
      </div>
    </div>
  );
}

function ApprovedView() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircleIcon
          size={32}
          weight="fill"
          className="text-green-500"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Congratulations — You&apos;re a Chef!
        </h2>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm">
          Your application has been approved. Your account has been upgraded to
          Chef status. Please log out and log back in to access your chef
          dashboard.
        </p>
      </div>
    </div>
  );
}

function RejectedView({
  note,
  onResubmit,
}: {
  note?: string;
  onResubmit: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <XCircleIcon size={32} weight="fill" className="text-red-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Application Not Approved
        </h2>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm">
          Unfortunately your application was not approved this time. You can
          address the feedback below and resubmit.
        </p>
      </div>
      {note && (
        <div className="w-full max-w-md rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-left">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
            <WarningCircleIcon size={13} weight="fill" /> Admin Feedback
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{note}</p>
        </div>
      )}
      <button
        type="button"
        onClick={onResubmit}
        className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
      >
        <PaperPlaneTiltIcon size={16} weight="bold" />
        Resubmit Application
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ApplyChefPage() {
  const { application, isLoading } = useMyChefApplication();
  const submitMutation = useSubmitChefApplication();
  const resubmitMutation = useResubmitChefApplication();

  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const isResubmit = application?.status === "rejected";

  // ── Validation per step ───────────────────────────────────────────────────

  const validateStep1 = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (form.bio.trim().length < 30)
      return "Bio must be at least 30 characters";
    if (!form.specialty.trim()) return "Specialty is required";
    const exp = Number(form.yearsOfExperience);
    if (!form.yearsOfExperience || isNaN(exp) || exp < 0)
      return "Valid years of experience required";
    return null;
  };

  const validateStep2 = () => {
    if (!form.kycType) return "Please select a document type";
    if (!form.kycDocument && !isResubmit)
      return "Please upload your document";
    return null;
  };

  const validateStep3 = () => {
    if (!form.referenceUrl.trim()) return "Reference website URL is required";
    try {
      new URL(form.referenceUrl);
    } catch {
      return "Please enter a valid URL (include https://)";
    }
    if (form.youtubeUrl) {
      try {
        new URL(form.youtubeUrl);
      } catch {
        return "Please enter a valid YouTube URL";
      }
    }
    return null;
  };

  const next = () => {
    const err =
      step === 1
        ? validateStep1()
        : step === 2
          ? validateStep2()
          : validateStep3();
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep3();
    if (err) {
      toast.error(err);
      return;
    }
    if (!form.kycDocument && !isResubmit) {
      toast.error("KYC document is required");
      return;
    }

    const payload = {
      fullName: form.fullName,
      bio: form.bio,
      specialty: form.specialty,
      yearsOfExperience: Number(form.yearsOfExperience),
      kycType: form.kycType as KycType,
      kycDocument: form.kycDocument as File,
      referenceUrl: form.referenceUrl,
      youtubeUrl: form.youtubeUrl || undefined,
      achievements: form.achievements,
      instagramUrl: form.instagramUrl || undefined,
      facebookUrl: form.facebookUrl || undefined,
      twitterUrl: form.twitterUrl || undefined,
    };

    if (isResubmit) {
      await resubmitMutation.mutateAsync(payload);
    } else {
      await submitMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const isPending = submitMutation.isPending || resubmitMutation.isPending;

  // ── Pre-fill form from existing application on resubmit ───────────────────

  const startResubmit = () => {
    if (application) {
      setForm({
        fullName: application.fullName,
        bio: application.bio,
        specialty: application.specialty,
        yearsOfExperience: String(application.yearsOfExperience),
        kycType: application.kycType,
        kycDocument: null,
        referenceUrl: application.referenceUrl,
        youtubeUrl: application.youtubeUrl ?? "",
        achievements: application.achievements ?? [],
        instagramUrl: application.instagramUrl ?? "",
        facebookUrl: application.facebookUrl ?? "",
        twitterUrl: application.twitterUrl ?? "",
      });
    }
    setStep(1);
    setShowForm(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const showStatus =
    application && !showForm;

  return (
    <div className="mx-auto max-w-2xl py-10 px-4">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <ChefHatIcon size={22} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {isResubmit ? "Resubmit Chef Application" : "Become a Chef"}
          </h1>
          <p className="text-sm text-zinc-500">
            {showStatus
              ? "Track your application status"
              : "Complete the form to apply for chef status"}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        {/* Status views */}
        {showStatus && application.status === "pending" && <PendingView />}
        {showStatus && application.status === "approved" && <ApprovedView />}
        {showStatus && application.status === "rejected" && (
          <RejectedView
            note={application.rejectionNote}
            onResubmit={startResubmit}
          />
        )}

        {/* Form */}
        {(!application || showForm) && (
          <>
            <StepIndicator current={step} />

            {step === 1 && (
              <div className="space-y-5">
                <Field label="Full Name" required>
                  <TextInput
                    value={form.fullName}
                    onChange={(v) => set("fullName", v)}
                    placeholder="Your full name"
                  />
                </Field>

                <Field
                  label="Bio"
                  required
                  hint="Tell us about your culinary background (min. 30 characters)"
                >
                  <textarea
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="I've been cooking professionally for..."
                    rows={4}
                    maxLength={2000}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition"
                  />
                  <p className="text-xs text-zinc-400 text-right">
                    {form.bio.length}/2000
                  </p>
                </Field>

                <Field
                  label="Culinary Specialty"
                  required
                  hint="e.g. Italian cuisine, Pastry, Sushi, BBQ"
                >
                  <TextInput
                    value={form.specialty}
                    onChange={(v) => set("specialty", v)}
                    placeholder="Your main specialty"
                  />
                </Field>

                <Field label="Years of Experience" required>
                  <TextInput
                    type="number"
                    value={form.yearsOfExperience}
                    onChange={(v) => set("yearsOfExperience", v)}
                    placeholder="e.g. 5"
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-sm text-zinc-500">
                  <p className="font-medium text-foreground mb-1">
                    Why do we need this?
                  </p>
                  We verify every chef applicant to ensure quality and trust on
                  the platform. Upload a clear photo of your identity document.
                </div>

                <Field label="Document Type" required>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      ["passport", "nid", "driving_license"] as KycType[]
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set("kycType", type)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center text-xs font-medium transition-all",
                          form.kycType === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700",
                        )}
                      >
                        <IdentificationCardIcon
                          size={20}
                          weight={
                            form.kycType === type ? "fill" : "regular"
                          }
                        />
                        {KYC_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field
                  label="Document Photo"
                  required={!isResubmit}
                  hint={
                    isResubmit
                      ? "Leave empty to keep your previous document"
                      : "Upload a clear scan or photo of your document"
                  }
                >
                  <KycDropzone
                    file={form.kycDocument}
                    onChange={(f) => set("kycDocument", f)}
                  />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <Field
                  label="Reference Website"
                  required
                  hint="A professional site, portfolio, restaurant page, or any public profile"
                >
                  <TextInput
                    value={form.referenceUrl}
                    onChange={(v) => set("referenceUrl", v)}
                    placeholder="https://yourwebsite.com"
                    icon={<GlobeIcon size={15} />}
                  />
                </Field>

                <Field label="YouTube Channel" hint="Optional — show us your cooking videos">
                  <TextInput
                    value={form.youtubeUrl}
                    onChange={(v) => set("youtubeUrl", v)}
                    placeholder="https://youtube.com/@yourhandle"
                    icon={<YoutubeLogo size={15} />}
                  />
                </Field>

                <Field
                  label="Achievements"
                  hint="Awards, certifications, recognitions — press Enter to add"
                >
                  <AchievementInput
                    achievements={form.achievements}
                    onChange={(a) => set("achievements", a)}
                  />
                </Field>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Social Links{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      (optional)
                    </span>
                  </p>
                  <TextInput
                    value={form.instagramUrl}
                    onChange={(v) => set("instagramUrl", v)}
                    placeholder="https://instagram.com/yourhandle"
                    icon={<InstagramLogo size={15} />}
                  />
                  <TextInput
                    value={form.facebookUrl}
                    onChange={(v) => set("facebookUrl", v)}
                    placeholder="https://facebook.com/yourpage"
                    icon={<FacebookLogo size={15} />}
                  />
                  <TextInput
                    value={form.twitterUrl}
                    onChange={(v) => set("twitterUrl", v)}
                    placeholder="https://twitter.com/yourhandle"
                    icon={<TwitterLogoIcon size={15} />}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <ArrowLeftIcon size={14} weight="bold" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Continue <ArrowRightIcon size={14} weight="bold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <PaperPlaneTiltIcon size={15} weight="bold" />
                      {isResubmit
                        ? "Resubmit Application"
                        : "Submit Application"}
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Info card at bottom */}
      {!application && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 text-xs text-zinc-500">
          <LinkIcon size={14} className="mt-0.5 shrink-0 text-primary" />
          <p>
            All submitted information is reviewed by our admin team. We typically
            respond within 2–5 business days.
          </p>
        </div>
      )}
    </div>
  );
}
