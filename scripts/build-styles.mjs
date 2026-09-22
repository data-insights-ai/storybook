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

function inline(file) {
  const dir = dirname(file);
  return readFileSync(file, "utf8").replace(/@import "([^"]+)";/g, (_, spec) => {
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
for (const file of readdirSync("src/components")) {
  if (!file.endsWith(".css")) continue;
  copyFileSync(join("src/components", file), join(componentDir, file));
  sheets += 1;
}
console.log(`styles.css ${css.length} bytes, ${seen.size} woff2 files, ${sheets} component stylesheets`);
