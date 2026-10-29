import { useEffect } from "react";
import { editable } from "./useShortcut";

/*
 * One scheme on every page, driven by the page itself: the first visible
 * control marked `data-di-shortcut` answers its key — `/` focuses the
 * search, `n` presses the primary create action, `e` the first section's
 * Edit. Nothing to bind per page; a control that carries the mark is
 * reachable, and the help overlay lists exactly those.
 */
const pageKeys = new Set(["/", "n", "e"]);

export function blockedByDialog() {
  return document.querySelector('dialog[open], [aria-modal="true"]:not(dialog)') !== null;
}

function visible(el: Element) {
  return el.getClientRects().length > 0 && el.closest("[inert], [hidden]") === null;
}

export function shortcutTarget(key: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-di-shortcut="${CSS.escape(key)}"]`);
  return Array.from(all).find(visible) ?? null;
}

function onKeyDown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
  if (!pageKeys.has(event.key) || editable(event.target) || blockedByDialog()) return;
  const target = shortcutTarget(event.key);
  if (!target) return;
  event.preventDefault();
  if (target instanceof HTMLInputElement) target.focus();
  else {
    target.focus({ preventScroll: true });
    target.click();
  }
}

let users = 0;

/** Listens for the page keys while a marked control is mounted. */
export function useShortcutKeys(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (users++ === 0) window.addEventListener("keydown", onKeyDown);
    return () => {
      if (--users === 0) window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);
}

/** What a marked control is called, without its key hint. */
export function shortcutLabel(el: HTMLElement): string {
  const named = el.getAttribute("aria-label") ?? (el instanceof HTMLInputElement ? el.labels?.[0]?.textContent : null);
  if (named) return named.trim();
  const copy = el.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("kbd").forEach((k) => k.remove());
  return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
}

const fields =
  'input:not([type="hidden"]):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]):not([readonly])';

/** Focuses the first field a reader fills in; false when there is none. */
export function focusFirstField(root: ParentNode | null): boolean {
  if (!root) return false;
  const field = Array.from(root.querySelectorAll<HTMLElement>(fields)).find(
    (el) => visible(el) && el.closest("[data-di-no-autofocus]") === null,
  );
  field?.focus({ preventScroll: true });
  return field !== undefined;
}
