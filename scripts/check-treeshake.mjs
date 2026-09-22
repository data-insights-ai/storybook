import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "vite";

function filesUnder(dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) found.push(...filesUnder(file));
    else found.push(file);
  }
  return found;
}

const root = mkdtempSync(path.join(tmpdir(), "di-shake-"));
const entry = path.join(root, "entry.js");
writeFileSync(entry, `export { Button } from "@data-insights-ai/ui";\n`);

try {
  await build({
    configFile: false,
    root,
    logLevel: "silent",
    resolve: {
      alias: {
        "@data-insights-ai/ui": path.resolve("dist/lib/index.js"),
      },
    },
    build: {
      outDir: path.join(root, "out"),
      emptyOutDir: true,
      minify: false,
      cssCodeSplit: false,
      modulePreload: false,
      lib: {
        entry,
        formats: ["es"],
        fileName: "app",
      },
      rollupOptions: {
        external(id) {
          return id.endsWith(".css") || id === "react" || id === "react-dom" || id.startsWith("react/") || id === "lucide-react";
        },
      },
    },
  });
  const files = filesUnder(path.join(root, "out")).filter((file) => file.endsWith(".mjs") || file.endsWith(".js"));
  if (files.length !== 1) {
    console.error("expected one app bundle", filesUnder(path.join(root, "out")));
    process.exit(1);
  }
  const js = readFileSync(files[0], "utf8");
  const forbidden = ["SignIn", "ConsoleFrame", "DataTable", "Pagination", "lucide-react"];
  const found = forbidden.filter((name) => js.includes(name));
  if (found.length > 0 || !js.includes("Button") || js.length > 8000) {
    console.error(`tree-shake failed (${js.length} bytes)`, found);
    process.exit(1);
  }
  console.log(`tree-shake ok, Button bundle ${js.length} bytes`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
