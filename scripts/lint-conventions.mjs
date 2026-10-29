import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * .design-sync/conventions.md is what the design agent reads instead of the code, so it
 * must not name a component the package does not export, a sidebar group that does not
 * exist or a story title that is gone, and it must list every group the sidebar has.
 */
const text = readFileSync(".design-sync/conventions.md", "utf8");
const exported = new Set(JSON.parse(readFileSync("scripts/public-api.json", "utf8")).exports);
const preview = readFileSync(".storybook/preview.tsx", "utf8");
const sections = [...preview.match(/const sections = \[([^\]]*)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const unlisted = new Set(["Introduction", "Screens"]);

const storyFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return storyFiles(full);
    return name.endsWith(".stories.tsx") || name.endsWith(".mdx") ? [full] : [];
  });
const titles = storyFiles("src").flatMap((f) => [...readFileSync(f, "utf8").matchAll(/title[:=]\s*"([^"]+)"/g)].map((m) => m[1]));

const findings = [];
for (const [, name] of text.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)) {
  if (!exported.has(name)) findings.push(`names \`${name}\`, which the package does not export`);
}
const groups = new Set();
for (const [, ref] of text.matchAll(/`([A-Z][A-Za-z]+\/[A-Za-z/*]*)`/g)) {
  const group = ref.split("/")[0];
  groups.add(group);
  if (!sections.includes(group)) findings.push(`names the group \`${group}/\`, which the sidebar does not have`);
  const rest = ref.slice(group.length + 1);
  if (rest && rest !== "*" && !titles.some((t) => t === ref || t.startsWith(ref + "/"))) findings.push(`names \`${ref}\`, which no story has as its title`);
}
for (const section of sections) {
  if (!unlisted.has(section) && !groups.has(section)) findings.push(`does not list the sidebar group \`${section}/\``);
}

for (const f of [...new Set(findings)]) console.error(`conventions.md ${f}`);
console.log(`conventions: ${new Set(findings).size} findings`);
process.exit(findings.length ? 1 : 0);
