import Link from "next/link";
import { XCircleIcon } from "@phosphor-icons/react/dist/ssr";

export default function PaymentCancelPage() {
  return (
    <div className="page-root flex items-center justify-center min-h-[70vh] p-8">
      <div className="text-center max-w-md w-full">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
          style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}
        >
          <XCircleIcon size={40} weight="fill" style={{ color: "#a16207" }} />
        </div>

        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#a16207" }}
        >
          Payment cancelled
        </p>
        <h1
          className="text-2xl font-bold mb-3 leading-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          No charge was made
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--cs-text-secondary)" }}>
          You cancelled the checkout — nothing was charged. Your cart is still saved if you&apos;d like to try again.
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
            { label: "Status", value: "Cancelled", accent: true },
            { label: "Charge", value: "None" },
            { label: "Cart", value: "Still saved" },
          ].map(({ label, value, accent }, i, arr) => (
            <div
              key={label}
              className="flex justify-between items-center py-1.5"
              style={i < arr.length - 1 ? { borderBottom: "1px solid var(--cs-border-subtle)" } : undefined}
            >
              <span className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>{label}</span>
              <span
                className="text-xs font-medium flex items-center gap-1.5"
                style={{ color: accent ? "#a16207" : "var(--cs-text-primary)" }}
              >
                {accent && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />}
                {value}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/cookbooks"
          className="block py-3 px-6 rounded-xl text-sm font-semibold text-center transition-colors duration-150"
          style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
        >
          Browse cookbooks
        </Link>
      </div>
    </div>
  );
}
