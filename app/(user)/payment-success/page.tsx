import Link from "next/link";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

export default function PaymentSuccessPage() {
  return (
    <div className="page-root flex items-center justify-center min-h-[70vh] p-8">
      <div className="text-center max-w-md w-full">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
        >
          <CheckCircleIcon size={40} weight="fill" style={{ color: "#22c55e" }} />
        </div>

        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#22c55e" }}
        >
          Payment confirmed
        </p>
        <h1
          className="text-2xl font-bold mb-3 leading-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Your cookbook is ready
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--cs-text-secondary)" }}>
          Thanks for your purchase. A receipt has been sent to your email — enjoy your new cookbook!
        </p>

        {/* Summary card */}
        <div
          className="rounded-xl p-4 mb-7 text-left space-y-2"
          style={{
            backgroundColor: "var(--cs-surface-2)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          {[
            { label: "Status", value: "Paid", accent: true },
            { label: "Receipt", value: "Sent to your email" },
            { label: "Access", value: "Available now" },
          ].map(({ label, value, accent }, i, arr) => (
            <div
              key={label}
              className="flex justify-between items-center py-1.5"
              style={i < arr.length - 1 ? { borderBottom: "1px solid var(--cs-border-subtle)" } : undefined}
            >
              <span className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>{label}</span>
              <span
                className="text-xs font-medium flex items-center gap-1.5"
                style={{ color: accent ? "#22c55e" : "var(--cs-text-primary)" }}
              >
                {accent && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/cookbooks"
            className="block py-3 px-6 rounded-xl text-sm font-semibold text-center transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Browse cookbooks
          </Link>
          <Link
            href="/activity?tab=orders"
            className="block py-2.5 px-6 rounded-xl text-sm text-center transition-colors duration-150"
            style={{
              border: "1px solid var(--cs-border-default)",
              color: "var(--cs-text-secondary)",
            }}
          >
            Go to my activity
          </Link>
        </div>
      </div>
    </div>
  );
}
