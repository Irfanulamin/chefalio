"use client";

import { useState, useCallback, useEffect, useId, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import {
  useMyChefApplication,
  useSubmitChefApplication,
  useResubmitChefApplication,
} from "@/hooks/useChefApplication";
import type { KycType } from "@/types/chef-application.type";
import {
  CheckIcon,
  ClockIcon,
  XCircleIcon,
  WarningCircleIcon,
  ImageIcon,
  XIcon,
  YoutubeLogo,
  InstagramLogo,
  FacebookLogo,
  TwitterLogoIcon,
  IdentificationCardIcon,
  GlobeIcon,
  PlusIcon,
  PaperPlaneTiltIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useProfile } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { StatusPill } from "@/components/User/shared/StatusPill";

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
  nid: "National ID",
  driving_license: "Driving licence",
};

/* ── KYC dropzone ─────────────────────────────────────────────────── */

function KycDropzone({
  file,
  onChange,
  describedBy,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  describedBy?: string;
}) {
  /* `URL.createObjectURL` used to run inline in the render body, so every
     re-render minted a fresh blob URL and none of them were ever revoked
     — the page leaked a copy of the document for each keystroke that
     re-rendered it.

     Derived with `useMemo` rather than stored in state: the url is a
     pure function of the file, so the only thing an effect is needed for
     is releasing the previous one. */
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

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
      if (err?.code === "file-too-large") toast.error("File must be under 5 MB");
      else toast.error("Only JPG or PNG images are accepted");
    },
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        aria-describedby={describedBy}
        className="focus-ring relative flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl transition-colors duration-150"
        style={{
          border: `2px dashed ${
            isDragActive
              ? "var(--primary)"
              : file
                ? "var(--cs-border-default)"
                : "var(--cs-border-default)"
          }`,
          backgroundColor: isDragActive
            ? "var(--cs-accent-muted)"
            : file
              ? "var(--cs-surface-1)"
              : "var(--cs-surface-3)",
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <>
            <Image src={preview} alt="Your uploaded document" fill className="object-contain p-2" unoptimized />
            <div className="group absolute inset-0 flex items-center justify-center transition-colors hover:bg-black/50">
              <span className="text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                Click to replace
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              aria-label="Remove uploaded document"
              className="material-thick focus-ring absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full"
              style={{ color: "var(--cs-text-primary)" }}
            >
              <XIcon size={12} weight="bold" />
            </button>
          </>
        ) : (
          <>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                color: "var(--cs-text-tertiary)",
              }}
            >
              <ImageIcon size={20} weight="duotone" />
            </div>
            <div className="px-4 text-center">
              <p className="ui-subheading" style={{ color: "var(--cs-text-primary)" }}>
                {isDragActive ? "Drop to upload" : "Upload document photo"}
              </p>
              <p className="ui-micro mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                JPG or PNG · max 5 MB
              </p>
            </div>
          </>
        )}
      </div>

      {file && (
        <p
          className="ui-micro flex items-center gap-1.5"
          style={{ color: "var(--cs-success-fg)" }}
        >
          <CheckIcon size={13} weight="bold" />
          {file.name}
        </p>
      )}
    </div>
  );
}

/* ── Achievements ─────────────────────────────────────────────────── */

function AchievementInput({
  achievements,
  onChange,
  id,
  describedBy,
}: {
  achievements: string[];
  onChange: (a: string[]) => void;
  id: string;
  describedBy?: string;
}) {
  const [input, setInput] = useState("");

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
          id={id}
          aria-describedby={describedBy}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. Michelin star, 2022"
          className="focus-ring flex-1 rounded-xl px-3 py-2 text-sm outline-none"
          style={{
            border: "1px solid var(--cs-border-default)",
            backgroundColor: "var(--cs-surface-1)",
            color: "var(--cs-text-primary)",
          }}
          maxLength={80}
        />
        <button
          type="button"
          onClick={add}
          aria-label="Add achievement"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            color: "var(--cs-accent-text)",
          }}
        >
          <PlusIcon size={16} weight="bold" />
        </button>
      </div>

      {achievements.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {achievements.map((a) => (
            <li key={a} className="ui-chip" data-active="true">
              {a}
              <button
                type="button"
                onClick={() => onChange(achievements.filter((x) => x !== a))}
                aria-label={`Remove ${a}`}
                className="focus-ring ml-0.5 rounded-full"
              >
                <XIcon size={11} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Field primitives ─────────────────────────────────────────────────
   `<label>` was previously a bare element with no `htmlFor`, so none of
   the fifteen inputs on this form were actually labelled — clicking a
   label did nothing and a screen reader announced an unnamed textbox.
   These wire up id / htmlFor / aria-describedby properly. */

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode;
  hint?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="ui-subheading block"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--cs-danger-fg)" }} aria-hidden>
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {children({ id, describedBy: hint ? hintId : undefined })}

      {hint && (
        <p id={hintId} className="ui-micro" style={{ color: "var(--cs-text-tertiary)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  id,
  describedBy,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  id: string;
  describedBy?: string;
}) {
  return (
    <div className="relative">
      {icon && (
        <span
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          {icon}
        </span>
      )}
      <input
        id={id}
        aria-describedby={describedBy}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`focus-ring w-full rounded-xl py-2 text-sm outline-none ${
          icon ? "pl-9 pr-3" : "px-3"
        }`}
        style={{
          border: "1px solid var(--cs-border-default)",
          backgroundColor: "var(--cs-surface-1)",
          color: "var(--cs-text-primary)",
        }}
      />
    </div>
  );
}

/* ── Status views ─────────────────────────────────────────────────── */

function StatusView({
  tone,
  icon,
  title,
  children,
  footer,
}: {
  tone: "warning" | "success" | "danger";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          backgroundColor: `var(--cs-${tone}-bg)`,
          color: `var(--cs-${tone}-fg)`,
        }}
      >
        {icon}
      </div>
      <div>
        <h2 className="ui-title" style={{ color: "var(--cs-text-primary)" }}>
          {title}
        </h2>
        <div
          className="ui-body mx-auto mt-1.5 max-w-sm"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          {children}
        </div>
      </div>
      {footer}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function ApplyChefPage() {
  const { profile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile?.role === "chef") router.replace("/recipes");
  }, [profile, router]);

  const { application, isLoading } = useMyChefApplication();
  const submitMutation = useSubmitChefApplication();
  const resubmitMutation = useResubmitChefApplication();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const isResubmit = application?.status === "rejected";

  /* One form, one pass of validation — checked in the order the fields
     appear on the page, so the toast always names the first thing that
     actually needs fixing as you scroll down from the top. */
  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (form.bio.trim().length < 30) return "Bio must be at least 30 characters";
    if (!form.specialty.trim()) return "Specialty is required";
    const exp = Number(form.yearsOfExperience);
    if (!form.yearsOfExperience || isNaN(exp) || exp < 0)
      return "Enter a valid number of years";
    if (!form.kycType) return "Choose a document type";
    if (!form.kycDocument && !isResubmit) return "Upload your document";
    if (!form.referenceUrl.trim()) return "A reference website is required";
    try {
      new URL(form.referenceUrl);
    } catch {
      return "Enter a valid URL, including https://";
    }
    if (form.youtubeUrl) {
      try {
        new URL(form.youtubeUrl);
      } catch {
        return "Enter a valid YouTube URL";
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
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

    if (isResubmit) await resubmitMutation.mutateAsync(payload);
    else await submitMutation.mutateAsync(payload);

    setShowForm(false);
  };

  const isPending = submitMutation.isPending || resubmitMutation.isPending;

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
    setShowForm(true);
  };

  const showStatus = Boolean(application) && !showForm;

  const lede = useMemo(() => {
    if (showStatus) return "Where your application has got to.";
    if (isResubmit) return "Update what the reviewer flagged, then send it back.";
    return "Tell us about your cooking, verify your identity, and share where people can find your work. We review every application by hand, usually within 2–5 business days.";
  }, [showStatus, isResubmit]);

  if (isLoading) {
    return (
      <div className="app-root">
        <div className="max-w-3xl px-4 py-10 sm:px-6">
          <div
            className="flex min-h-[50vh] items-center justify-center"
            aria-busy="true"
          >
            <CircleNotchIcon
              size={24}
              className="animate-spin"
              style={{ color: "var(--cs-text-tertiary)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <title>Chefalio — Become a Chef</title>

      <div className="max-w-3xl px-4 py-10 sm:px-6">
        <PageHeader
          title={isResubmit && showForm ? "Resubmit your application" : "Become a chef"}
          lede={lede}
          actions={
            application ? (
              <StatusPill
                tone={
                  application.status === "approved"
                    ? "success"
                    : application.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
                {application.status === "approved"
                  ? "Approved"
                  : application.status === "rejected"
                    ? "Not approved"
                    : "In review"}
              </StatusPill>
            ) : undefined
          }
        />

        <div>
          {showStatus && application!.status === "pending" && (
            <StatusView
              tone="warning"
              icon={<ClockIcon size={30} weight="duotone" />}
              title="We're reviewing your application"
            >
              A human reads every application. You&rsquo;ll get a notification the
              moment there&rsquo;s a decision — there&rsquo;s nothing else you need
              to do.
            </StatusView>
          )}

          {showStatus && application!.status === "approved" && (
            <StatusView
              tone="success"
              icon={<CheckIcon size={30} weight="bold" />}
              title="You're a chef"
            >
              Your account has been upgraded. Log out and back in once, and the
              chef dashboard will be waiting.
            </StatusView>
          )}

          {showStatus && application!.status === "rejected" && (
            <StatusView
              tone="danger"
              icon={<XCircleIcon size={30} weight="fill" />}
              title="Not approved this time"
              footer={
                <button
                  type="button"
                  onClick={startResubmit}
                  className="focus-ring mt-2 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <PaperPlaneTiltIcon size={16} weight="bold" />
                  Edit and resubmit
                </button>
              }
            >
              <span className="block">
                Your details are kept, so resubmitting means changing what&rsquo;s
                below — not starting again.
              </span>
              {application!.rejectionNote && (
                <span
                  className="mt-4 block rounded-2xl p-4 text-left"
                  style={{
                    backgroundColor: "var(--cs-danger-bg)",
                    border: "1px solid var(--cs-danger-edge)",
                  }}
                >
                  <span
                    className="ui-label mb-1 flex items-center gap-1.5"
                    style={{ color: "var(--cs-danger-fg)" }}
                  >
                    <WarningCircleIcon size={13} weight="fill" /> Reviewer note
                  </span>
                  <span className="ui-body block" style={{ color: "var(--cs-text-primary)" }}>
                    {application!.rejectionNote}
                  </span>
                </span>
              )}
            </StatusView>
          )}

          {(!application || showForm) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-9"
            >
              <div className="space-y-5">
                <h2 className="ui-subheading" style={{ color: "var(--cs-text-primary)" }}>
                  About you
                </h2>
                <div className="space-y-5">
                  <Field label="Full name" required>
                    {(ids) => (
                      <TextInput
                        {...ids}
                        value={form.fullName}
                        onChange={(v) => set("fullName", v)}
                        placeholder="As it appears on your ID"
                      />
                    )}
                  </Field>

                  <Field
                    label="Bio"
                    required
                    hint="At least 30 characters. Where you've cooked, and what you cook."
                  >
                    {(ids) => (
                      <>
                        <textarea
                          id={ids.id}
                          aria-describedby={ids.describedBy}
                          value={form.bio}
                          onChange={(e) => set("bio", e.target.value)}
                          placeholder="I've been cooking professionally for…"
                          rows={4}
                          maxLength={2000}
                          className="focus-ring w-full resize-none rounded-xl px-3 py-2 text-sm outline-none"
                          style={{
                            border: "1px solid var(--cs-border-default)",
                            backgroundColor: "var(--cs-surface-1)",
                            color: "var(--cs-text-primary)",
                          }}
                        />
                        <p
                          className="ui-micro ui-numeric text-right"
                          style={{
                            color:
                              form.bio.length > 1900
                                ? "var(--cs-warning-fg)"
                                : "var(--cs-text-tertiary)",
                          }}
                        >
                          {form.bio.length}/2000
                        </p>
                      </>
                    )}
                  </Field>

                  <Field
                    label="Culinary specialty"
                    required
                    hint="e.g. Italian, pastry, sushi, barbecue"
                  >
                    {(ids) => (
                      <TextInput
                        {...ids}
                        value={form.specialty}
                        onChange={(v) => set("specialty", v)}
                        placeholder="What you're known for"
                      />
                    )}
                  </Field>

                  <Field label="Years of experience" required>
                    {(ids) => (
                      <TextInput
                        {...ids}
                        type="number"
                        value={form.yearsOfExperience}
                        onChange={(v) => set("yearsOfExperience", v)}
                        placeholder="5"
                      />
                    )}
                  </Field>
                </div>
              </div>

              <div
                className="space-y-5 pt-8"
                style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
              >
                <h2 className="ui-subheading" style={{ color: "var(--cs-text-primary)" }}>
                  Identity verification
                </h2>
                <div className="space-y-5">
                  <div
                    className="ui-body rounded-xl p-4"
                    style={{
                      border: "1px solid var(--cs-border-subtle)",
                      backgroundColor: "var(--cs-surface-3)",
                      color: "var(--cs-text-secondary)",
                    }}
                  >
                    <p
                      className="ui-subheading mb-1"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      Why we ask for this
                    </p>
                    Buyers are paying real money for cookbooks, so we verify every
                    chef is who they say they are. Your document is used for that
                    check only, and is never shown on your profile.
                  </div>

                  <fieldset className="space-y-1.5">
                    <legend
                      className="ui-subheading mb-1.5"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      Document type
                      <span style={{ color: "var(--cs-danger-fg)" }} aria-hidden>
                        {" "}
                        *
                      </span>
                    </legend>
                    <div className="grid max-w-sm grid-cols-3 gap-2">
                      {(["passport", "nid", "driving_license"] as KycType[]).map(
                        (type) => {
                          const selected = form.kycType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => set("kycType", type)}
                              aria-pressed={selected}
                              className="focus-ring flex aspect-square flex-col items-center justify-center gap-2 rounded-xl p-3 text-center text-xs font-medium transition-colors duration-150"
                              style={{
                                border: `1px solid ${
                                  selected
                                    ? "color-mix(in oklab, var(--primary) 55%, transparent)"
                                    : "var(--cs-border-subtle)"
                                }`,
                                backgroundColor: selected
                                  ? "var(--cs-accent-muted)"
                                  : "var(--cs-surface-1)",
                                color: selected
                                  ? "var(--cs-accent-text)"
                                  : "var(--cs-text-secondary)",
                              }}
                            >
                              <IdentificationCardIcon
                                size={24}
                                weight={selected ? "fill" : "regular"}
                              />
                              {KYC_LABELS[type]}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </fieldset>

                  <Field
                    label="Document photo"
                    required={!isResubmit}
                    hint={
                      isResubmit
                        ? "Leave this empty to keep the document you already sent."
                        : "A clear photo or scan. All four corners visible."
                    }
                  >
                    {(ids) => (
                      <KycDropzone
                        file={form.kycDocument}
                        onChange={(f) => set("kycDocument", f)}
                        describedBy={ids.describedBy}
                      />
                    )}
                  </Field>
                </div>
              </div>

              <div
                className="space-y-5 pt-8"
                style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
              >
                <h2 className="ui-subheading" style={{ color: "var(--cs-text-primary)" }}>
                  Online presence
                </h2>
                <div className="space-y-5">
                  <Field
                    label="Reference website"
                    required
                    hint="A restaurant page, portfolio, or any public profile that shows your work."
                  >
                    {(ids) => (
                      <TextInput
                        {...ids}
                        value={form.referenceUrl}
                        onChange={(v) => set("referenceUrl", v)}
                        placeholder="https://yourwebsite.com"
                        icon={<GlobeIcon size={15} />}
                      />
                    )}
                  </Field>

                  <Field label="YouTube channel" hint="Optional.">
                    {(ids) => (
                      <TextInput
                        {...ids}
                        value={form.youtubeUrl}
                        onChange={(v) => set("youtubeUrl", v)}
                        placeholder="https://youtube.com/@yourhandle"
                        icon={<YoutubeLogo size={15} />}
                      />
                    )}
                  </Field>

                  <Field
                    label="Achievements"
                    hint="Awards, certifications, press. Press Enter after each one."
                  >
                    {(ids) => (
                      <AchievementInput
                        id={ids.id}
                        describedBy={ids.describedBy}
                        achievements={form.achievements}
                        onChange={(a) => set("achievements", a)}
                      />
                    )}
                  </Field>

                  <fieldset className="space-y-3">
                    <legend
                      className="ui-subheading"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      Social links{" "}
                      <span
                        className="ui-micro font-normal"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        (optional)
                      </span>
                    </legend>
                    <Field label="Instagram">
                      {(ids) => (
                        <TextInput
                          {...ids}
                          value={form.instagramUrl}
                          onChange={(v) => set("instagramUrl", v)}
                          placeholder="https://instagram.com/yourhandle"
                          icon={<InstagramLogo size={15} />}
                        />
                      )}
                    </Field>
                    <Field label="Facebook">
                      {(ids) => (
                        <TextInput
                          {...ids}
                          value={form.facebookUrl}
                          onChange={(v) => set("facebookUrl", v)}
                          placeholder="https://facebook.com/yourpage"
                          icon={<FacebookLogo size={15} />}
                        />
                      )}
                    </Field>
                    <Field label="X / Twitter">
                      {(ids) => (
                        <TextInput
                          {...ids}
                          value={form.twitterUrl}
                          onChange={(v) => set("twitterUrl", v)}
                          placeholder="https://x.com/yourhandle"
                          icon={<TwitterLogoIcon size={15} />}
                        />
                      )}
                    </Field>
                  </fieldset>
                </div>
              </div>

              <div
                className="flex items-center justify-end pt-6"
                style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
              >
                <button
                  type="submit"
                  disabled={isPending}
                  className="focus-ring flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {isPending ? (
                    <>
                      <CircleNotchIcon size={15} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <PaperPlaneTiltIcon size={15} weight="bold" />
                      {isResubmit ? "Resubmit" : "Submit application"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
