"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import z from "zod";
import { Recipe } from "@/types/recipes.type";
import { SPRING } from "@/lib/motion";
import { DIFFICULTY } from "@/components/Chef/studio/viz";
import {
  FormSection,
  AddButton,
  TextInput,
  TextArea,
  LabelledField,
  SegmentedControl,
  Chip,
  SuggestionChip,
  RemoveButton,
} from "@/components/common/form/FormKit";
import { ImageDropzone } from "@/components/common/form/ImageDropzone";

/**
 * Recipe editor.
 *
 * The rebuild is structural, not cosmetic. What was one tall fieldset split
 * by hairlines — every control styled inline, three different focus
 * treatments between them — is now five cards, each holding one decision:
 * what the dish is, what it looks like, what goes in it, how it's filed,
 * how it's made. Grouping carries the explanation, so most of the helper
 * text that used to be needed isn't.
 *
 * The interaction changes that matter:
 *
 * - Instruction steps reorder with a spring and a shared layout, so moving
 *   a step *shows* it moving. Previously the array reordered and the DOM
 *   cut to the new arrangement — you had to re-read the list to find out
 *   what happened.
 * - Validation is no longer six toasts fired at once on a failed submit.
 *   Toasts stack over the thing you need to fix and disappear on a timer;
 *   errors now sit on the section that owns them and stay until resolved.
 * - Difficulty is a segmented control on the ordinal ramp, not three
 *   buttons filled green, amber and red. "Advanced" is an achievement, and
 *   painting it in the danger colour said the opposite.
 */

const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;
type DifficultyKey = (typeof DIFFICULTIES)[number];

const DIFFICULTY_OPTIONS: { value: DifficultyKey; label: string; dot: string }[] = [
  { value: "beginner", label: "Beginner", dot: DIFFICULTY.beginner },
  { value: "intermediate", label: "Intermediate", dot: DIFFICULTY.intermediate },
  { value: "advance", label: "Advanced", dot: DIFFICULTY.advance },
];

const POPULAR_TAGS = [
  "vegetarian",
  "dessert",
  "french",
  "italian",
  "seafood",
  "modernist",
  "fine dining",
  "nordic",
];

const REQUIRED_IMAGES = 3;
const MAX_TAGS = 5;

interface Instruction {
  step: number;
  instruction: string;
}

interface RecipeFormValues {
  title: string;
  description: string;
  difficulty: DifficultyKey;
  images: File[];
  ingredients: string[];
  tags: string[];
  instructions: Instruction[];
  removeImages?: string[];
}

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
  /**
   * Set when the form is hosted in a sheet. The sheet owns a pinned footer,
   * so its submit button lives outside this element and reaches back in via
   * `form="<id>"` — a recipe form is long enough that a submit button at the
   * end of the scroll is a submit button you have to go looking for.
   */
  formId?: string;
  hideSubmit?: boolean;
}

const schema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  difficulty: z.enum(DIFFICULTIES),
  images: z.array(z.instanceof(File)),
});

export default function RecipeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Publish recipe",
  formId,
  hideSubmit = false,
}: RecipeFormProps) {
  const reduceMotion = useReducedMotion();

  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients ?? [""],
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [instructions, setInstructions] = useState<Instruction[]>(
    initialData?.instructions.map((i) => ({
      step: i.step,
      instruction: i.instruction,
    })) ?? [{ step: 1, instruction: "" }],
  );
  const [difficulty, setDifficulty] = useState<DifficultyKey>(
    initialData?.difficulty ?? "beginner",
  );
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  /* ── Ingredients ── */
  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, val: string) =>
    setIngredients((prev) => prev.map((v, idx) => (idx === i ? val : v)));

  /* ── Tags ── */
  const addTag = useCallback(
    (tag: string) => {
      const clean = tag.trim().toLowerCase();
      if (clean && !tags.includes(clean) && tags.length < MAX_TAGS) {
        setTags((prev) => [...prev, clean]);
      }
      setTagInput("");
    },
    [tags],
  );
  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  /* ── Instructions ── */
  const renumber = (list: Instruction[]) =>
    list.map((ins, idx) => ({ ...ins, step: idx + 1 }));

  const addInstruction = () =>
    setInstructions((prev) => [...prev, { step: prev.length + 1, instruction: "" }]);
  const removeInstruction = (i: number) =>
    setInstructions((prev) => renumber(prev.filter((_, idx) => idx !== i)));
  const updateInstruction = (i: number, val: string) =>
    setInstructions((prev) =>
      prev.map((ins, idx) => (idx === i ? { ...ins, instruction: val } : ins)),
    );
  const moveInstruction = (i: number, dir: "up" | "down") => {
    const target = dir === "up" ? i - 1 : i + 1;
    if (target < 0 || target >= instructions.length) return;
    const next = [...instructions];
    [next[i], next[target]] = [next[target], next[i]];
    setInstructions(renumber(next));
  };

  /* ── Images ── */
  const toggleExistingImage = (url: string) =>
    setRemoveImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );

  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      difficulty: (initialData?.difficulty ?? "beginner") as DifficultyKey,
      images: [] as File[],
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      const cleanIngredients = ingredients.filter((i) => i.trim());
      const cleanInstructions = instructions.filter((i) => i.instruction.trim());
      const keptImages =
        initialData?.images.filter((url) => !removeImages.includes(url)) ?? [];
      const finalImageCount = keptImages.length + value.images.length;

      if (
        cleanIngredients.length === 0 ||
        tags.length === 0 ||
        cleanInstructions.length === 0 ||
        finalImageCount !== REQUIRED_IMAGES
      ) {
        // One message, and the sections carry the detail. Six simultaneous
        // toasts stacked over the form and timed out before they could be
        // acted on.
        setShowErrors(true);
        toast.error("A few things still need attention.", {
          position: "bottom-right",
        });
        return;
      }

      setShowErrors(false);
      await onSubmit({
        title: value.title,
        description: value.description,
        difficulty,
        images: value.images,
        ingredients: cleanIngredients,
        tags,
        instructions: cleanInstructions,
        ...(removeImages.length > 0 ? { removeImages } : {}),
      });
    },
  });

  const existingImages = initialData?.images.map((url) => ({
    url,
    markedForRemoval: removeImages.includes(url),
  }));

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      {/* ── The dish ── */}
      <FormSection title="The dish">
        <div className="space-y-4">
          <form.Field name="title">
            {(field) => (
              <LabelledField label="Title" htmlFor={field.name}>
                <TextInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Truffle risotto with aged parmesan"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <LabelledField
                label="Description"
                htmlFor={field.name}
                hint={`${field.state.value.length} / 2000`}
              >
                <TextArea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  maxLength={2000}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="What makes this dish worth cooking?"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>

          <LabelledField label="Difficulty">
            <SegmentedControl
              name="difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={DIFFICULTY_OPTIONS}
            />
          </LabelledField>
        </div>
      </FormSection>

      {/* ── Photography ── */}
      <FormSection
        title="Photography"
        hint={
          initialData
            ? "Press an image to swap it out, then add its replacement."
            : undefined
        }
      >
        <form.Field name="images">
          {(field) => (
            <ImageDropzone
              label={initialData ? "Recipe images" : "Three images"}
              slots={REQUIRED_IMAGES}
              files={Array.isArray(field.state.value) ? field.state.value : []}
              onChange={field.handleChange}
              existing={existingImages}
              onToggleExisting={toggleExistingImage}
              invalid={showErrors}
            />
          )}
        </form.Field>
      </FormSection>

      {/* ── Ingredients ── */}
      <FormSection
        title="Ingredients"
        error={showErrors && !ingredients.some((i) => i.trim()) && "Add at least one ingredient."}
        action={<AddButton label="Add" onClick={addIngredient} />}
      >
        <div className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {ingredients.map((ing, i) => (
              <motion.div
                key={i}
                layout={!reduceMotion}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                transition={reduceMotion ? { duration: 0.15 } : SPRING.snappy}
                className="flex items-center gap-2"
              >
                <span
                  className="w-4 text-xs text-right shrink-0 tabular-nums"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {i + 1}
                </span>
                <TextInput
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder={i === 0 ? "200g carnaroli rice" : "Next ingredient"}
                  aria-label={`Ingredient ${i + 1}`}
                />
                {ingredients.length > 1 && (
                  <RemoveButton
                    onClick={() => removeIngredient(i)}
                    label={`Remove ingredient ${i + 1}`}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </FormSection>

      {/* ── Tags ── */}
      <FormSection
        title="Tags"
        hint={`${tags.length} of ${MAX_TAGS} · how people will find this recipe`}
        error={showErrors && tags.length === 0 && "Add at least one tag."}
      >
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {tags.length > 0 && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING.snappy}
                className="flex flex-wrap gap-1.5 overflow-hidden"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {tags.map((tag) => (
                    <Chip key={tag} label={tag} onRemove={() => removeTag(tag)} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            <TextInput
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="Add your own, then press Enter"
              disabled={tags.length >= MAX_TAGS}
              aria-label="Custom tag"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
              className="h-9 rounded-[10px] text-xs shrink-0"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((tag) => (
              <SuggestionChip
                key={tag}
                label={tag}
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag) || tags.length >= MAX_TAGS}
              />
            ))}
          </div>
        </div>
      </FormSection>

      {/* ── Method ── */}
      <FormSection
        title="Method"
        error={
          showErrors &&
          !instructions.some((i) => i.instruction.trim()) &&
          "Add at least one step."
        }
        action={<AddButton label="Add step" onClick={addInstruction} />}
      >
        <div className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {instructions.map((ins, i) => (
              /* `layout` is what makes reordering legible: the row springs
                 to its new position instead of the list cutting to a new
                 arrangement. */
              <motion.div
                key={ins.step + "-" + i}
                layout={!reduceMotion}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                transition={reduceMotion ? { duration: 0.15 } : SPRING.default}
                className="flex gap-2 items-start"
              >
                <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0">
                  <StepArrow
                    dir="up"
                    disabled={i === 0}
                    onClick={() => moveInstruction(i, "up")}
                  />
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums"
                    style={{
                      backgroundColor: "var(--cs-surface-3)",
                      color: "var(--cs-text-secondary)",
                    }}
                  >
                    {ins.step}
                  </span>
                  <StepArrow
                    dir="down"
                    disabled={i === instructions.length - 1}
                    onClick={() => moveInstruction(i, "down")}
                  />
                </div>

                <TextArea
                  value={ins.instruction}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={
                    i === 0 ? "Toast the rice in butter until translucent…" : "Then…"
                  }
                  rows={2}
                  aria-label={`Step ${ins.step}`}
                />

                {instructions.length > 1 && (
                  <RemoveButton
                    onClick={() => removeInstruction(i)}
                    label={`Remove step ${ins.step}`}
                    className="mt-0.5"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </FormSection>

      {!hideSubmit && (
        <div className="flex justify-end pb-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-5 h-9 text-sm rounded-lg"
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

/* ── Bits ─────────────────────────────────────────────────────────────── */

function StepArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "up" | "down";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "up" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Move step ${dir}`}
      className="flex h-5 w-6 items-center justify-center rounded-md transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-90 disabled:opacity-20 disabled:pointer-events-none"
      style={{ color: "var(--cs-text-tertiary)" }}
    >
      <Icon size={10} weight="bold" />
    </button>
  );
}

/** Inline validation, shown against the field that owns it. */
function FieldError({ messages }: { messages: unknown[] }) {
  const text = messages
    .map((m) =>
      typeof m === "string" ? m : (m as { message?: string } | null)?.message,
    )
    .filter(Boolean)[0];

  return (
    <AnimatePresence initial={false}>
      {text && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={SPRING.snappy}
          className="text-xs overflow-hidden"
          style={{ color: "var(--cs-danger-fg)" }}
        >
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
