"use client";

import AuthLayout from "@/components/common/AuthLayout";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { OAuthButtons } from "@/components/common/OAuthButtons";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";
import { EnvelopeSimpleIcon, ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";

function CheckEmailState({
  email,
  onResend,
  isResending,
}: {
  email: string;
  onResend: () => void;
  isResending: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
        <EnvelopeSimpleIcon size={32} weight="duotone" className="text-primary" />
      </span>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
          We sent a verification link to{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Click the link to activate your account.
        </p>
      </div>

      <div className="w-full space-y-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-lg gap-2"
          onClick={onResend}
          disabled={isResending}
        >
          <ArrowClockwiseIcon size={16} className={isResending ? "animate-spin" : ""} />
          {isResending ? "Sending..." : "Resend verification email"}
        </Button>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Already verified?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Check your spam folder if you don&apos;t see the email within a few minutes.
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const { register, resendVerification, isResendingVerification } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const registerSchema = z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(50, "Full name must be at most 50 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm({
    defaultValues: { fullName: "", username: "", email: "", password: "" },
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const data = await register(value);
        setRegisteredEmail(data.email);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create account. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleResend = async () => {
    if (!registeredEmail) return;
    try {
      await resendVerification({ usernameOrEmail: registeredEmail });
      toast.success("Verification email sent!", { position: "bottom-right" });
    } catch {
      toast.error("Failed to resend. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <AuthLayout
      imageSrc="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530581/register_eu7mjh.png"
      imageAlt="Chefalio Register"
    >
      {registeredEmail ? (
        <CheckEmailState
          email={registeredEmail}
          onResend={handleResend}
          isResending={isResendingVerification}
        />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--cs-text-primary)" }}>Create Account</h1>
            <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
              Please enter your details to create an account.
            </p>
          </div>
          <div className="h-px mb-6" style={{ backgroundColor: "var(--cs-border-subtle)" }} />
          <form
            className={`space-y-4 transition-opacity duration-200 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {[
                { name: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
                { name: "username", label: "Username", placeholder: "Enter your username", type: "text" },
                { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
                { name: "password", label: "Password", placeholder: "Enter your password", type: "password" },
              ].map((fieldDef) => (
                <FormField key={fieldDef.name} form={form} {...fieldDef} />
              ))}
            </FieldGroup>
            <Button
              type="submit"
              className="w-full rounded-lg py-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: "1px solid var(--cs-border-default)" }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2" style={{ backgroundColor: "var(--cs-surface-1)", color: "var(--cs-text-tertiary)" }}>
                or sign up with
              </span>
            </div>
          </div>

          <OAuthButtons />

          <p className="text-sm text-center" style={{ color: "var(--cs-text-secondary)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "var(--cs-accent)" }}
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
