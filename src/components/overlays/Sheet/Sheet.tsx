import type { ReactNode } from "react";
import { Dialog, DialogFooter } from "../Dialog";

/**
 * A record or a form beside the list, from the right edge.
 *
 * @deprecated Removed in 0.12: use `Dialog`, whose default `placement="side"`
 * is this sheet, docking included. The props are the same; `SheetFooter` is
 * `DialogFooter`.
 */
export function Sheet(props: {
  open: boolean;
  onClose: () => void;
  title: string;
  lede?: string;
  eyebrow?: string;
  closeLabel: string;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}) {
  return <Dialog {...props} placement="side" />;
}

/** @deprecated Removed in 0.12: use `DialogFooter`. */
export const SheetFooter = DialogFooter;
