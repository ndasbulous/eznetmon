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
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // React - Strict Rules
      "react/no-unescaped-entities": "error",
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
      "react/no-unstable-nested-components": "error",
      "react/jsx-key": "error",
      "react/no-array-index-key": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js specific
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "error",

      // General best practices
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",
    },
  },
]);

export default eslintConfig;
