import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/*
 * dependency-cruiser against its recorded findings, which may only shrink: a new
 * violation fails, and so does a recorded one that is gone, until `--write` records
 * the smaller set. `--write` refuses when a rule would record more violations than before.
 */
const known = ".dependency-cruiser-known-violations.json";
function cruise() {
  const args = ["exec", "depcruise", "src", "--config", ".dependency-cruiser.cjs", "--output-type", "json"];
  try {
    return execFileSync("pnpm", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    // depcruise exits with the number of violations; the report is still on stdout.
    if (error.stdout) return error.stdout;
    throw error;
  }
}
const output = cruise();
const result = JSON.parse(output);
const key = (v) => `${v.rule.name}: ${v.from} → ${v.to}`;
const current = result.summary.violations;
const recorded = existsSync(known) ? JSON.parse(readFileSync(known, "utf8")) : [];
const recordedKeys = new Set(recorded.map(key));
const currentKeys = new Set(current.map(key));
const fresh = [...currentKeys].filter((k) => !recordedKeys.has(k)).sort();
const gone = [...recordedKeys].filter((k) => !currentKeys.has(k)).sort();

for (const f of fresh) console.error(`new ${f}`);
if (process.argv.includes("--write")) {
  // A move renames violations without adding any, so the test is the count per rule.
  const countBy = (list) => list.reduce((c, v) => ({ ...c, [v.rule.name]: (c[v.rule.name] ?? 0) + 1 }), {});
  const before = countBy(recorded);
  const grown = Object.entries(countBy(current)).filter(([rule, n]) => n > (before[rule] ?? 0));
  if (grown.length && !process.argv.includes("--accept-growth")) {
    for (const [rule, n] of grown) console.error(`dependencies: ${rule} would grow from ${before[rule] ?? 0} to ${n}`);
    console.error("dependencies: a baseline never admits a new violation; fix it, or pass --accept-growth and say why in the commit");
    process.exit(1);
  }
  const kept = current.map(({ type, from, to, unresolvedTo, dependencyTypes, rule, cycle }) => ({ type, from, to, unresolvedTo, dependencyTypes, rule, ...(cycle ? { cycle } : {}) }));
  writeFileSync(known, `${JSON.stringify(kept, null, 2)}\n`);
  console.log(`dependencies: recorded ${kept.length} known violations (was ${recorded.length})`);
  process.exit(0);
}
console.log(`dependencies: ${currentKeys.size} violations, ${currentKeys.size - fresh.length} known, ${result.summary.totalCruised} modules`);
if (gone.length) {
  for (const g of gone) console.error(`gone ${g}`);
  console.error(`dependencies: ${gone.length} recorded violations are gone; run node scripts/lint-deps.mjs --write`);
}
process.exit(fresh.length || gone.length ? 1 : 0);
