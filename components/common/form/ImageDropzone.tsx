"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ImageIcon,
  XIcon,
  WarningCircleIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "@/lib/motion";
import { FieldCounter } from "./FormKit";

/**
 * The studio's image picker.
 *
 * The old one was a 24rem-tall dashed box capped at `max-w-96`, which meant
 * a huge empty target that couldn't grow to fill the panel it sat in. Its
 * drag and link states were sky blue — a third accent the product doesn't
 * own — and everything else about it was raw `zinc-*`. Selected files
 * appeared in a separate grid *below* the target, so the thing you'd just
 * added was not where you'd just dropped it.
 *
 * This version inverts that: the tiles are the control. Slots are laid out
 * up front, so a recipe that needs three images shows three slots, filled
 * and empty alike, and you can see at a glance what's left to do. The drop
 * target is whatever space remains, and pressing any empty slot opens the
 * picker.
 *
 * Interaction detail worth naming: the whole surface scales very slightly
 * on drag-over and the empty slots brighten. Apple's rule is that
 * intermediate motion should *hint* at the outcome — the surface leaning
 * towards the cursor is the interface saying "yes, here" before the drop
 * happens, not after.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // matches the backend limit
const ACCEPTED_MIME = ["image/png", "image/jpeg"];

export interface ExistingImage {
  url: string;
  markedForRemoval: boolean;
}

export function ImageDropzone({
  files,
  onChange,
  /** How many images the record must end up with. Drives the slot count. */
  slots = 1,
  existing,
  onToggleExisting,
  maxSize = MAX_FILE_SIZE,
  invalid,
  label,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  slots?: number;
  /** Already-uploaded images, shown as filled slots that can be swapped. */
  existing?: ExistingImage[];
  onToggleExisting?: (url: string) => void;
  maxSize?: number;
  invalid?: boolean;
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const kept = existing?.filter((e) => !e.markedForRemoval) ?? [];
  const filled = kept.length + files.length;
  const remaining = Math.max(0, slots - filled);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const tooBig = rejected.filter((r) =>
          r.errors.some((e) => e.code === "file-too-large"),
        );
        const limitMB = Math.round(maxSize / (1024 * 1024));
        setError(
          tooBig.length > 0
            ? `${tooBig.map((r) => r.file.name).join(", ")} ${tooBig.length === 1 ? "is" : "are"} over ${limitMB} MB.`
            : `${rejected.map((r) => r.file.name).join(", ")} — JPG or PNG only.`,
        );
        return;
      }

      const invalidType = accepted.filter((f) => !ACCEPTED_MIME.includes(f.type));
      if (invalidType.length > 0) {
        setError(`${invalidType.map((f) => f.name).join(", ")} — JPG or PNG only.`);
        return;
      }

      setError(null);
      // Never accept more than the record has room for — silently dropping
      // the overflow is better than a rejected submit later, and the slot
      // count already told the user what the limit is.
      onChange(slots === 1 ? accepted.slice(0, 1) : [...files, ...accepted].slice(0, slots));
    },
    [files, maxSize, onChange, slots],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    multiple: slots > 1,
    maxSize,
    noClick: true, // slots handle their own clicks
    noKeyboard: true,
  });

  const isError = isDragReject || invalid || !!error;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium" style={{ color: "var(--cs-text-primary)" }}>
          {label ?? (slots === 1 ? "Cover image" : `${slots} images`)}
        </p>
        <FieldCounter
          current={filled}
          total={slots}
          complete={filled === slots}
          invalid={!!invalid && filled !== slots}
        />
      </div>

      {/* Plain element, not a `motion.div`: react-dropzone's root props
          include native `onDrag*` handlers, whose types collide with
          Framer's pan-gesture `onDrag`. The lean is a compositor-only CSS
          transform, which is all it needs to be. */}
      <div
        {...getRootProps()}
        className="rounded-2xl p-2"
        style={{
          border: `1.5px dashed ${
            isError
              ? "var(--cs-danger-edge)"
              : isDragActive
                ? "var(--cs-accent)"
                : "var(--cs-border-default)"
          }`,
          backgroundColor: isDragActive ? "var(--cs-accent-muted)" : "transparent",
          transform: isDragActive && !reduceMotion ? "scale(1.006)" : "scale(1)",
          transition:
            "transform 180ms cubic-bezier(0.32,0.72,0,1), border-color 150ms ease, background-color 150ms ease",
        }}
      >
        <input {...getInputProps()} />

        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(slots, 3)}, minmax(0, 1fr))`,
          }}
        >
          {/* Images already on the record. Pressing one marks it for
              replacement rather than deleting it outright — the slot stays,
              dimmed, so the count still reads correctly and the action is
              reversible. */}
          {existing?.map((img) => (
            <Slot key={img.url}>
              <Image
                src={img.url}
                alt=""
                fill
                sizes="200px"
                className="object-cover transition-[opacity,filter] duration-200"
                style={
                  img.markedForRemoval
                    ? { opacity: 0.3, filter: "grayscale(1)" }
                    : undefined
                }
              />
              <SlotAction
                onClick={() => onToggleExisting?.(img.url)}
                label={img.markedForRemoval ? "Keep this image" : "Replace this image"}
                tone={img.markedForRemoval ? "neutral" : "danger"}
              >
                {img.markedForRemoval ? (
                  <ArrowClockwiseIcon size={11} weight="bold" />
                ) : (
                  <XIcon size={11} weight="bold" />
                )}
              </SlotAction>
            </Slot>
          ))}

          {/* Newly picked files. */}
          <AnimatePresence initial={false} mode="popLayout">
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${file.lastModified}`}
                layout
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={reduceMotion ? { duration: 0.15 } : SPRING.default}
              >
                <Slot>
                  <Image
                    src={previews[i]}
                    alt={file.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <SlotAction
                    onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                    label={`Remove ${file.name}`}
                    tone="danger"
                  >
                    <XIcon size={11} weight="bold" />
                  </SlotAction>
                </Slot>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty slots — each one is its own button, so the target is
              where the image will actually land. */}
          {Array.from({ length: remaining }).map((_, i) => (
            <button
              key={`empty-${i}`}
              type="button"
              onClick={open}
              className="group relative aspect-[4/3] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-[background-color,border-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.98]"
              style={{
                border: `1px solid ${isDragActive ? "var(--cs-accent)" : "var(--cs-border-subtle)"}`,
                backgroundColor: "var(--cs-surface-1)",
              }}
            >
              {isError && i === 0 ? (
                <WarningCircleIcon
                  size={17}
                  weight="fill"
                  style={{ color: "var(--cs-danger-fg)" }}
                />
              ) : (
                <ImageIcon
                  size={17}
                  weight="duotone"
                  style={{
                    color: isDragActive ? "var(--cs-accent-text)" : "var(--cs-text-tertiary)",
                  }}
                />
              )}
              <span
                className="text-[11px] font-medium"
                style={{
                  color: isDragActive ? "var(--cs-accent-text)" : "var(--cs-text-tertiary)",
                }}
              >
                {isDragActive ? "Drop here" : "Add image"}
              </span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-center mt-2" style={{ color: "var(--cs-text-tertiary)" }}>
          Drag images in, or press a slot · JPG or PNG · up to{" "}
          {Math.round(maxSize / (1024 * 1024))} MB each
        </p>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={SPRING.snappy}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
              style={{
                backgroundColor: "var(--cs-danger-bg)",
                border: "1px solid var(--cs-danger-edge)",
                color: "var(--cs-danger-fg)",
              }}
            >
              <WarningCircleIcon size={14} weight="fill" className="mt-px shrink-0" />
              <p className="flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Dismiss"
                className="shrink-0 transition-opacity hover:opacity-60"
              >
                <XIcon size={11} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative aspect-[4/3] rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-3)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * The control that sits on a filled slot.
 *
 * It is always visible rather than hover-only. A hover-revealed delete is
 * invisible on touch, and "the affordance appears once you're already
 * pointing at it" is a discoverability problem dressed up as restraint.
 */
function SlotAction({
  onClick,
  label,
  tone,
  children,
}: {
  onClick: () => void;
  label: string;
  tone: "danger" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white transition-transform duration-150 active:scale-90"
      style={{
        backgroundColor: tone === "danger" ? "rgba(17,17,16,0.62)" : "rgba(17,17,16,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {children}
    </button>
  );
}
