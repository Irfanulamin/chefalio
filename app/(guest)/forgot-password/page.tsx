"use client";

import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { EnvelopeSimpleIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [onSuccess, setOnSuccess] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.email("Invalid email format"),
  });

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword(value);
        toast.success(
          "If an account exists, a password reset link has been sent to your email.",
          { position: "bottom-right" },
        );
        setOnSuccess(true);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--cs-surface-1)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-sm"
        style={{
          backgroundColor: "var(--cs-surface-1)",
          border: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="block text-xl font-extrabold tracking-tight mb-8"
          style={{ color: "var(--cs-accent)" }}
        >
          Chefalio
        </Link>

        {onSuccess ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--cs-accent-muted)" }}
            >
              <CheckCircleIcon size={28} style={{ color: "var(--cs-accent)" }} weight="fill" />
            </div>
            <div>
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "var(--cs-text-primary)" }}
              >
                Check your email
              </h2>
              <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                If an account exists for that email, a password reset link has been sent. Check your spam folder if you don&apos;t see it.
              </p>
            </div>
            <Link
              href="/login"
              className="text-sm font-medium mt-2"
              style={{ color: "var(--cs-accent)" }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--cs-accent-muted)" }}
            >
              <EnvelopeSimpleIcon size={22} weight="duotone" style={{ color: "var(--cs-accent)" }} />
            </div>

            <h1
              className="text-xl font-semibold tracking-tight mb-1"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Forgot your password?
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--cs-text-secondary)" }}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <div className="h-px mb-6" style={{ backgroundColor: "var(--cs-border-subtle)" }} />

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <FormField
                  form={form}
                  name="email"
                  label="Email address"
                  placeholder="you@example.com"
                  type="email"
                />
              </FieldGroup>

              <Button
                type="submit"
                className="w-full py-5 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Sending…" : "Send Reset Link"}
              </Button>

              <p className="text-center text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                Remembered it?{" "}
                <Link
                  href="/login"
                  className="font-medium hover:underline"
                  style={{ color: "var(--cs-accent)" }}
                >
                  Back to sign in
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
