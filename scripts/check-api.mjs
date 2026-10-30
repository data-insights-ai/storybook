import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

/*
 * The package's public surface is what a product imports from the entry and
 * the class names it may style or query. Both are kept in public-api.json;
 * a change to either has to be written there on purpose (--write).
 */
const snapshot = path.join("scripts", "public-api.json");
const entry = path.join("dist", "lib", "index.d.ts");

function exportsOf(file) {
  const program = ts.createProgram([file], { skipLibCheck: true, noEmit: true });
  const checker = program.getTypeChecker();
  const module = checker.getSymbolAtLocation(program.getSourceFile(file));
  return checker
    .getExportsOfModule(module)
    .map((symbol) => symbol.getName())
    .sort();
}

function sheets(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return sheets(file);
    return file.endsWith(".css") ? [file] : [];
  });
}

function classesOf(dir) {
  const found = new Set();
  for (const file of sheets(dir)) {
    for (const match of readFileSync(file, "utf8").matchAll(/\.(di-[A-Za-z0-9_-]+)/g)) found.add(match[1]);
  }
  return [...found].sort();
}

const current = { exports: exportsOf(entry), classes: classesOf(path.join("dist", "lib")) };

if (process.argv.includes("--write")) {
  writeFileSync(snapshot, JSON.stringify(current, null, 2) + "\n");
  console.log(`public-api.json: ${current.exports.length} exports, ${current.classes.length} class names`);
  process.exit(0);
}

const recorded = JSON.parse(readFileSync(snapshot, "utf8"));
let failed = false;
for (const key of ["exports", "classes"]) {
  const before = new Set(recorded[key]);
  const after = new Set(current[key]);
  const gone = recorded[key].filter((name) => !after.has(name));
  const added = current[key].filter((name) => !before.has(name));
  if (gone.length > 0 || added.length > 0) {
    failed = true;
    console.error(`${key} changed: removed ${JSON.stringify(gone)}, added ${JSON.stringify(added)}`);
  }
}
if (failed) {
  console.error(
    "the public API differs from scripts/public-api.json; run node scripts/check-api.mjs --write if that is intended",
  );
  process.exit(1);
}
console.log(`public API unchanged: ${current.exports.length} exports, ${current.classes.length} class names`);
