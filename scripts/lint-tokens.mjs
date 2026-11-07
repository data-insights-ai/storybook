#!/usr/bin/env node
/*
 * Design-system lint.
 *
 * Foundations states the ramps; this is what keeps the components on them.
 * Storybook can show a designer that a value is wrong, but only a check
 * that fails can stop the next component inventing an eleventh padding.
 *
 * Every rule here exists because the codebase already broke it: 190
 * spacing values sat between two steps across 51 of 57 files, four radii
 * were hand-set, eleven components bound to a primitive token, and the
 * brand pages drew themselves in two colours the palette does not hold.
 *
 * Run: pnpm lint:tokens (this library's src)
 *      di-lint-tokens <dir>... (a product's stylesheets)
 *
 * A product's stylesheets get the rules that hold anywhere (space, radius,
 * type, colour, layer, focus ring) and one of their own: a product sets no
 * `--di-*` property except the slots in component.css, which exist so a
 * screen can tune them. Re-pointing a role or inventing a name in the
 * system's namespace forks the system where nobody can see it.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE = fileURLToPath(new URL("..", import.meta.url));
const targets = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--rule");
const product = targets.length > 0;
const ROOT = product ? process.cwd() : PACKAGE;
const DIRS = product ? targets.map((t) => resolve(t)) : [join(PACKAGE, "src")];
for (const dir of DIRS) {
  if (!existsSync(dir)) {
    console.error(`di-lint-tokens: ${relative(process.cwd(), dir) || dir} does not exist`);
    process.exit(2);
  }
}

/* The slots a product may set: every custom property component.css declares. */
const SLOTS = new Set(
  [...readFileSync(join(PACKAGE, "src/styles/tokens/component.css"), "utf8").matchAll(/^\s*(--di-[\w-]+)\s*:/gm)].map(
    (m) => m[1],
  ),
);
const SPACE = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96];
const SPACE_PROPS = /\b(gap|row-gap|column-gap|padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/;

/* Primitive tokens a component may not bind to. A component names a role. */
const PRIMITIVE =
  /--di-(navy-\d+|gold-\d+|poppy-\d+|cornflower-\d+|ok-\d+|amber-\d+|danger-\d+|slate-[\w-]+|night-[\w]+|paper-[\w]+|severity-[\w]+-(?:day|night)|font-sans(?:-band)?|font-mono|font-grotesk(?:-band)?|radius-[smlx]+)(?![\w-])/;

/* Where a primitive legitimately appears: the token files define them, and
 * a surface that re-points its own tokens is naming a value on purpose. */
const TOKEN_FILES = /styles\/tokens\//;

/*
 * Sizes and spacing in a component follow the density, so a raw length
 * there is a value one density cannot change. What stays raw is what no
 * density moves: a 1px rule or hairline, a border, an outline and its
 * offset, a focus ring of 2px or less, a stroke, an underline offset, and
 * the condition of a media or container query (CSS cannot read a custom
 * property there). Anything else names a token, or says why it cannot.
 */
const SIZE_FREE =
  /^(border(-[a-z]+)*|outline(-[a-z]+)?|stroke(-[a-z]+)?|text-underline-offset|text-decoration-thickness|transition|animation)$/;

const files = [];
const SKIP = new Set(["node_modules", "dist", ".worktrees", "test-results"]);
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if ((product ? /\.css$/ : /\.(css|tsx)$/).test(full)) files.push(full);
  }
}
DIRS.forEach(walk);

/*
 * An exception has to say why. `di-lint-allow <rule>: <reason>` on the line
 * above, or at the top of the block it covers. The sign-in card pins the
 * daylight palette in both themes on purpose, and a brand specimen showing
 * the navy slide has to name navy — those are decisions, not drift, and the
 * difference is that a decision is written down.
 */
function allowedFile(text, rule) {
  const m = text.slice(0, 1400).match(/di-lint-allow-file\s+([\w, ]+):/);
  return Boolean(m && m[1].split(/[,\s]+/).includes(rule));
}

function allowed(lines, i, rule) {
  for (let k = i; k >= Math.max(0, i - 40); k--) {
    const m = lines[k].match(/di-lint-allow\s+([\w, ]+):/);
    if (m && m[1].split(/[,\s]+/).includes(rule)) return true;
    if (k < i && (product ? /\{\s*$|^\s*}/ : /^\s*\.di-|^\s*}/).test(lines[k])) break;
  }
  return false;
}

const problems = [];
const add = (file, line, rule, message) => problems.push({ file: relative(ROOT, file), line, rule, message });

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const isCss = file.endsWith(".css");
  const isTokens = !product && TOKEN_FILES.test(file);
  const isStory = /\.stories\.tsx$/.test(file);
  const isComponent = !product && /\/components\//.test(file);
  const fileAllows = (rule) => allowedFile(text, rule);

  let property = null;
  lines.forEach((raw, i) => {
    const line = i + 1;
    const code = raw.replace(/\/\*.*?\*\//g, "");
    if (/^\s*\*/.test(raw) || /^\s*\/\//.test(raw)) return;

    if (
      isCss &&
      !isTokens &&
      (isComponent || /styles\/primitives\.css$/.test(file)) &&
      !fileAllows("size") &&
      !allowed(lines, i, "size")
    ) {
      /* 7. Sizes and spacing come from tokens, so the density can move them. */
      const own = code.match(/^\s*(-?-?[a-z][\w-]*)\s*:(.*)$/);
      const continues = !own && property && !/^\s*([.@}:#\[*&>]|[a-z][\w-]*\s*[,{])/.test(code);
      if (own) property = own[1];
      const value = own ? own[2] : continues ? code : "";
      if (value && !/^\s*@/.test(code) && !SIZE_FREE.test(property)) {
        for (const px of value.matchAll(/(-?\d*\.?\d+)px/g)) {
          const n = Math.abs(Number(px[1]));
          if (n <= 1 || (property === "box-shadow" && n <= 2)) continue;
          add(
            file,
            line,
            "size",
            `${property}: ${px[0]} is a raw length. Use a density token (--di-control-h-*, --di-row-h, --di-icon-*, --di-inset*, --di-gap-*) or a measure from component.css.`,
          );
        }
      }
      if (own && /;\s*$/.test(code)) property = null;
      if (/[{}]\s*$/.test(code)) property = null;
    }

    if (isCss && !isTokens) {
      /* 1. Spacing lands on the ramp. */
      const decl = code.match(/^\s*([a-z-]+)\s*:\s*([^;]+);/);
      if (decl && SPACE_PROPS.test(decl[1]) && !/var\(|calc\(/.test(decl[2])) {
        for (const px of decl[2].matchAll(/(\d+)px/g)) {
          const n = Number(px[1]);
          if (n !== 0 && !SPACE.includes(n)) {
            const near = SPACE.reduce((a, b) =>
              Math.abs(b - n) < Math.abs(a - n) || (Math.abs(b - n) === Math.abs(a - n) && b < a) ? b : a,
            );
            add(
              file,
              line,
              "space",
              `${decl[1]}: ${n}px is not on the ramp (${SPACE.join(", ")}). Nearest is var(--di-space-${near}).`,
            );
          } else if (n !== 0) {
            add(file, line, "space", `${decl[1]}: ${n}px is on the ramp but written raw. Use var(--di-space-${n}).`);
          }
        }
      }

      /* A sign in front of var() is not CSS: the declaration is dropped
       *    silently. Negate with calc(-1 * var(...)). */
      for (const neg of code.matchAll(/(^|[\s:(,])-var\(/g)) {
        add(
          file,
          line,
          "negative-var",
          `"${neg[0].trim()}" is invalid CSS and is ignored by the browser. Use calc(-1 * var(...)).`,
        );
      }

      /* 8. The focus ring is one model (Foundations, Practice): its width,
       *    colour and offset are the --di-focus-ring-* tokens. An offset
       *    of 0 puts the ring on a framed item's edge. */
      const ring = code.match(/^\s*(outline(?:-width|-color|-style)?|outline-offset)\s*:\s*([^;]+);/);
      if (ring) {
        const [, prop, value] = ring;
        const ok =
          prop === "outline"
            ? value.trim() === "none" || value.trim() === "var(--di-focus-ring-width) solid var(--di-focus-ring-color)"
            : prop === "outline-offset"
              ? /^(0|var\(--di-focus-ring-(offset|inset)\))$/.test(value.trim())
              : false;
        if (!ok)
          add(
            file,
            line,
            "focus-ring",
            `${prop}: ${value.trim()} leaves the focus ring model. Use outline: var(--di-focus-ring-width) solid var(--di-focus-ring-color) and outline-offset: var(--di-focus-ring-offset) | var(--di-focus-ring-inset) | 0; recolour through --di-focus-ring-color.`,
          );
      }

      /* 2. Radius comes from the ramp. */
      const rad = code.match(/^\s*border-radius\s*:\s*([^;]+);/);
      if (rad && !/var\(|50%|^0$/.test(rad[1].trim()) && /\d(px|r?em)\b/.test(rad[1])) {
        add(
          file,
          line,
          "radius",
          `border-radius: ${rad[1].trim()} is hand-set. Use --di-radius-micro | -control | -surface | -container | -pill.`,
        );
      }

      /* 3. Type comes from the scale. */
      const size = code.match(/^\s*font-size\s*:\s*(\d*\.?\d+(?:px|r?em))\b/);
      if (size) add(file, line, "type", `font-size: ${size[1]} is raw. Use a --di-font-size-* step.`);

      /* 4. Colour is a token, never a literal. A hex is correct in daylight
       *    and wrong on the night sheet, because the token flips and it
       *    cannot. */
      for (const hex of fileAllows("colour") ? [] : code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        add(file, line, "colour", `${hex[0]} is a literal. Bind to a --di-* role so the dark remap follows.`);
      }

      /* 5. A component binds to a semantic or component token, not a
       *    primitive: a primitive has no dark counterpart, so a component
       *    that names one is correct in daylight and wrong after dark.
       *
       *    Defining a custom property from a primitive is allowed — that is
       *    a surface re-pointing its own roles, which is what Toast and the
       *    current Stage do to sit on navy. Using one in an ordinary
       *    declaration is not. */
      const isDefinition = /^\s*--di-[\w-]+\s*:/.test(code);
      const prim = code.match(PRIMITIVE);
      if (prim && /var\(/.test(code) && !isDefinition && !fileAllows("layer") && !allowed(lines, i, "layer")) {
        add(
          file,
          line,
          "layer",
          `${prim[0]} is a primitive used directly. Bind to a semantic role, or define a local --di-* from it if this surface re-points its own roles.`,
        );
      }
    }

    /* 9. A product tunes the slots component.css declares and sets no other
     *    `--di-*` property: re-pointing a role or inventing a name forks the
     *    system where Storybook cannot show it. */
    const own = product && isCss && code.match(/^\s*(--di-[\w-]+)\s*:/);
    if (own && !SLOTS.has(own[1]) && !fileAllows("token") && !allowed(lines, i, "token")) {
      add(
        file,
        line,
        "token",
        `${own[1]} is not a slot a product may set. Use the design system's tokens as they are, or add the token to the design system.`,
      );
    }

    /* 6. The API rule: only ever text is a string prop; anything that can
     *    hold a component is a named slot. `ReactNode` is the sign the
     *    decision was never made.
     *
     *    Scoped to src/components, which is the library. A screen's local
     *    data shape is not an API — an option's `icon` is a field on the data a
     *    caller hands a choice or a pill, and `Menu.trigger` is a render prop,
     *    because the menu puts its own aria-expanded on a caller's button. */
    if (isComponent && !isStory) {
      const node = code.match(/^\s*(\w+)\??:\s*ReactNode;/);
      const name = node?.[1];
      if (name && name !== "children" && name !== "icon" && name !== "trigger" && !allowed(lines, i, "api")) {
        add(
          file,
          line,
          "api",
          `\`${name}: ReactNode\` — only \`children\`, an option's \`icon\` and \`Menu.trigger\` may be ReactNode. Make it a string prop, or a named slot the caller writes as a child.`,
        );
      }
    }
  });
}

const only = process.argv.includes("--rule") ? process.argv[process.argv.indexOf("--rule") + 1] : null;
const shown = only ? problems.filter((p) => p.rule === only) : problems;

if (shown.length === 0) {
  console.log("lint:tokens — clean. Spacing, radius, type, colour and layer all hold.");
  process.exit(0);
}

const byRule = {};
for (const p of shown) (byRule[p.rule] ??= []).push(p);

for (const [rule, list] of Object.entries(byRule)) {
  console.log(`\n  ${rule}  (${list.length})`);
  for (const p of list) console.log(`    ${p.file}:${p.line}  ${p.message}`);
}
console.log(
  `\n${shown.length} problem${shown.length === 1 ? "" : "s"}. These ramps are drawn in Foundations/Space and shape; a value between two steps is a decision nobody made.\n`,
);
process.exit(1);
