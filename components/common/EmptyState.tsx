import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
        style={{ backgroundColor: "var(--cs-accent-muted)" }}
      >
        <span style={{ color: "var(--cs-accent)" }}>{icon}</span>
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        {description}
      </p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
