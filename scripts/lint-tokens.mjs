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
 * Run: pnpm lint:tokens
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");

const SPACE = [2, 4, 6, 8, 12, 16, 24, 32, 48];
const SPACE_PROPS = /\b(gap|row-gap|column-gap|padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/;

/* Primitive tokens a component may not bind to. A component names a role. */
const PRIMITIVE = /--di-(navy-\d+|gold-\d+|ok-\d+|warn-\d+|danger-\d+|night-[\w]+|paper|sheet|grid|sunken|wash|ivory|rule-\d+|ink|font-sans|font-mono|radius-[smlx])(?![\w-])/;

/* Where a primitive legitimately appears: the token files define them, and
 * a surface that re-points its own tokens is naming a value on purpose. */
const TOKEN_FILES = /styles\/tokens\//;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(css|tsx)$/.test(full)) files.push(full);
  }
})(SRC);

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
    if (k < i && /^\s*\.di-|^\s*}/.test(lines[k])) break;
  }
  return false;
}

const problems = [];
const add = (file, line, rule, message) =>
  problems.push({ file: relative(ROOT, file), line, rule, message });

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const isCss = file.endsWith(".css");
  const isTokens = TOKEN_FILES.test(file);
  const isStory = /\.stories\.tsx$/.test(file);
  const isComponent = /\/components\//.test(file);
  const fileAllows = (rule) => allowedFile(text, rule);

  lines.forEach((raw, i) => {
    const line = i + 1;
    const code = raw.replace(/\/\*.*?\*\//g, "");
    if (/^\s*\*/.test(raw) || /^\s*\/\//.test(raw)) return;

    if (isCss && !isTokens) {
      /* 1. Spacing lands on the ramp. */
      const decl = code.match(/^\s*([a-z-]+)\s*:\s*([^;]+);/);
      if (decl && SPACE_PROPS.test(decl[1]) && !/var\(|calc\(/.test(decl[2])) {
        for (const px of decl[2].matchAll(/(\d+)px/g)) {
          const n = Number(px[1]);
          if (n !== 0 && !SPACE.includes(n)) {
            const near = SPACE.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) || (Math.abs(b - n) === Math.abs(a - n) && b < a) ? b : a));
            add(file, line, "space", `${decl[1]}: ${n}px is not on the ramp (${SPACE.join(", ")}). Nearest is var(--di-space-${near}).`);
          } else if (n !== 0) {
            add(file, line, "space", `${decl[1]}: ${n}px is on the ramp but written raw. Use var(--di-space-${n}).`);
          }
        }
      }

      /* 2. Radius comes from the ramp. */
      const rad = code.match(/^\s*border-radius\s*:\s*([^;]+);/);
      if (rad && !/var\(|50%|^0$/.test(rad[1].trim()) && /\d+px/.test(rad[1])) {
        add(file, line, "radius", `border-radius: ${rad[1].trim()} is hand-set. Use --di-radius-micro | -control | -surface | -container | -pill.`);
      }

      /* 3. Type comes from the scale. */
      const size = code.match(/^\s*font-size\s*:\s*(\d+)px/);
      if (size) add(file, line, "type", `font-size: ${size[1]}px is raw. Use a --di-font-size-* step.`);

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
        add(file, line, "layer", `${prim[0]} is a primitive used directly. Bind to a semantic role, or define a local --di-* from it if this surface re-points its own roles.`);
      }
    }

    /* 6. The API rule: only ever text is a string prop; anything that can
     *    hold a component is a named slot. `ReactNode` is the sign the
     *    decision was never made.
     *
     *    Scoped to src/components, which is the library. A screen's local
     *    data shape is not an API — `NavItem.icon` is a field on the data a
     *    product hands the shell, and `Menu.trigger` is a render prop,
     *    because the menu puts its own aria-expanded on a caller's button. */
    if (isComponent && !isStory) {
      const node = code.match(/^\s*(\w+)\??:\s*ReactNode;/);
      const name = node?.[1];
      if (name && name !== "children" && name !== "icon" && name !== "trigger"
          && !allowed(lines, i, "api")) {
        add(file, line, "api", `\`${name}: ReactNode\` — only \`children\`, \`NavItem.icon\` and \`Menu.trigger\` may be ReactNode. Make it a string prop, or a named slot the caller writes as a child.`);
      }
    }
  });
}

const only = process.argv.includes("--rule")
  ? process.argv[process.argv.indexOf("--rule") + 1]
  : null;
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
console.log(`\n${shown.length} problem${shown.length === 1 ? "" : "s"}. These ramps are stated in Foundations/Scale; a value between two steps is a decision nobody made.\n`);
process.exit(1);
