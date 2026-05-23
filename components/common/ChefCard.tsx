"use client";

import Link from "next/link";
import Image from "next/image";
import { Chef } from "@/types/chef.type";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ChefCard({ chef }: { chef: Chef }) {
  const initials = getInitials(chef.fullName || "");

  return (
    <div
      className="group flex flex-col items-center text-center p-5 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* 80px circular avatar */}
      <div
        className="relative w-20 h-20 rounded-full overflow-hidden mb-3 shrink-0"
        style={{
          border: "2px solid var(--cs-border-default)",
        }}
      >
        {chef.profile_url ? (
          <Image
            src={chef.profile_url}
            alt={chef.fullName}
            fill
            sizes="80px"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: "var(--cs-accent)" }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className="text-sm font-semibold truncate max-w-full"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {chef.fullName}
      </h3>

      {/* Username */}
      <p
        className="text-xs mt-0.5 mb-2 truncate max-w-full"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        @{chef.username}
      </p>

      {/* Recipe count badge */}
      {chef.recipeCount != null && (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            color: "var(--cs-accent)",
          }}
        >
          {chef.recipeCount} {chef.recipeCount === 1 ? "recipe" : "recipes"}
        </span>
      )}

      {/* View Profile button */}
      <Link
        href={`/chefs/${chef._id}`}
        className="mt-auto w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-all duration-150"
        style={{
          backgroundColor: "var(--cs-surface-3)",
          color: "var(--cs-text-primary)",
          border: "1px solid var(--cs-border-default)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--cs-accent)";
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.borderColor = "var(--cs-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--cs-surface-3)";
          e.currentTarget.style.color = "var(--cs-text-primary)";
          e.currentTarget.style.borderColor = "var(--cs-border-default)";
        }}
      >
        View Profile
      </Link>
    </div>
  );
}
