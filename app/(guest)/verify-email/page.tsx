"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/common/AuthLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, resendVerification, isResendingVerification } = useAuth();

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

  return (
    <AuthLayout
      imageSrc="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530581/register_eu7mjh.png"
      imageAlt="Chefalio Verify Email"
    >
      <div className="flex flex-col items-center text-center gap-5 py-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: "var(--cs-accent)" }} />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold" style={{ color: "var(--cs-text-primary)" }}>Verifying your email…</h2>
              <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                Please wait a moment.
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "var(--cs-accent-muted)", border: "1px solid var(--cs-accent)" }}
            >
              <CheckCircleIcon
                size={36}
                weight="fill"
                style={{ color: "var(--cs-accent)" }}
              />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                Email verified!
              </h2>
              <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                Your account is now active. Redirecting you in a moment…
              </p>
            </div>
            <Link href="/recipes">
              <Button variant="outline" className="rounded-lg">
                Go now
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
              <XCircleIcon size={36} weight="fill" className="text-red-500" />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                Verification failed
              </h2>
              <p className="text-sm max-w-xs" style={{ color: "var(--cs-text-secondary)" }}>
                {errorMsg}
              </p>
            </div>

            {!resendSent ? (
              <div className="w-full space-y-3 pt-1">
                <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                  Request a new link by entering your email or username:
                </p>
                <input
                  type="text"
                  value={resendInput}
                  onChange={(e) => setResendInput(e.target.value)}
                  placeholder="Email or username"
                  className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  style={{
                    border: "1px solid var(--cs-border-default)",
                    backgroundColor: "var(--cs-surface-2)",
                    color: "var(--cs-text-primary)",
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-lg gap-2"
                  onClick={handleResend}
                  disabled={isResendingVerification || !resendInput.trim()}
                >
                  <ArrowClockwiseIcon
                    size={15}
                    className={isResendingVerification ? "animate-spin" : ""}
                  />
                  {isResendingVerification ? "Sending…" : "Resend verification email"}
                </Button>
              </div>
            ) : (
              <div
                className="rounded-lg px-4 py-3 text-sm w-full"
                style={{ backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent)", border: "1px solid var(--cs-accent)" }}
              >
                If that account exists and is unverified, a new link has been sent.
              </div>
            )}

            <Link
              href="/login"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--cs-accent)" }}
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
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
