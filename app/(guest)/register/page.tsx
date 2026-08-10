"use client";

import { AUTH_PANELS } from "@/components/Home/imagery";
import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthDivider,
  AuthLink,
  AuthResult,
  AuthSecondary,
  AuthSubmit,
} from "@/components/common/AuthBits";
import { FormField } from "@/components/common/FormField";
import { FieldGroup } from "@/components/ui/field";
import { OAuthButtons } from "@/components/common/OAuthButtons";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  ArrowClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";

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

  // Post-submit is a different screen, so it gets a different heading rather
  // than the form's heading sitting over an empty card.
  if (registeredEmail) {
    return (
      <AuthLayout
        panel={AUTH_PANELS.register}
        title="One more step"
        subtitle="Your account exists — it just needs verifying before you can sign in."
        footer={
          <>
            Already verified? <AuthLink href="/login">Sign in</AuthLink>
          </>
        }
      >
        <AuthResult
          title="Check your email"
          actions={
            <>
              <AuthSecondary
                onClick={handleResend}
                disabled={isResendingVerification}
              >
                <ArrowClockwiseIcon
                  size={15}
                  className={isResendingVerification ? "animate-spin" : ""}
                />
                {isResendingVerification
                  ? "Sending…"
                  : "Resend verification email"}
              </AuthSecondary>
              <p
                className="type-micro"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                Nothing after a few minutes? Check your spam folder.
              </p>
            </>
          }
        >
          We sent a verification link to{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {registeredEmail}
          </span>
          . Click it to activate your account.
        </AuthResult>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      panel={AUTH_PANELS.register}
      wide
      title="Create your account"
      subtitle="Free to browse, free to save. You only pay for cookbooks you want to keep."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <div className="space-y-5">
        <form
          className={`space-y-5 transition-opacity duration-200 ${
            isSubmitting ? "pointer-events-none opacity-60" : ""
          }`}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {[
              {
                name: "fullName",
                label: "Full Name",
                placeholder: "Enter your full name",
                type: "text",
              },
              {
                name: "username",
                label: "Username",
                placeholder: "Enter your username",
                type: "text",
              },
              {
                name: "email",
                label: "Email",
                placeholder: "Enter your email",
                type: "email",
              },
              {
                name: "password",
                label: "Password",
                placeholder: "At least 6 characters",
                type: "password",
              },
            ].map((fieldDef) => (
              <FormField key={fieldDef.name} form={form} {...fieldDef} />
            ))}
          </FieldGroup>

          <AuthSubmit pending={isSubmitting} pendingLabel="Creating account…">
            Create account
          </AuthSubmit>
        </form>

        <div>
          <AuthDivider label="or sign up with" />
          <OAuthButtons />
        </div>
      </div>
    </AuthLayout>
  );
}
