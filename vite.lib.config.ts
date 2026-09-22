import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "unplugin-dts/vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: path.join(dirname, "tsconfig.build.json"),
    }),
  ],
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    cssCodeSplit: true,
    modulePreload: false,
    sourcemap: false,
    lib: {
      entry: path.join(dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external(id) {
        return id.endsWith(".css") || id === "react" || id === "react-dom" || id.startsWith("react/") || id === "lucide-react";
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
