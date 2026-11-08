import { useSyncExternalStore } from "react";

export type ToastMessage = {
  title: string;
  body?: string;
  auditId?: string;
  /** One follow-up, such as “View record”. Never an undo. */
  action?: { label: string; onClick: () => void };
  /** A file the action produced, offered for download. */
  download?: { label: string; href: string };
};

type Shown = ToastMessage & { id: number };

const visibleMs = 6000;
const listeners = new Set<() => void>();
let current: Shown | undefined;
let next = 1;
let timer: ReturnType<typeof setTimeout> | undefined;
let held = false;

function emit() {
  for (const listener of listeners) listener();
}

function schedule() {
  clearTimeout(timer);
  timer = current && !held ? setTimeout(dismissToast, visibleMs) : undefined;
}

/**
 * Shows a receipt; a new one replaces the one shown. Callable outside React,
 * from a mutation's success.
 */
export function toast(message: ToastMessage) {
  current = { ...message, id: next++ };
  schedule();
  emit();
}

export function dismissToast() {
  current = undefined;
  schedule();
  emit();
}

/** While the reader points at or focuses the receipt it stays (WCAG 2.2.1). */
export function holdToast(hold: boolean) {
  held = hold;
  schedule();
}

export function useCurrentToast(): Shown | undefined {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => undefined,
  );
}
