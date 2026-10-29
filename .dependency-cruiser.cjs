/**
 * The package's dependency direction (AGENTS.md, "Structure"): internal helpers under
 * components, components under screens and the Storybook chrome, and a component reached
 * from another folder only through its index.ts. `pnpm lint:structure` runs it; violations
 * already recorded in .dependency-cruiser-known-violations.json are reported, not failed,
 * until the restructure removes them.
 */
module.exports = {
  forbidden: [
    {
      name: "no-cycles",
      comment: "A module never reaches itself through its imports.",
      severity: "error",
      from: { path: "^src" },
      to: { circular: true },
    },
    {
      name: "components-below-screens",
      comment: "Screens compose components; no component imports a screen.",
      severity: "error",
      from: { path: "^src/(components|internal)" },
      to: { path: "^src/screens" },
    },
    {
      name: "package-without-storybook",
      comment: "The package never imports the Storybook chrome.",
      severity: "error",
      from: { path: "^src", pathNot: "\\.stories\\.tsx$" },
      to: { path: "^\\.storybook" },
    },
    {
      name: "components-without-foundations",
      comment: "Foundations document the brand from components; components do not import them.",
      severity: "error",
      from: { path: "^src/(components|internal)" },
      to: { path: "^src/foundations" },
    },
    {
      name: "internal-at-the-bottom",
      comment: "Internal helpers import nothing that is drawn.",
      severity: "error",
      from: { path: "^src/internal" },
      to: { path: "^src/(components|screens|foundations)" },
    },
    {
      name: "components-through-their-index",
      comment: "Another folder reaches a component only through that component's index.ts.",
      severity: "error",
      from: { path: "^src/components/(.+)/[^/]+$" },
      to: { path: "^src/components/", pathNot: ["^src/components/$1/", "/index\\.ts$", "\\.css$"] },
    },
    {
      name: "screens-through-the-package",
      comment: "Screens import what a product imports: the package root.",
      severity: "error",
      from: { path: "^src/screens" },
      to: { path: "^src/(components|internal)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "\\.(css|woff2|svg|png)$" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { extensions: [".ts", ".tsx", ".js", ".mjs"] },
  },
};
