import type { Cookbook } from "@/types/cookbook.type";
import { SafeImage } from "@/components/common/SafeImage";
import { StatusPill } from "@/components/User/shared/StatusPill";
import { cookbookPrice, initialsOf } from "@/lib/recipe-display";

export const SummaryCard = ({ cookbook }: { cookbook: Cookbook }) => {
  const isLowStock = cookbook.stockCount <= 5;
  const price = cookbookPrice(cookbook.price, cookbook.discount ?? 0);
  const authorInitials = initialsOf(cookbook.authorId.fullName);

  return (
    <div className="ui-card overflow-hidden">
      <div
        className="relative w-full"
        style={{ aspectRatio: "3/4", backgroundColor: "var(--cs-surface-3)" }}
      >
        <SafeImage
          src={cookbook.cookbook_image}
          alt={`Cover of ${cookbook.title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover"
          fallback={
            <span
              className="flex h-full w-full items-center justify-center text-5xl font-bold opacity-20"
              style={{ color: "var(--cs-accent-text)" }}
            >
              {cookbook.title.charAt(0)}
            </span>
          }
        />

        <span
          className="material-thick ui-numeric absolute bottom-2.5 right-2.5 z-10 rounded-lg px-2.5 py-1 text-sm font-bold"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {price.current}
        </span>

        {isLowStock && (
          <StatusPill tone="warning" overMedia className="absolute left-2.5 top-2.5 z-10">
            Only {cookbook.stockCount} left
          </StatusPill>
        )}
      </div>

      <div className="p-4">
        <span className="ui-label" style={{ color: "var(--cs-text-tertiary)" }}>
          Cookbook
        </span>

        <h2
          className="ui-heading mb-2 mt-2 line-clamp-2"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {cookbook.title}
        </h2>

        <p
          className="ui-body mb-3 line-clamp-2"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          {cookbook.description}
        </p>

        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
            <SafeImage
              src={cookbook.authorId.profile_url}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-cover"
              fallback={
                <span
                  className="flex h-6 w-6 items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  {authorInitials}
                </span>
              }
            />
          </div>
          <span
            className="ui-caption truncate"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {cookbook.authorId.fullName} · @{cookbook.authorId.username}
          </span>
        </div>

        <dl
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          <dt className="ui-body" style={{ color: "var(--cs-text-secondary)" }}>
            Price
          </dt>
          <dd className="flex items-center gap-2">
            {price.original && (
              <>
                <span
                  className="ui-micro ui-numeric line-through"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {price.original}
                </span>
                <StatusPill tone="success">−{price.discountPct}%</StatusPill>
              </>
            )}
            <span
              className="ui-numeric text-lg font-semibold"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {price.current}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  );
};
