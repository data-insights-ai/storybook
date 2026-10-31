import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Every component has a docs page, and its description renders as written.
 * The docs page renders a component's JSDoc as markdown: an inline code span
 * that runs over a line end, or a backslash before a backtick, opens a code
 * block that swallows the text after it. A story file under src/components
 * carries the `autodocs` tag, so Storybook builds its docs page.
 */
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : [full];
  });

const findings = [];
for (const file of files("src").filter((f) => /\.tsx?$/.test(f))) {
  const text = readFileSync(file, "utf8");
  for (const [, body] of text.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
    for (const line of body.split("\n").map((l) => l.replace(/^\s*\* ?/, ""))) {
      if (line.includes("```")) continue;
      if ((line.match(/`/g) ?? []).length % 2 === 1 || line.includes("\\`"))
        findings.push(`${file}: inline code broken over a line or escaped: ${line.trim()}`);
    }
  }
  if (file.startsWith(path.join("src", "components")) && file.endsWith(".stories.tsx")) {
    const tags = text.match(/^const meta = \{[\s\S]*?^\s*tags: \[([^\]]*)\]/m)?.[1] ?? "";
    if (!/"autodocs"/.test(tags) || /"!autodocs"/.test(tags))
      findings.push(`${file}: the meta has no "autodocs" tag, so the component has no docs page`);
  }
}

for (const f of findings) console.error(f);
console.log(`docs: ${findings.length} findings`);
process.exit(findings.length ? 1 : 0);
