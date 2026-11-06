import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored agent skill packs — third-party example code, not ours to
    // lint. They also ship .mjs/.js helpers that skew language stats,
    // which is why they're gitignored too.
    ".agents/**",
    ".claude/**",
    // NestJS API, linted with its own config inside backend/
    "backend/**",
  ]),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]);

export default eslintConfig;
