import Link from "next/link";
import { ShieldSlashIcon } from "@phosphor-icons/react/dist/ssr";

export default function UnauthorizedPage() {
  return (
    <div className="page-root flex items-center justify-center min-h-screen p-6">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: "#fee2e2", border: "1px solid #fecaca" }}
        >
          <ShieldSlashIcon size={40} weight="fill" style={{ color: "#b91c1c" }} />
        </div>

        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#b91c1c" }}
        >
          Error 401 · Unauthorized
        </p>

        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Access Restricted
        </h1>

        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--cs-text-secondary)" }}>
          You don&apos;t have permission to view this page. This area is restricted to authorized users only.
        </p>

        {/* Info panel */}
        <div
          className="w-full rounded-xl p-4 mb-8 text-left"
          style={{
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#b91c1c" }}>
            If you believe this is a mistake, please contact your workspace admin or sign in with the correct account.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/login"
            className="block w-full text-center py-3 px-6 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Sign in to continue
          </Link>
          <Link
            href="/"
            className="block w-full text-center py-2.5 px-6 rounded-xl text-sm transition-colors duration-150"
            style={{
              border: "1px solid var(--cs-border-default)",
              color: "var(--cs-text-secondary)",
            }}
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
