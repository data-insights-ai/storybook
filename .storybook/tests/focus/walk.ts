import { userEvent } from "vitest/browser";
import { ringFindings, type RingFinding } from "./findings";

const COMPOSITE =
  "[role=menu], [role=menubar], [role=listbox], [role=tablist], [role=radiogroup], [role=grid], [role=tree]";
const MAX_TABS = 60;
const MAX_ARROWS = 5;

const settled = async () => {
  const running = document
    .getAnimations()
    .filter((animation) => animation.playState === "running" && animation.effect?.getTiming().iterations !== Infinity);
  await Promise.race([
    Promise.all(running.map((animation) => animation.finished.catch(() => undefined))),
    new Promise((done) => setTimeout(done, 400)),
  ]);
};

/**
 * Where Tab starts: inside the open modal, which keeps focus, or at the top
 * of the page. A Base UI modal keeps focus with guards rather than
 * `aria-modal`, so an open dialog role counts as one too.
 */
const scope = () =>
  document.querySelector("dialog:modal") ??
  [...document.querySelectorAll("[aria-modal='true']:not(dialog), [role=dialog][data-open]:not(dialog)")]
    .reverse()
    .find((el) => el.getClientRects().length > 0) ??
  document.body;

const TABBABLE =
  "a[href], button, input, select, textarea, summary, iframe, [contenteditable=''], [contenteditable='true'], audio[controls], video[controls], [tabindex]";

/*
 * Whether Tab has anywhere to land in the scope: a tabbable control, or a scroller Chrome makes focusable. With
 * nowhere, Tab leaves the story's frame for the runner's page, which can detach the frame mid-step.
 */
const hasTabStop = (root: Element) =>
  [...root.querySelectorAll<HTMLElement>(TABBABLE)].some(
    (el) => el.tabIndex >= 0 && !el.matches(":disabled") && el.getClientRects().length > 0,
  ) ||
  [...root.querySelectorAll<HTMLElement>("*")].some((el) => {
    const { overflowX, overflowY } = getComputedStyle(el);
    return (
      (/auto|scroll/.test(overflowY) && el.scrollHeight > el.clientHeight) ||
      (/auto|scroll/.test(overflowX) && el.scrollWidth > el.clientWidth)
    );
  });

/**
 * Tab through the story with the real keyboard, as a person would, and step
 * with the arrows through each menu, list, tab row, radio group and grid
 * the Tab lands in, so the open popups and dialogs are walked too.
 */
export async function walkFocus(): Promise<RingFinding[]> {
  const seen = new Set<string>();
  const composites = new Set<Element>();
  const found = new Map<string, RingFinding>();

  const visit = async (): Promise<"new" | "seen" | "left"> => {
    await settled();
    const focused = document.activeElement;
    if (!focused || focused === document.body || !document.hasFocus()) return "left";
    const pointed = focused.getAttribute("aria-activedescendant");
    const target = pointed ? document.getElementById(pointed) : null;
    const key = `${elementKey(focused)}|${target ? elementKey(target) : ""}`;
    if (seen.has(key)) return "seen";
    seen.add(key);
    // A browser scrolls the control Tab lands on into view; a frame the runner never paints defers that.
    focused.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (focused.matches(":focus-visible"))
      for (const finding of ringFindings(focused)) found.set(JSON.stringify(finding), finding);
    return "new";
  };

  const arrows = async () => {
    const focused = document.activeElement;
    const composite = focused?.matches("[role=combobox]") ? focused : focused?.closest(COMPOSITE);
    if (!composite || composites.has(composite)) return;
    composites.add(composite);
    const key =
      composite.matches("[role=tablist], [role=menubar]") || composite.getAttribute("aria-orientation") === "horizontal"
        ? "{ArrowRight}"
        : "{ArrowDown}";
    for (let i = 0; i < MAX_ARROWS; i++) {
      await userEvent.keyboard(key);
      if ((await visit()) !== "new") break;
    }
  };

  const tabs = async () => {
    for (let i = 0; i < MAX_TABS; i++) {
      await userEvent.keyboard("{Tab}");
      if ((await visit()) !== "new") return;
      await arrows();
    }
  };

  if (document.activeElement && document.activeElement !== document.body) {
    await visit();
    await arrows();
    await tabs();
  }
  if (!hasTabStop(scope())) return [...found.values()];
  const start = document.createElement("span");
  start.tabIndex = -1;
  scope().prepend(start);
  window.focus();
  start.focus();
  await userEvent.keyboard("{Tab}");
  start.remove();
  if ((await visit()) === "new") {
    await arrows();
    await tabs();
  }
  return [...found.values()];
}

const ids = new WeakMap<Element, number>();
let next = 0;
function elementKey(el: Element) {
  if (!ids.has(el)) ids.set(el, next++);
  return String(ids.get(el));
}
