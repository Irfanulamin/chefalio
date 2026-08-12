/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Input } from "../ui/input";
import {
  EyeIcon,
  EyeSlashIcon,
  UploadSimpleIcon,
  XIcon,
  ImageIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

// ── Toast ─────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

const ErrorToast = ({ message, onDismiss }: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        backgroundColor: "var(--cs-danger-bg)",
        border: "1px solid var(--cs-danger-edge)",
        boxShadow: "var(--cs-shadow-card)",
      }}
    >
      <WarningCircleIcon
        size={18}
        weight="fill"
        className="mt-0.5 shrink-0"
        style={{ color: "var(--cs-danger-fg)" }}
      />
      <p className="ui-caption flex-1" style={{ color: "var(--cs-text-primary)" }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="focus-ring shrink-0 rounded-md transition-colors"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        <XIcon size={14} weight="bold" />
      </button>
    </div>
  );
};

// ── Image Dropzone ────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB — matches backend limit

// Matches backend: ParseFilePipeBuilder fileType '.(jpg|jpeg|png)'
const ACCEPTED_MIME = ["image/png", "image/jpeg"];

interface ImageDropzoneFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  onBlur: () => void;
  multiple?: boolean;
  isInvalid?: boolean;
  fieldName: string;
  maxSize?: number;
}

const ImageDropzoneField = ({
  files: rawFiles,
  onChange,
  onBlur,
  multiple = false,
  isInvalid = false,
  fieldName,
  maxSize = MAX_FILE_SIZE,
}: ImageDropzoneFieldProps) => {
  const files = useMemo(
    () => (Array.isArray(rawFiles) ? rawFiles : []),
    [rawFiles],
  );
  const [toast, setToast] = useState<string | null>(null);
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  );

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        const tooBig = rejected.filter((r) =>
          r.errors.some((e) => e.code === "file-too-large"),
        );
        const wrongType = rejected.filter((r) =>
          r.errors.some((e) => e.code === "file-invalid-type"),
        );

        if (tooBig.length > 0) {
          const limitMB = Math.round(maxSize / (1024 * 1024));
          const names = tooBig.map((r) => r.file.name).join(", ");
          setToast(
            `${names} ${tooBig.length === 1 ? "exceeds" : "exceed"} the ${limitMB} MB limit.`,
          );
        } else if (wrongType.length > 0) {
          setToast(
            `Invalid file type: ${wrongType.map((r) => r.file.name).join(", ")}`,
          );
        }
        return;
      }

      const invalid = accepted.filter((f) => !ACCEPTED_MIME.includes(f.type));
      if (invalid.length > 0) {
        setToast(`Invalid file type: ${invalid.map((f) => f.name).join(", ")}`);
        return;
      }

      onChange(multiple ? [...files, ...accepted] : [accepted[0]]);
    },
    [files, maxSize, multiple, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      multiple,
      maxSize,
      onFileDialogCancel: onBlur,
    });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const hasSinglePreview = !multiple && files.length === 1;

  return (
    <div className="space-y-3 max-w-96">
      {toast && <ErrorToast message={toast} onDismiss={() => setToast(null)} />}

      <div
        {...getRootProps({
          id: fieldName,
          onBlur,
          "aria-invalid": isInvalid,
        })}
        className="focus-ring relative flex h-96 w-full cursor-pointer select-none flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl transition-colors duration-150"
        style={{
          border: `2px dashed ${
            isDragReject || isInvalid
              ? "var(--cs-danger-fg)"
              : isDragActive
                ? "var(--primary)"
                : "var(--cs-border-default)"
          }`,
          backgroundColor:
            isDragReject || isInvalid
              ? "var(--cs-danger-bg)"
              : isDragActive
                ? "var(--cs-accent-muted)"
                : hasSinglePreview
                  ? "var(--cs-surface-1)"
                  : "var(--cs-surface-3)",
        }}
      >
        <input {...getInputProps()} />

        {hasSinglePreview ? (
          <>
            <Image
              src={previews[0]}
              alt={files[0].name}
              width={200}
              height={200}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/0 hover:bg-black/50 transition-colors duration-200 group">
              <UploadSimpleIcon
                size={22}
                weight="bold"
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Replace image
              </span>
            </div>
            <button
              type="button"
              aria-label="Remove image"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(0);
              }}
              className="material-thick focus-ring absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full"
              style={{ color: "var(--cs-text-primary)" }}
            >
              <XIcon size={12} weight="bold" />
            </button>
          </>
        ) : (
          <>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150"
              style={{
                backgroundColor:
                  isDragReject || isInvalid
                    ? "var(--cs-danger-bg)"
                    : isDragActive
                      ? "var(--cs-accent-muted)"
                      : "var(--cs-surface-2)",
                color:
                  isDragReject || isInvalid
                    ? "var(--cs-danger-fg)"
                    : isDragActive
                      ? "var(--cs-accent-text)"
                      : "var(--cs-text-tertiary)",
              }}
            >
              {isDragReject || isInvalid ? (
                <WarningCircleIcon size={20} weight="fill" />
              ) : (
                <ImageIcon size={20} weight="duotone" />
              )}
            </div>

            <div className="px-4 text-center">
              <p
                className="ui-subheading"
                style={{
                  color:
                    isDragReject || isInvalid
                      ? "var(--cs-danger-fg)"
                      : isDragActive
                        ? "var(--cs-accent-text)"
                        : "var(--cs-text-primary)",
                }}
              >
                {isDragReject
                  ? "Images only, please"
                  : isDragActive
                    ? "Drop to upload"
                    : files.length > 0
                      ? "Add more images"
                      : "Drop your image here"}
              </p>
              <p className="ui-micro mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                or{" "}
                <span
                  className="underline decoration-dotted underline-offset-2"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  browse
                </span>
                {` · JPG or PNG · Max ${Math.round(maxSize / (1024 * 1024))} MB each`}
              </p>
            </div>
          </>
        )}
      </div>

      {multiple && files.length > 0 && (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl"
              style={{
                border: "1px solid var(--cs-border-subtle)",
                backgroundColor: "var(--cs-surface-3)",
              }}
            >
              <Image
                src={previews[index]}
                alt={file.name}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
                className="material-thick focus-ring absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 focus:opacity-100 group-hover:opacity-100"
                style={{ color: "var(--cs-text-primary)" }}
              >
                <XIcon size={10} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── FormField ─────────────────────────────────────────────────────────────────

interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  rows?: number;
  maxLength?: number;
  multiple?: boolean;
  maxSize?: number;
}

export const FormField = ({
  form,
  name,
  label,
  placeholder,
  description,
  type = "text",
  rows,
  maxLength,
  multiple = false,
  maxSize,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form.Field name={name}>
      {(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        const isTextArea = type === "textarea";
        const isPassword = type === "password";
        const isDropzone = type === "dropzone";
        const files: File[] = Array.isArray(field.state.value)
          ? field.state.value
          : [];

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            {isDropzone ? (
              <ImageDropzoneField
                files={files}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                multiple={multiple}
                isInvalid={isInvalid}
                fieldName={field.name}
                maxSize={maxSize}
              />
            ) : isTextArea ? (
              <InputGroup>
                <InputGroupTextarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={placeholder}
                  rows={rows || 4}
                  className="min-h-24 resize-none"
                  aria-invalid={isInvalid}
                />
                {maxLength && (
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.state.value.length}/{maxLength} characters
                    </InputGroupText>
                  </InputGroupAddon>
                )}
              </InputGroup>
            ) : isPassword ? (
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={placeholder}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 transition-colors duration-150 focus:outline-none rounded-r"
                  style={{ color: "var(--cs-text-tertiary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-tertiary)")
                  }
                >
                  {showPassword ? (
                    <EyeSlashIcon size={32} weight="fill" className="w-4 h-4" />
                  ) : (
                    <EyeIcon size={32} weight="fill" className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  if (type === "number") {
                    const parsed = parseFloat(e.target.value);
                    field.handleChange(isNaN(parsed) ? 0 : parsed);
                  } else {
                    field.handleChange(e.target.value);
                  }
                }}
                placeholder={placeholder}
                aria-invalid={isInvalid}
                autoComplete="off"
              />
            )}

            {description && <FieldDescription>{description}</FieldDescription>}

            <div>
              {isInvalid && (
                <p
                  className="ui-caption flex items-center gap-1.5"
                  style={{ color: "var(--cs-danger-fg)" }}
                >
                  <WarningCircleIcon size={13} weight="fill" aria-hidden />
                  {field.state.meta.errors
                    .map((e: any) =>
                      typeof e === "string" ? e : (e?.message ?? String(e)),
                    )
                    .join(", ")}
                </p>
              )}
            </div>
          </Field>
        );
      }}
    </form.Field>
  );
};
