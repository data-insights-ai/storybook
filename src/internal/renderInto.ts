import { cloneElement, type HTMLAttributes, type ReactElement } from "react";
import type { useRender } from "@base-ui/react/use-render";
import { cx } from "./cx";

type Props = HTMLAttributes<HTMLElement> & Record<string, unknown>;

/**
 * A `render` prop resolved as Base UI's `useRender` resolves it (the
 * element's own props win, class names join, both handlers run), for
 * `Button`: every bundle carries it, and Base UI's merge would triple it.
 */
export function renderInto(render: useRender.RenderProp, props: Props): ReactElement {
  if (typeof render === "function") return render(props, {});
  const own = render.props as Props;
  const merged: Props = { ...props, ...own, children: props.children };
  for (const key of Object.keys(own)) {
    const mine = props[key];
    const theirs = own[key];
    if (/^on[A-Z]/.test(key) && typeof mine === "function" && typeof theirs === "function") {
      merged[key] = (...args: unknown[]) => {
        theirs(...args);
        mine(...args);
      };
    }
  }
  merged.className = cx(props.className, own.className) || undefined;
  if (props.style || own.style) merged.style = { ...props.style, ...own.style };
  return cloneElement(render as ReactElement<Props>, merged);
}
