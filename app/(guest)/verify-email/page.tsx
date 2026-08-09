"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthLink,
  AuthNotice,
  AuthResult,
  AuthSecondary,
} from "@/components/common/AuthBits";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  SealCheckIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, resendVerification, isResendingVerification } = useAuth();
  const reduce = useReducedMotion();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [resendInput, setResendInput] = useState("");
  const [resendSent, setResendSent] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the link.");
      return;
    }

    verifyEmail({ token })
      .then((data) => {
        setStatus("success");
        const redirectPath =
          data.role === "chef"
            ? "/chef/dashboard"
            : data.role === "admin"
              ? "/admin/dashboard"
              : "/recipes";
        setTimeout(() => router.push(redirectPath), 2500);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Verification failed. The link may have expired.",
        );
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    const target = resendInput.trim();
    if (!target) return;
    try {
      await resendVerification({ usernameOrEmail: target });
      setResendSent(true);
    } catch {
      // generic message — server always returns success to prevent enumeration
      setResendSent(true);
    }
  };

  const copy = {
    loading: {
      title: "Verifying your email",
      subtitle: "This only takes a second.",
    },
    success: {
      title: "You're all set",
      subtitle: "Your account is active and ready to cook from.",
    },
    error: {
      title: "We couldn't verify that",
      subtitle: "Verification links expire, and each one works only once.",
    },
  }[status];

  return (
    <AuthLayout
      icon={SealCheckIcon}
      title={copy.title}
      subtitle={copy.subtitle}
      imageSrc="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530581/register_eu7mjh.png"
      imageAlt="Chefalio Verify Email"
      footer={<AuthLink href="/login">Back to sign in</AuthLink>}
    >
      {status === "loading" && (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <motion.span
            className="h-10 w-10 rounded-full border-[3px]"
            style={{
              borderColor: "var(--cs-border-default)",
              borderTopColor: "var(--primary)",
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <p
            className="type-caption"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            Checking your verification link…
          </p>
        </div>
      )}

      {status === "success" && (
        <AuthResult
          icon={CheckCircleIcon}
          title="Email verified"
          actions={
            <Link href="/recipes" className="block">
              <AuthSecondary>Go to recipes now</AuthSecondary>
            </Link>
          }
        >
          Your account is now active. We&apos;re taking you there in a
          moment&nbsp;…
        </AuthResult>
      )}

      {status === "error" && (
        <AuthResult
          tone="error"
          icon={XCircleIcon}
          title="Verification failed"
          actions={
            resendSent ? (
              <AuthNotice tone="success">
                If that account exists and is unverified, a new link has been
                sent.
              </AuthNotice>
            ) : (
              <div className="space-y-3 text-left">
                <label
                  htmlFor="resend-target"
                  className="type-caption block"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  Enter your email or username and we&apos;ll send a fresh link.
                </label>
                <Input
                  id="resend-target"
                  type="text"
                  value={resendInput}
                  onChange={(e) => setResendInput(e.target.value)}
                  placeholder="Email or username"
                  autoComplete="off"
                />
                <AuthSecondary
                  onClick={handleResend}
                  disabled={isResendingVerification || !resendInput.trim()}
                >
                  <ArrowClockwiseIcon
                    size={15}
                    className={isResendingVerification ? "animate-spin" : ""}
                  />
                  {isResendingVerification
                    ? "Sending…"
                    : "Resend verification email"}
                </AuthSecondary>
              </div>
            )
          }
        >
          {errorMsg}
        </AuthResult>
      )}
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
