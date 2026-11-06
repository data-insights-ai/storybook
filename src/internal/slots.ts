import { Children, Fragment, isValidElement, type ElementType, type ReactNode } from "react";

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

/**
 * The children with every Fragment opened, at any depth, so slots written
 * inside `<>…</>` (or a list returned from a map) are found like direct ones.
 */
export function unwrapped(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment)
      out.push(...unwrapped(child.props.children));
    else out.push(child);
  });
  return out;
}
