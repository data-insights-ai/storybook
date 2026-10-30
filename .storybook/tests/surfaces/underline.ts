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

/**
 * The trailing → or ↗ of an action link (`TextLink trail`) belongs at a
 * block's edge, never in running text: the link is the only text of the
 * block that holds it.
 */
export function trailFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const mark of root.querySelectorAll<HTMLElement>(".di-textlink-trail")) {
    const link = mark.closest<HTMLElement>("a, button");
    if (!link || !shown(link)) continue;
    let block = link.parentElement;
    while (block && getComputedStyle(block).display.startsWith("inline")) block = block.parentElement;
    if (!block) continue;
    const own = (link.textContent ?? "").trim();
    if ((block.textContent ?? "").trim() !== own)
      findings.push(`${describe(link)} "${own.slice(0, 40)}" carries a trailing mark inside running text`);
  }
  return findings;
}
