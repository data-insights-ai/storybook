import { addons } from "storybook/manager-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { brandTheme, palette, resolveMode, type Mode } from "./theme";

let mode: Mode | undefined;

function apply(next: Mode) {
  if (next === mode) return;
  mode = next;
  const c = palette[next];
  const root = document.documentElement;
  root.dataset.diTheme = next;
  root.style.setProperty("--sb-di-raised", c.raised);
  root.style.setProperty("--sb-di-select", c.select);
  root.style.setProperty("--sb-di-text", c.text);
  root.style.setProperty("--sb-di-subtle", c.subtle);
  root.style.setProperty("--sb-di-hover", c.hover);
  addons.setConfig({ theme: brandTheme(next) });
}

apply(resolveMode(undefined));

addons.register("di/theme", (api) => {
  let chosen: unknown;
  const follow = ({ globals }: { globals?: Record<string, unknown> }) => {
    chosen = globals?.theme;
    apply(resolveMode(chosen));
    api.setOptions({ theme: brandTheme(mode ?? "light") });
  };
  api.on(SET_GLOBALS, follow);
  api.on(GLOBALS_UPDATED, follow);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    apply(resolveMode(chosen));
    api.setOptions({ theme: brandTheme(mode ?? "light") });
  });
});
