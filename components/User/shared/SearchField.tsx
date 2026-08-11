"use client";

import { CircleNotchIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useId } from "react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Shown as a spinner in the trailing slot while a query is in flight. */
  busy?: boolean;
  /** Swap the leading glyph — the author filter uses a person, not a lens. */
  icon?: React.ReactNode;
  label: string;
  className?: string;
};

/**
 * One search input for the whole app.
 *
 * Recipes, Cookbooks and Chefs had each grown their own: three radii,
 * three border colours, three icon sizes, two different placeholder
 * greys, and one of them was 12px taller than the others. Nobody
 * notices that individually — they notice that the app feels loose.
 *
 * The clear button only exists when there is something to clear, and it
 * is a real `<button>` with a label rather than a bare icon, because
 * "clear the search" is exactly the kind of control that gets missed by
 * anyone not using a mouse.
 */
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  busy = false,
  icon,
  label,
  className = "",
}: SearchFieldProps) {
  const id = useId();

  return (
    <div className={`ui-field ${className}`}>
      <span aria-hidden className="shrink-0" style={{ color: "var(--cs-text-tertiary)" }}>
        {icon ?? <MagnifyingGlassIcon size={15} />}
      </span>

      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        /* Safari paints its own clear affordance on type=search, which
           would sit next to ours. */
        className="[&::-webkit-search-cancel-button]:appearance-none"
      />

      {/* The spinner replaces the clear button rather than joining it, so
          the field never changes width mid-keystroke. */}
      {busy ? (
        <CircleNotchIcon
          size={14}
          className="animate-spin shrink-0"
          style={{ color: "var(--cs-text-tertiary)" }}
          aria-hidden
        />
      ) : (
        value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="focus-ring shrink-0 rounded-full p-0.5 transition-colors"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <XIcon size={14} />
          </button>
        )
      )}
    </div>
  );
}

export default SearchField;
