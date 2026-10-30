import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

/*
 * The structure dependency-cruiser cannot see (AGENTS.md, "Structure"): every story
 * meta carries one layer tag and no module imports a higher layer; a story file, its
 * folder and its meta component share one name, and its title mirrors its folder; a
 * module is one sidebar entry (its slots stay with it); every public component is
 * rendered in a story (as JSX or as its meta component) and has a doc comment; every
 * title's group is one storySort lists; no two concept folders import each other.
 */
const layers = ["foundation", "primitive", "form", "block", "pattern", "screen"];
const isStory = (f) => f.endsWith(".stories.tsx");
const isTest = (f) => /\.(test|browser\.test)\.tsx?$/.test(f);
const isSample = (f) => /\.sample\.tsx?$/.test(f);

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return files(file);
    return /\.tsx?$/.test(name) && !name.endsWith(".d.ts") ? [file] : [];
  });
}

function parse(file) {
  return ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function resolve(from, spec) {
  if (!spec.startsWith(".")) return undefined;
  const base = path.normalize(path.join(path.dirname(from), spec));
  for (const ext of ["", ".tsx", ".ts", "/index.ts", "/index.tsx"]) {
    if (existsSync(base + ext) && statSync(base + ext).isFile()) return base + ext;
  }
  return undefined;
}

/** Relative imports of a module: the module each named import comes from. */
function importsOf(sf) {
  const out = [];
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) && !ts.isExportDeclaration(st)) continue;
    const spec = st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) ? st.moduleSpecifier.text : undefined;
    const target = spec && resolve(sf.fileName, spec);
    if (!target || target.endsWith(".css")) continue;
    const names = [];
    const bindings = ts.isImportDeclaration(st) ? st.importClause?.namedBindings : undefined;
    if (bindings && ts.isNamedImports(bindings)) bindings.elements.forEach((e) => names.push(e.name.text));
    out.push({ target, names });
  }
  return out;
}

const pascal = (name) => /^[A-Z]/.test(name);
const exported = (node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
const documented = (node, sf) =>
  (ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? []).some((r) => sf.text.startsWith("/**", r.pos));

/** Exported components of a module: PascalCase functions, and consts bound to a function or a call. */
/* A deprecated name only waits for its removal; its story is its replacement's. */
const deprecated = (st) => ts.getJSDocTags(st).some((t) => t.tagName.text === "deprecated");

function componentsOf(sf) {
  const out = [];
  for (const st of sf.statements) {
    if (!exported(st)) continue;
    if (ts.isFunctionDeclaration(st) && st.name && pascal(st.name.text))
      out.push({ name: st.name.text, doc: documented(st, sf), deprecated: deprecated(st) });
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        const init = d.initializer;
        const callable =
          init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init) || ts.isCallExpression(init));
        if (ts.isIdentifier(d.name) && pascal(d.name.text) && callable)
          out.push({ name: d.name.text, doc: documented(st, sf), deprecated: deprecated(st) });
      }
    }
  }
  return out;
}

/** Names a story renders as JSX elements. */
function jsxNames(sf) {
  const names = new Set();
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) names.add(node.tagName.getText(sf));
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return names;
}

/** The sidebar's top-level sections, in the order storySort lists them. */
function storySortSections() {
  const preview = readFileSync(path.join(".storybook", "preview.tsx"), "utf8");
  const list = preview.match(/const sections = \[([^\]]*)\]/);
  if (!list) throw new Error(".storybook/preview.tsx no longer lists its sections in `const sections = [...]`");
  return [...list[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** A story file's meta: title, tags and the module its component comes from. */
function metaOf(sf) {
  let literal;
  const visit = (node) => {
    if (literal) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "meta" && node.initializer) {
      let init = node.initializer;
      while (ts.isSatisfiesExpression(init) || ts.isAsExpression(init)) init = init.expression;
      if (ts.isObjectLiteralExpression(init)) literal = init;
    }
    if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) literal = node.expression;
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!literal) return undefined;
  const prop = (name) =>
    literal.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === name)?.initializer;
  const title = prop("title");
  const tags = prop("tags");
  const component = prop("component");
  return {
    title: title && ts.isStringLiteral(title) ? title.text : undefined,
    tags: tags && ts.isArrayLiteralExpression(tags) ? tags.elements.filter(ts.isStringLiteral).map((e) => e.text) : [],
    component: component && ts.isIdentifier(component) ? component.text : undefined,
  };
}

const all = files("src");
const parsed = new Map(all.map((f) => [f, parse(f)]));
const modules = all.filter((f) => !isStory(f) && !isTest(f) && !isSample(f));
const findings = [];
const find = (check, text) => findings.push(`${check}: ${text}`);

// Story metas: one layer tag; file, folder and component share a name; the title mirrors the folder.
const layerOfModule = new Map();
const storied = new Set();
const metaComponents = new Map();
const shown = new Set();
// Titled for their final group already; their folders move in the one final move step.
const MOVING = new Set(["src/components/charts/compare/LevelMeter/LevelMeter.stories.tsx"]);
const titles = [];
for (const file of all.filter(isStory)) {
  const meta = metaOf(parsed.get(file));
  const rendered = jsxNames(parsed.get(file));
  if (meta?.component) rendered.add(meta.component);
  for (const i of importsOf(parsed.get(file))) {
    for (const module of reexported(i.target))
      i.names.filter((n) => rendered.has(n)).forEach((n) => shown.add(`${module}#${n}`));
  }
  if (!meta?.title) continue;
  titles.push([file, meta.title]);
  const tagged = meta.tags.filter((t) => t.startsWith("layer:")).map((t) => t.slice(6));
  if (tagged.length !== 1 || !layers.includes(tagged[0]))
    find("layer-tag", `${file} carries ${tagged.length ? tagged.join(", ") : "no layer tag"}`);
  if (!meta.component) continue;
  const inComponents = file.split(path.sep).join("/").startsWith("src/components/");
  const name = path.basename(file, ".stories.tsx");
  if (inComponents && name !== meta.component) find("story-name", `${file} renders ${meta.component}`);
  if (inComponents && path.basename(path.dirname(file)) !== meta.component)
    find("component-folder", `${meta.component} is not in a folder of its own (${path.dirname(file)})`);
  const rel = path.relative(path.join("src", "components"), path.dirname(file)).split(path.sep);
  if (!rel[0].startsWith("..")) {
    const folders = rel.at(-1) === meta.component ? rel.slice(0, -1) : rel;
    const wanted = [...folders, meta.component].map((s) => s.toLowerCase()).join("/");
    const got = meta.title
      .split("/")
      .map((s) => s.toLowerCase().replaceAll(" ", ""))
      .join("/");
    if (got !== wanted && !MOVING.has(file.split(path.sep).join("/")))
      find("title-path", `${file} is titled ${meta.title}, its folder says ${wanted}`);
  }
  const source = importsOf(parsed.get(file)).find((i) => i.names.includes(meta.component));
  if (!source) continue;
  storied.add(`${source.target}#${meta.component}`);
  if (!metaComponents.has(source.target)) metaComponents.set(source.target, new Set());
  metaComponents.get(source.target).add(meta.component);
  const rank = layers.indexOf(tagged[0]);
  const before = layerOfModule.get(source.target);
  if (rank >= 0 && (before === undefined || rank > before)) layerOfModule.set(source.target, rank);
}

// Every top-level group is one storySort sorts; an unlisted one falls to the end of the sidebar.
const walkMdx = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const f = path.join(dir, n);
    return statSync(f).isDirectory() ? walkMdx(f) : n.endsWith(".mdx") ? [f] : [];
  });
for (const file of walkMdx("src")) {
  const title = readFileSync(file, "utf8").match(/<Meta[^>]*title="([^"]+)"/)?.[1];
  if (title) titles.push([file, title]);
}
const sections = storySortSections();
for (const [file, title] of titles) {
  if (!sections.includes(title.split("/")[0]))
    find("sidebar-section", `${file} is titled ${title}, whose group storySort does not list`);
}

// Layer direction, one component per module, folder cycles.
const folderEdges = new Map();
for (const file of modules) {
  const sf = parsed.get(file);
  for (const { target } of importsOf(sf)) {
    const from = layerOfModule.get(file);
    const to = layerOfModule.get(target);
    if (from !== undefined && to !== undefined && to > from)
      find("layer-direction", `${file} (${layers[from]}) imports ${target} (${layers[to]})`);
    const [fa, fb] = [file, target].map((f) => path.relative(path.join("src", "components"), f).split(path.sep)[0]);
    if (!fa.startsWith("..") && !fb.startsWith("..") && fa !== fb && !fa.includes(".") && !fb.includes(".")) {
      if (!folderEdges.has(fa)) folderEdges.set(fa, new Set());
      folderEdges.get(fa).add(fb);
    }
  }
  const entries = [...(metaComponents.get(file) ?? [])].sort();
  if (entries.length > 1) find("one-component-per-module", `${file} holds ${entries.join(", ")}`);
}
const reach = (a, b, seen = new Set()) =>
  [...(folderEdges.get(a) ?? [])].some((n) => n === b || (!seen.has(n) && seen.add(n) && reach(n, b, seen)));
for (const [a, targets] of folderEdges) {
  for (const b of targets)
    if (a < b && reach(b, a)) find("folder-cycle", `components/${a} and components/${b} import each other`);
}

/** The modules a module's exports come from: itself, and whatever an index.ts re-exports. */
function reexported(file) {
  const sf = parsed.get(file);
  if (!sf) return [file];
  const from = sf.statements
    .filter((st) => ts.isExportDeclaration(st) && st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier))
    .map((st) => resolve(file, st.moduleSpecifier.text))
    .filter(Boolean);
  return [file, ...from.flatMap(reexported)];
}

// Every public component has a story (its own, or its parent's when it is a slot) and a doc comment.
const entry = parse(path.join("src", "index.ts"));
for (const st of entry.statements) {
  if (!ts.isExportDeclaration(st) || st.isTypeOnly || !st.exportClause || !ts.isNamedExports(st.exportClause)) continue;
  const components = new Map();
  for (const module of reexported(resolve(entry.fileName, st.moduleSpecifier.text))) {
    for (const c of componentsOf(parsed.get(module))) components.set(c.name, { ...c, module });
  }
  for (const el of st.exportClause.elements) {
    const c = components.get(el.name.text);
    if (!c) continue;
    if (!c.deprecated && !shown.has(`${c.module}#${c.name}`))
      find("public-story", `${c.name} (${c.module}) has no story`);
    if (!c.doc) find("public-doc", `${c.name} (${c.module}) has no doc comment`);
  }
}

findings.sort();
for (const f of findings) console.error(f);
console.log(`structure: ${findings.length} findings`);
process.exit(findings.length ? 1 : 0);
