import Link from "next/link";
import Image from "next/image";
import { Cookbook } from "@/types/cookbook.type";

function formatPrice(price: number, discount: number): string {
  if (price === 0) return "Free";
  if (discount > 0) {
    const discounted = price - (price * discount) / 100;
    return `$${discounted.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}

export function CookbookCard({ cookbook }: { cookbook: Cookbook }) {
  const priceLabel = formatPrice(cookbook.price, cookbook.discount);
  const isFree = cookbook.price === 0;
  const initials = (cookbook.authorId.fullName || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/cookbooks/${cookbook._id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* 3:4 Portrait Cover */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "3/4",
          backgroundColor: "var(--cs-surface-3)",
        }}
      >
        {cookbook.cookbook_image ? (
          <Image
            src={cookbook.cookbook_image}
            alt={cookbook.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--cs-accent-muted), var(--cs-surface-3))",
            }}
          >
            <span
              className="text-5xl font-bold opacity-20"
              style={{ color: "var(--cs-accent)" }}
            >
              {cookbook.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Price badge — bottom right */}
        <span
          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-xs font-semibold"
          style={
            isFree
              ? {
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                }
              : {
                  backgroundColor: "rgba(0,0,0,0.75)",
                  color: "#ffffff",
                }
          }
        >
          {priceLabel}
        </span>

        {/* Hover "Preview" overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <span className="px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/60">
            Preview
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3
          className="text-sm font-semibold line-clamp-2 leading-snug"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {cookbook.title}
        </h3>

        <div className="flex items-center gap-1.5">
          {cookbook.authorId.profile_url ? (
            <Image
              src={cookbook.authorId.profile_url}
              alt={cookbook.authorId.fullName}
              width={16}
              height={16}
              className="rounded-full w-4 h-4 object-cover shrink-0"
            />
          ) : (
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
              style={{ backgroundColor: "var(--cs-accent)" }}
            >
              {initials.charAt(0)}
            </div>
          )}
          <span
            className="text-xs truncate"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {cookbook.authorId.fullName}
          </span>
        </div>
      </div>
    </Link>
  );
}
