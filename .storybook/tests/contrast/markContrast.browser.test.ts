import { afterEach, expect, test } from "vitest";
import { markContrast } from "./markContrast";

afterEach(() => {
  document.body.replaceChildren();
});

function fixture(html: string) {
  const host = document.createElement("div");
  host.style.cssText = "background: #fdfdfb; padding: 16px;";
  host.innerHTML = html;
  document.body.append(host);
  return host;
}

const lane = (fill: string, opacity = 1) => `
  <svg width="200" height="20">
    <g class="di-timeline-lanes"><g>
      <rect class="di-timeline-lane-track" width="200" height="10" style="fill: #eae9e4" />
      <path class="di-timeline-fill" d="M10 0h20v10h-20z" style="fill: ${fill}; fill-opacity: ${opacity}" />
    </g></g>
  </svg>`;

test("a critical lane cell washed out to a pastel fails against its track", () => {
  const [finding] = markContrast(fixture(lane("#b3161b", 0.44)));
  expect(finding).toMatchObject({ mark: ".di-timeline-lanes .di-timeline-fill", against: "#eae9e4" });
  expect(finding!.ratio).toBeLessThan(3);
});

test("the same cell at full strength passes", () => {
  expect(markContrast(fixture(lane("#b3161b")))).toEqual([]);
});

test("a mark is measured against the ground it sits on when no neighbour is listed", () => {
  const host = fixture(`
    <svg width="200" height="20"><line class="di-timeline-threshold" x1="0" x2="200" y1="10" y2="10" style="stroke: #fbe7cf" /></svg>`);
  const [finding] = markContrast(host);
  expect(finding).toMatchObject({ against: "#fdfdfb" });
});

test("a mark folded away is not measured", () => {
  const host = fixture(`<div style="height: 0; overflow: hidden">${lane("#f0e0e0")}</div>`);
  expect(markContrast(host)).toEqual([]);
});
