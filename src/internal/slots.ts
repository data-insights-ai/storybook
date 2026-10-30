import { Children, isValidElement, type ElementType, type ReactNode } from "react";

/**
 * Splits `children` into the elements of `type` and the rest, so a frame can
 * place a named slot where its docs promise whatever order the caller wrote.
 */
export function takeSlot(children: ReactNode, type: ElementType): [ReactNode[], ReactNode[]] {
  const slot: ReactNode[] = [];
  const rest: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === type) slot.push(child);
    else rest.push(child);
  });
  return [slot, rest];
}
