import { createElement, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderInto } from "./renderInto";

type Rendered = ReactElement<Record<string, unknown>>;

describe("renderInto", () => {
  it("keeps the element's own props, joins class names and runs both handlers", () => {
    const theirs = vi.fn();
    const mine = vi.fn();
    const link = createElement("a", { href: "/cases", className: "router", onClick: theirs });
    const out = renderInto(link, {
      className: "di-btn",
      href: "#ignored",
      onClick: mine,
      children: "Open",
    }) as Rendered;
    expect(out.props.href).toBe("/cases");
    expect(out.props.className).toBe("di-btn router");
    expect(out.props.children).toBe("Open");
    (out.props.onClick as () => void)();
    expect(theirs).toHaveBeenCalledOnce();
    expect(mine).toHaveBeenCalledOnce();
  });

  it("calls a render function with the props", () => {
    const out = renderInto((props) => createElement("a", props), { className: "di-btn" }) as Rendered;
    expect(out.props.className).toBe("di-btn");
  });
});
