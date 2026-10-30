import type React from "react";
import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { composeStories } from "@storybook/react-vite";
import "../../styles/styles.css";

/*
 * The chart motion rule: no series is drawn in, solid or dashed. After
 * mount the only animation allowed is the plot's opacity fade (120ms), and
 * every mark has its final shape from the first frame: a dashed reference
 * line (a marker, a selection) is there with the data, never after it.
 */
const modules = import.meta.glob<Parameters<typeof composeStories>[0]>(
  [
    "./**/*.stories.tsx",
    "../status/LevelMeter/LevelMeter.stories.tsx",
    "../../screens/overview/SecurityOverview.stories.tsx",
    "../../foundations/tokens/Color.stories.tsx",
  ],
  { eager: true },
);

let root: Root | undefined;
afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function shapes() {
  return Array.from(document.querySelectorAll("svg path, svg rect, svg line, .di-sparkline-bar, [class*='-bar']")).map(
    (el) =>
      [
        el.getAttribute("d"),
        el.getAttribute("width"),
        el.getAttribute("height"),
        el.getAttribute("x1"),
        el.getAttribute("x2"),
        el.getAttribute("stroke-dasharray"),
        (el as HTMLElement).style?.height,
      ].join("|"),
  );
}

/* Every chart again in compact density, where its sizes come from the compact tokens. */
const cases = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(composeStories(mod)).flatMap(([name, Story]) =>
    (["comfortable", "compact"] as const).map(
      (density) =>
        [`${file.replace(/^.*\//, "")} ${name} (${density})`, Story as () => React.ReactElement, density] as const,
    ),
  ),
);

test.each(cases)("%s draws no series in", async (_, Story, density) => {
  document.documentElement.setAttribute("data-density", density);
  const host = document.createElement("div");
  host.style.width = "720px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(<Story />));
  await new Promise((r) => setTimeout(r, 60));
  const first = shapes();
  const moving = document
    .getAnimations()
    .filter((a) => !(a instanceof CSSAnimation && a.animationName === "di-chart-in"))
    // The tooltip follows the pointer; it is not a series.
    .filter(
      (a) => !((a.effect as KeyframeEffect | null)?.target as Element | null)?.closest?.(".recharts-tooltip-wrapper"),
    )
    .map((a) =>
      a instanceof CSSAnimation ? a.animationName : a instanceof CSSTransition ? a.transitionProperty : "script",
    );
  const fades = document
    .getAnimations()
    .filter((a) => a instanceof CSSAnimation && a.animationName === "di-chart-in")
    .map((a) => a.effect?.getTiming().duration);
  await new Promise((r) => setTimeout(r, 400));
  expect(fades.every((duration) => duration === 120)).toBe(true);
  expect(moving).toEqual([]);
  expect(shapes()).toEqual(first);
});
