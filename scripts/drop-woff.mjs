import { readFileSync, writeFileSync } from "node:fs";

const file = "dist/lib/styles.css";
const css = readFileSync(file, "utf8");
const next = css.replace(/,url\(data:font\/woff;base64,[A-Za-z0-9+/=]+\)format\("woff"\)/g, "");
if (next === css) {
  console.error("expected woff font data in the built stylesheet");
  process.exit(1);
}
writeFileSync(file, next);
console.log(`styles.css ${css.length} -> ${next.length}`);
