import { expect } from "storybook/test";

/**
 * Scrolled to the end, the page's last section ends at least 16px above the unsaved-changes band, the band sits
 * on the window's foot beside the sidebar, and the sidebar's column runs the page's full height.
 */
export async function expectEndClearOfFootBand(bar: HTMLElement) {
  const doc = bar.ownerDocument;
  const page = doc.documentElement;
  page.scrollTop = page.scrollHeight;
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  const band = bar.getBoundingClientRect();
  const sections = [...doc.querySelectorAll("main section")].filter((section) => !bar.contains(section));
  const lastBottom = Math.max(...sections.map((section) => section.getBoundingClientRect().bottom));
  await expect(Math.round(band.bottom)).toBe(innerHeight);
  await expect(lastBottom).toBeLessThanOrEqual(band.top - 16);
  const sidebar = doc.querySelector(".di-sb:not(.di-sb-drawer)");
  if (sidebar) {
    const column = sidebar.getBoundingClientRect();
    await expect(Math.round(band.left)).toBe(Math.round(column.right));
    await expect(column.height).toBeGreaterThanOrEqual(page.scrollHeight - 1);
  }
  page.scrollTop = 0;
}
