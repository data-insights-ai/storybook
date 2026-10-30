import { afterEach, expect, test } from "vitest";
import { visibleContrast } from "./visibleContrast";

afterEach(() => {
  document.body.replaceChildren();
});

function fixture(html: string) {
  const host = document.createElement("div");
  host.style.cssText = "background: #ffffff; padding: 16px; font: 16px sans-serif;";
  host.innerHTML = html;
  document.body.append(host);
  return host;
}

test("gradient-filled SVG text cannot be measured, so it fails", async () => {
  const host = fixture(`
    <svg width="240" height="40">
      <defs><linearGradient id="g"><stop offset="0" stop-color="#000" /><stop offset="1" stop-color="#fff" /></linearGradient></defs>
      <text x="0" y="24" fill="url(#g)">Gradient label</text>
    </svg>`);
  const [finding] = await visibleContrast(host);
  expect(finding?.text).toBe("Gradient label");
  expect(finding?.reason).toMatch(/gradient/);
});

test("text the hit test never reaches fails loudly instead of being skipped", async () => {
  const host = fixture(`<span style="display: inline-block; clip-path: inset(0 0 0 100%);">Clipped away</span>`);
  const [finding] = await visibleContrast(host);
  expect(finding?.text).toBe("Clipped away");
  expect(finding?.reason).toMatch(/not what is hit/);
});

test("a semi-transparent layer painted over the text counts", async () => {
  const host = fixture(`
    <div style="position: relative; width: 240px;">
      <span style="color: #000000;">Under a veil</span>
      <div style="position: absolute; inset: 0; background: rgba(255, 255, 255, 0.8);"></div>
    </div>`);
  const [finding] = await visibleContrast(host);
  expect(finding).toMatchObject({ text: "Under a veil", foreground: "#cccccc", background: "#ffffff" });
  expect(finding!.ratio).toBeLessThan(2);
});

test("every point across the line counts, not only the centre", async () => {
  const host = fixture(`
    <div style="position: relative; width: 320px;">
      <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 40px; background: #000000;"></div>
      <span style="position: relative; color: #222222;">Dark text over black, then over white</span>
    </div>`);
  const [finding] = await visibleContrast(host);
  expect(finding).toMatchObject({ foreground: "#222222", background: "#000000" });
  expect(finding!.ratio).toBeLessThan(1.5);
});

test("an SVG line paints only its stroke: no default black fill under the text", async () => {
  const host = fixture(`
    <div style="position: relative; display: flex; justify-content: center; width: 240px; height: 40px;">
      <svg width="240" height="40" style="position: absolute; inset: 0;">
        <line x1="120" y1="0" x2="120" y2="40" stroke="#ffffff" stroke-width="4" />
      </svg>
      <span style="position: relative; line-height: 40px; color: #787878;">Grey text across a line</span>
    </div>`);
  const [finding] = await visibleContrast(host);
  expect(finding).toMatchObject({ foreground: "#787878", background: "#ffffff", ratio: 4.41 });
});

test("text over an SVG image cannot be measured, so it fails", async () => {
  const pixel = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#888"/></svg>');
  const host = fixture(`
    <div style="position: relative; width: 240px; height: 40px;">
      <svg width="240" height="40" style="position: absolute; inset: 0;">
        <image href="${pixel}" width="240" height="40" preserveAspectRatio="none" />
      </svg>
      <span style="position: relative; line-height: 40px; color: #000000;">Text on a picture</span>
    </div>`);
  const [finding] = await visibleContrast(host);
  expect(finding?.reason).toMatch(/image/);
});

test("readable text passes, and hidden text is not measured", async () => {
  const host = fixture(`
    <p style="color: #0a1f44;">Navy on white</p>
    <p style="display: none; color: #eeeeee;">Not shown</p>
    <p class="di-sr" style="color: #eeeeee;">Screen reader only</p>
    <button disabled style="color: #dddddd;">Inactive</button>`);
  expect(await visibleContrast(host)).toEqual([]);
});
