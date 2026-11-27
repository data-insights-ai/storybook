import { useLayoutEffect, type RefObject } from "react";

// A combo box's list is a popup, not a modal (WAI-ARIA combobox pattern): the page around it stays in the
// accessibility tree. Base UI's combobox popup, whose input stands outside it, runs its focus manager as a modal
// and sets aria-hidden on everything beside the input, the popup and each `[aria-live]` region while the list is
// open; no prop turns that off, and a patch of the dependency would not reach a product. So while the list is open
// this takes back each aria-hidden newly set on an element whose parent holds the input or a live region, the only
// elements that hiding marks. The page's own aria-hidden stays: what was hidden before the list opened, and an
// icon's, whose parent holds neither. A modal that opened over an open list (a Base UI Drawer) would lose its
// hiding too while the list stays open; focus moving into the modal closes the list first.
export function useListKeepsPage(input: RefObject<HTMLElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const field = input.current;
    if (!open || !field) return;
    const body = field.ownerDocument.body;
    const before = new Set(body.querySelectorAll('[aria-hidden]:not([aria-hidden="false"])'));
    const observer = new MutationObserver((records) => {
      const kept = [field, ...body.querySelectorAll("[aria-live]")];
      for (const { target } of records) {
        if (!(target instanceof Element) || before.has(target) || target.getAttribute("aria-hidden") !== "true") {
          continue;
        }
        const parent = target.parentElement;
        if (parent && kept.some((node) => parent.contains(node) && !target.contains(node))) {
          target.removeAttribute("aria-hidden");
        }
      }
    });
    // Set up in a layout effect, before the popup's own effect hides the page.
    observer.observe(body, { attributes: true, subtree: true, attributeFilter: ["aria-hidden"] });
    return () => observer.disconnect();
  }, [input, open]);
}
