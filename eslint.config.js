import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "storybook-static", "coverage", ".worktrees", ".design-sync", "node_modules"] },
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    extends: [tseslint.configs.recommended],
    languageOptions: { parser: tseslint.parser },
    linterOptions: { reportUnusedDisableDirectives: "error" },
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
      // Safari drops the list role from a list styled without markers, so an unstyled list states it.
      "jsx-a11y/no-redundant-roles": ["error", { ol: ["list"], ul: ["list"] }],
      // A region that scrolls is a tab stop, so the keyboard can scroll it (WCAG 2.1.1).
      "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["tabpanel", "region"], allowExpressionValues: true }],
    },
  },
);
