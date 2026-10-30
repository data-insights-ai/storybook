import { describe, shown } from "./paint";

/**
 * Underline means clickable. Text drawn with an underline — a text
 * decoration, or a bottom border or inset shadow standing in for one under
 * inline text — must sit inside something a person can activate.
 */
const CLICKABLE =
  "a[href], button, summary, label[for], [role=link], [role=button], [role=tab], [role=menuitem], [role=option]";

function underlined(el: HTMLElement, style: CSSStyleDeclaration): string | null {
  if (style.textDecorationLine.includes("underline")) return "text-decoration";
  if (!style.display.startsWith("inline") || el.matches("input, select, textarea")) return null;
  const onlyBottom =
    parseFloat(style.borderBottomWidth) > 0 &&
    style.borderBottomStyle !== "none" &&
    parseFloat(style.borderTopWidth) === 0 &&
    parseFloat(style.borderLeftWidth) === 0;
  if (onlyBottom) return "border-bottom";
  if (/inset\s+0(px)?\s+-\d/.test(style.boxShadow)) return "inset shadow";
  return null;
}

export function underlineFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    if (!(el.textContent ?? "").trim() || !shown(el)) continue;
    const how = underlined(el, getComputedStyle(el));
    if (!how || el.closest(CLICKABLE)) continue;
    findings.push(
      `${describe(el)} "${el.textContent!.trim().slice(0, 40)}" is underlined (${how}) but cannot be clicked`,
    );
  }
  return findings;
}
