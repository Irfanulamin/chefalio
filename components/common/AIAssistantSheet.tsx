"use client";

import { useState, useRef, KeyboardEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAIAssistant, AIMatch } from "@/hooks/useAIAssistant";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { X, Sparkles, ChefHat } from "lucide-react";

const difficultyColor: Record<string, string> = {
  beginner: "bg-emerald-600",
  intermediate: "bg-amber-500",
  advance: "bg-red-600",
};

function RecipeMatchCard({
  match,
  onClose,
}: {
  match: AIMatch;
  onClose: () => void;
}) {
  return (
    <Link
      href={`/recipes/${match._id}`}
      onClick={onClose}
      className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all"
    >
      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {match.images[0] && (
          <Image
            src={match.images[0]}
            alt={match.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground line-clamp-1">
          {match.title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
          {match.description}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">
          {match.matchCount} ingredient{match.matchCount !== 1 ? "s" : ""} match
        </p>
      </div>
    </Link>
  );
}

export function AIAssistantSheet() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggest, result, isLoading, error, reset } = useAIAssistant();

  const addIngredient = (value: string) => {
    const trimmed = value.trim().toLowerCase().replace(/,/g, "");
    if (trimmed && !ingredients.includes(trimmed) && ingredients.length < 12) {
      setIngredients((prev) => [...prev, trimmed]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      ingredients.length > 0
    ) {
      setIngredients((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    const all = inputValue.trim()
      ? [...ingredients, inputValue.trim().toLowerCase()]
      : ingredients;
    if (inputValue.trim()) {
      addIngredient(inputValue);
    }
    if (all.length > 0) suggest(all);
  };

  const handleReset = () => {
    setIngredients([]);
    setInputValue("");
    reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) handleReset();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Chef</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <SheetTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Chef Assistant
          </SheetTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal">
            Tell me what&apos;s in your fridge and I&apos;ll find matching
            recipes or generate a custom one.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Ingredient input — only shown before results */}
          {!result && !isLoading && (
            <div className="space-y-3">
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-foreground font-medium"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-0.5 text-zinc-400 hover:text-foreground transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder={
                    ingredients.length === 0
                      ? "e.g. chicken, garlic, pasta…"
                      : "Add more ingredients…"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (inputValue.trim()) addIngredient(inputValue);
                  }}
                  className="pr-20 border-zinc-200 dark:border-zinc-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 pointer-events-none">
                  ↵ to add
                </span>
              </div>

              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                {ingredients.length}/12 ingredients
              </p>

              <Button
                onClick={handleSubmit}
                disabled={ingredients.length === 0 && !inputValue.trim()}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Find Recipes
              </Button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-100 dark:border-zinc-800" />
                <div className="absolute inset-0 rounded-full border-2 border-t-zinc-900 dark:border-t-white animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Searching recipes + generating with AI…
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  This takes a few seconds
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="space-y-3">
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                Try again
              </Button>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6">
              {/* Ingredients recap + reset */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ingredients.map((i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500"
                  >
                    {i}
                  </span>
                ))}
                <button
                  onClick={handleReset}
                  className="px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 hover:text-foreground transition-colors"
                >
                  ← Try again
                </button>
              </div>

              {/* Platform matches */}
              {result.matches.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                    From Chefalio
                  </p>
                  <div className="space-y-2">
                    {result.matches.map((match) => (
                      <RecipeMatchCard
                        key={match._id}
                        match={match}
                        onClose={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Generated */}
              {result.generated && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      Generated for You
                    </p>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  </div>

                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-[15px] font-bold text-foreground leading-snug">
                          {result.generated.title}
                        </h3>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md text-white capitalize mt-0.5",
                            difficultyColor[result.generated.difficulty] ??
                              "bg-zinc-600",
                          )}
                        >
                          {result.generated.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {result.generated.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-400">
                        {result.generated.cookTime && (
                          <span>⏱ {result.generated.cookTime}</span>
                        )}
                        {result.generated.servings && (
                          <span>👥 Serves {result.generated.servings}</span>
                        )}
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">
                        Ingredients
                      </p>
                      <ul className="space-y-1.5">
                        {result.generated.ingredients.map((ing, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div className="p-4">
                      <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">
                        Instructions
                      </p>
                      <ol className="space-y-3">
                        {result.generated.instructions.map(
                          ({ step, instruction }) => (
                            <li key={step} className="flex gap-3 text-sm">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center text-[11px] font-bold mt-0.5">
                                {step}
                              </span>
                              <span className="text-foreground leading-relaxed">
                                {instruction}
                              </span>
                            </li>
                          ),
                        )}
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Nothing found */}
              {result.matches.length === 0 && !result.generated && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <ChefHat className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm font-medium text-foreground">
                    No results found
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Try different ingredients
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Try again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
