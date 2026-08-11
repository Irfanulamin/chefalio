"use client";

import { FilterChip } from "@/components/User/shared/FilterChip";
import { SearchField } from "@/components/User/shared/SearchField";
import { TagIcon } from "@phosphor-icons/react";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";
import { XIcon } from "lucide-react";
import { useState } from "react";
import type { Difficulty } from "@/lib/recipe-display";

type RecipeFiltersProps = {
  DIFFICULTIES: readonly Difficulty[];
  POPULAR_TAGS: string[];

  difficulty: Difficulty | "";
  selectedTags: string[];
  author: string;
  search: string;

  toggleTag: (tag: string) => void;
  toggleDifficulty: (d: Difficulty) => void;

  setAuthor: (value: string) => void;

  clearAllFilters: () => void;
  handleSearchChange: (value: string) => void;

  isFetching: boolean;
  debouncedAuthor: string;
  hasActiveFilters: boolean;
};

/**
 * The filter bar.
 *
 * Two things changed beyond the visual pass. Difficulty chips no longer
 * carry a colour when they're *off* — they used to be permanently
 * emerald/amber/rose outlines, so the row read as a traffic light and
 * selection had nothing left to signal with. And the whole thing is a
 * real `<search>` landmark with a fieldset per group, because "filter
 * this list" is the primary control on the page and it was previously a
 * pile of unlabelled divs.
 */
export const RecipeFilters = ({
  DIFFICULTIES,
  POPULAR_TAGS,
  difficulty,
  selectedTags,
  author,
  toggleTag,
  toggleDifficulty,
  setAuthor,
  handleSearchChange,
  isFetching,
  debouncedAuthor,
  hasActiveFilters,
  clearAllFilters,
  search,
}: RecipeFiltersProps) => {
  // Purely local — there's no reason for a half-typed tag to be in the URL.
  const [tagInput, setTagInput] = useState("");

  const commitTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !selectedTags.includes(newTag)) toggleTag(newTag);
    setTagInput("");
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag();
    }
    if (e.key === "Backspace" && tagInput === "" && selectedTags.length) {
      toggleTag(selectedTags[selectedTags.length - 1]);
    }
  };

  /* Tags typed by hand won't be in POPULAR_TAGS, and they were previously
     invisible in this row — you could add "ramen", see the list filter,
     and have nothing on screen say why. */
  const customTags = selectedTags.filter((t) => !POPULAR_TAGS.includes(t));

  return (
    <search className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchField
          value={search}
          onChange={handleSearchChange}
          placeholder="Search recipes…"
          label="Search recipes"
          busy={isFetching}
          className="min-w-[220px] flex-1 sm:max-w-sm"
        />

        <SearchField
          value={author}
          onChange={setAuthor}
          placeholder="Filter by chef…"
          label="Filter by chef"
          icon={<UserIcon size={15} />}
          className="w-full sm:w-56"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="ui-chip focus-ring"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            <XIcon size={13} aria-hidden />
            Clear all
          </button>
        )}
      </div>

      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Difficulty</legend>
        <span
          className="ui-label mr-1 w-16 shrink-0"
          style={{ color: "var(--cs-text-tertiary)" }}
          aria-hidden
        >
          Level
        </span>
        {DIFFICULTIES.map((d) => (
          <FilterChip
            key={d}
            active={difficulty === d}
            onToggle={() => toggleDifficulty(d)}
            className="capitalize"
          >
            {d}
          </FilterChip>
        ))}
      </fieldset>

      <fieldset className="flex flex-wrap items-start gap-2">
        <legend className="sr-only">Tags</legend>
        <span
          className="ui-label mr-1 w-16 shrink-0 pt-1.5"
          style={{ color: "var(--cs-text-tertiary)" }}
          aria-hidden
        >
          Tags
        </span>

        <div className="flex flex-1 flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <FilterChip
              key={tag}
              active={selectedTags.includes(tag)}
              onToggle={() => toggleTag(tag)}
              className="capitalize"
            >
              {tag}
            </FilterChip>
          ))}

          {customTags.map((tag) => (
            <FilterChip
              key={tag}
              active
              onToggle={() => toggleTag(tag)}
              className="capitalize"
              trailing={<XIcon size={12} aria-hidden />}
            >
              {tag}
            </FilterChip>
          ))}

          <div
            className="ui-field px-3 py-1"
            style={{ borderStyle: "dashed", backgroundColor: "transparent" }}
          >
            <TagIcon size={12} className="shrink-0" style={{ color: "var(--cs-text-tertiary)" }} aria-hidden />
            <label htmlFor="recipe-tag-input" className="sr-only">
              Add a tag
            </label>
            <input
              id="recipe-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={commitTag}
              placeholder="add tag…"
              className="w-20 text-sm focus:w-28"
              style={{ transition: "width 180ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </div>
        </div>
      </fieldset>

      {debouncedAuthor && (
        <p className="ui-caption" style={{ color: "var(--cs-text-tertiary)" }}>
          Showing recipes by{" "}
          <span className="font-semibold" style={{ color: "var(--cs-text-primary)" }}>
            @{debouncedAuthor}
          </span>
        </p>
      )}
    </search>
  );
};
