import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Panel } from "../../index";
import { Doc } from "../guide/Doc";
import { Swatch, type Paint } from "../guide/Swatch";
import { brokenTokenNames, Tile, Tiles } from "../guide/Tokens";

type Role = {
  title: string;
  tiles: { token: string; name: string; paint?: Paint; ground?: string; word?: string }[];
};

const roles: Role[] = [
  {
    title: "Surface",
    tiles: [
      { token: "--di-bg-chrome", name: "Sidebar" },
      { token: "--di-bg-page", name: "Page ground" },
      { token: "--di-bg-surface", name: "Panel, table, dialog" },
      { token: "--di-bg-subtle", name: "Inset group" },
      { token: "--di-bg-plane", name: "Menu, popover" },
      { token: "--di-bg-row-hover", name: "Row under the pointer" },
      { token: "--di-bg-readonly", name: "Read-only field" },
      { token: "--di-bg-disabled", name: "Disabled control" },
      { token: "--di-fill-strong", name: "The one filled button" },
    ],
  },
  {
    title: "Text",
    tiles: [
      { token: "--di-text", name: "Body and headings", paint: "ink" },
      { token: "--di-text-muted", name: "Secondary, labels", paint: "ink" },
      { token: "--di-text-subtle", name: "Meta, hints", paint: "ink" },
      { token: "--di-text-on-strong", name: "On the filled button", paint: "ink", ground: "--di-fill-strong" },
    ],
  },
  {
    title: "Edge",
    tiles: [
      { token: "--di-border", name: "Equal tones meet", paint: "line" },
      { token: "--di-border-input", name: "Field frame", paint: "line" },
      { token: "--di-border-strong", name: "Strong frame", paint: "line" },
      { token: "--di-rule", name: "Between rows", paint: "line" },
    ],
  },
  {
    title: "Selection",
    tiles: [
      { token: "--di-bg-selected", name: "Selected tint" },
      { token: "--di-select", name: "Selected edge", paint: "edge" },
      { token: "--di-focus", name: "Focus ring" },
    ],
  },
  {
    title: "Status",
    tiles: [
      { token: "--di-status-ok-bg", name: "Running", paint: "status", word: "ok" },
      { token: "--di-status-warn-bg", name: "Expiring", paint: "status", word: "warn" },
      { token: "--di-status-danger-bg", name: "Failed", paint: "status", word: "failed" },
      { token: "--di-status-recorded-bg", name: "Recorded", paint: "status", word: "sealed" },
      { token: "--di-status-neutral-bg", name: "Paused", paint: "status", word: "paused" },
      { token: "--di-severity-critical", name: "Critical" },
      { token: "--di-severity-high", name: "High" },
      { token: "--di-severity-medium", name: "Medium" },
      { token: "--di-severity-low", name: "Low" },
      { token: "--di-severity-info", name: "Info" },
    ],
  },
  {
    title: "Gold and accent",
    tiles: [
      { token: "--di-one", name: "The one object" },
      { token: "--di-one-edge", name: "Its edge" },
      { token: "--di-mark", name: "Record mark" },
      { token: "--di-seal", name: "Seal, brand only" },
      { token: "--di-highlight", name: "Poppy, brand pages" },
    ],
  },
  {
    title: "Charts",
    tiles: [
      { token: "--di-chart-series", name: "Series" },
      { token: "--di-chart-highlight", name: "The one value" },
      { token: "--di-chart-compare", name: "Comparison" },
      { token: "--di-chart-muted", name: "Muted bar" },
      { token: "--di-chart-band", name: "Range band" },
      { token: "--di-chart-routine", name: "Routine" },
      { token: "--di-chart-warn", name: "Past medium" },
      { token: "--di-chart-danger", name: "Past critical" },
    ],
  },
];

function ColorPage() {
  return (
    <Doc title="Color" lede="Each tile shows its token in light on the left, dark on the right.">
      {roles.map((role) => (
        <Panel key={role.title} title={role.title} heading={2}>
          <Tiles>
            {role.tiles.map(({ token, name, paint, ground, word }) => (
              <Tile
                key={token}
                token={token}
                name={name}
                drawing={<Swatch token={token} paint={paint} ground={ground} word={word} />}
              />
            ))}
          </Tiles>
        </Panel>
      ))}
    </Doc>
  );
}

const meta = {
  title: "Foundations/Color",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** Every role has its tiles, every tile names its token, and no token name wraps or leaves its tile. */
export const Color: StoryObj = {
  render: () => <ColorPage />,
  play: async ({ canvasElement }) => {
    const roleNames = Array.from(canvasElement.querySelectorAll("h2"), (h) => h.textContent);
    await expect(roleNames).toEqual(roles.map((r) => r.title));
    for (const tile of canvasElement.querySelectorAll<HTMLElement>(".di-doc-tile")) {
      await expect(tile.querySelector(".di-token-name")?.textContent).toBe(tile.dataset.token);
    }
    await expect(canvasElement.querySelectorAll(".di-doc-tile")).toHaveLength(
      roles.reduce((n, r) => n + r.tiles.length, 0),
    );
    await expect(brokenTokenNames(canvasElement)).toEqual([]);
  },
};
