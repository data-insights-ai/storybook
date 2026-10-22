import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(new URL("../package.json", import.meta.url));
const outDir = "dist/lib";
const fontDir = join(outDir, "fonts");
mkdirSync(fontDir, { recursive: true });

const seen = new Set();

function fontFace(spec) {
  const cssPath = require.resolve(spec);
  const css = readFileSync(cssPath, "utf8").replace(
    /, url\(\.\/files\/[^)]+\.woff\) format\('woff'\)/g,
    "",
  );
  return css.replace(/url\(\.\/files\/([^)]+\.woff2)\)/g, (_, file) => {
    if (!seen.has(file)) {
      copyFileSync(join(dirname(cssPath), "files", file), join(fontDir, file));
      seen.add(file);
    }
    return `url(./fonts/${file})`;
  });
}

/* A face of our own over a @fontsource file (styles/band-face.css) names the
   file by package path; ship it beside the others. */
function fontUrls(css) {
  return css.replace(/url\("(@fontsource\/[^"]+\.woff2)"\)/g, (_, spec) => {
    const file = spec.split("/").pop();
    if (!seen.has(file)) {
      copyFileSync(require.resolve(spec), join(fontDir, file));
      seen.add(file);
    }
    return `url(./fonts/${file})`;
  });
}

function inline(file) {
  const dir = dirname(file);
  return fontUrls(readFileSync(file, "utf8")).replace(/@import "([^"]+)";/g, (_, spec) => {
    if (spec.startsWith("@fontsource/")) return fontFace(spec).trim();
    if (spec.startsWith(".")) return inline(join(dir, spec)).trim();
    throw new Error(`Unhandled style import ${spec}`);
  });
}

const css = inline("src/styles.css").trim() + "\n";
if (css.includes("data:font") || css.includes(".woff)")) {
  console.error("built styles.css still carries woff or inlined font data");
  process.exit(1);
}
writeFileSync(join(outDir, "styles.css"), css);
copyFileSync(require.resolve("@fontsource/sansation/LICENSE"), join(fontDir, "OFL-Sansation.txt"));
copyFileSync(require.resolve("@fontsource/ibm-plex-sans/LICENSE"), join(fontDir, "OFL-IBM-Plex.txt"));
const componentDir = join(outDir, "components");
mkdirSync(componentDir, { recursive: true });
let sheets = 0;
/*
 * Each component stylesheet carries the @layer order itself. The order is
 * fixed by the FIRST @layer statement a document sees, and a component sheet
 * opens with `@layer components {`. A consumer that loads Button.css before
 * styles.css - or a bundler that concatenates them that way - would otherwise
 * register `components` first and leave `base` outranking it, so base.css's
 * `button { color: inherit }` would beat `.di-btn-primary`'s colour and the
 * label would go navy on navy. Repeating the statement is idempotent: naming
 * an existing layer never reorders it. This also keeps a tree-shaken product
 * that ships one component correct, since it never loads styles.css.
 */
const layerOrder = readFileSync("src/styles.css", "utf8").match(/^@layer[^;]*;/m)?.[0];
if (!layerOrder) {
  console.error("src/styles.css no longer opens with an @layer order statement");
  process.exit(1);
}
/* A component drawn from several modules keeps its sheet in its own folder (`timeline/`). */
for (const file of readdirSync("src/components", { recursive: true })) {
  if (!file.endsWith(".css")) continue;
  const sheet = readFileSync(join("src/components", file), "utf8");
  mkdirSync(dirname(join(componentDir, file)), { recursive: true });
  writeFileSync(join(componentDir, file), `${layerOrder}\n${sheet}`);
  sheets += 1;
}
console.log(`styles.css ${css.length} bytes, ${seen.size} woff2 files, ${sheets} component stylesheets`);
