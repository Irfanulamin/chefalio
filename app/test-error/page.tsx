"use client";

/** Temporary — lets you preview app/error.tsx on demand. Remove after checking. */
export default function TestErrorPage() {
  throw new Error("Deliberate test error — checking the error boundary UI.");
}
