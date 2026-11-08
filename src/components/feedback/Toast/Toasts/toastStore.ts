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
let heldId: number | undefined;

function emit() {
  for (const listener of listeners) listener();
}

function schedule() {
  clearTimeout(timer);
  timer = current && heldId !== current.id ? setTimeout(dismissToast, visibleMs) : undefined;
}

/**
 * Shows a receipt; a new one replaces the one shown. Callable outside React,
 * from a mutation's success.
 */
export function toast(message: ToastMessage) {
  current = { ...message, id: next++ };
  heldId = undefined;
  schedule();
  emit();
}

export function dismissToast() {
  current = undefined;
  heldId = undefined;
  schedule();
  emit();
}

/** While the reader points at or focuses receipt `id` it stays (WCAG 2.2.1); a word about an older receipt changes nothing. */
export function holdToast(id: number, hold: boolean) {
  if (current?.id !== id) return;
  heldId = hold ? id : undefined;
  schedule();
}

export const currentToast = (): Shown | undefined => current;

export function useCurrentToast(): Shown | undefined {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    currentToast,
    () => undefined,
  );
}
