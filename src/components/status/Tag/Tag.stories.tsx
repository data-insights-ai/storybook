import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Toolbar, ToolbarEnd } from "../../actions/Toolbar";
import { Panel } from "../../layout/page/Panel";
import { Tag, TagList } from "./Tag";
import { onPanel } from "../../../../.storybook/onPanel";
import { separatorsAtLineStart } from "../../../../.storybook/tests/lineStart";

const meta = {
  title: "Status/Tag",
  component: Tag,
  tags: ["layer:primitive", "autodocs"],
  args: { children: "Workspace admin" },
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** a name in a small frame: a role someone holds, a version, a filter narrowing a list.",
          "**When to use:** roles and groups in a table cell or a record; a version or a hash (`mono`); the filters set on a list, each removable, and the ones on offer (`onClick`). **When not to:** a state a machine reports is a `StatusPill`; a count on a tab or a button is a `Badge`; a severity is a `SeverityMark`; choosing one of a few views is a `ChoiceGroup`.",
          "**Anatomy:** an optional leading icon or the inferred ring, the name, an optional muted `detail`, an optional remove button. `TagList` sets tags side by side and, with `max`, folds the rest into one “+N more”.",
          "**Variants:** `mono` for what a machine named (`v4.18.2`, `severity: high`); `pressed` for a set filter (the selection tint inside a cornflower edge); `inferred` for a tag a model proposed (the hollow ring).",
          "**States:** static, pressable (`onClick`, with `pressed` it announces a toggle), removable (`onRemove`). A pressable or removable tag is as tall as a small button.",
          "**Content rules:** one or two words; a filter reads `key: value`; `detail` is the scope, not a sentence. `removeLabel` names what is dropped (“Remove the severity filter”).",
          "**Accessibility:** a static tag is text. `onClick` makes it a button (`aria-pressed` with `pressed`); the remove button is its own button named by `removeLabel`. On touch both have a 40px hit area.",
        ].join("\n\n"),
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Roles a person holds, each with its scope muted after the name. */
export const Grants: Story = {
  decorators: [onPanel("Roles of Nora Feld")],
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <TagList>
        <Tag detail="whole organization">Organization admin</Tag>
        <Tag detail="Production">Workspace admin</Tag>
        <Tag detail="Vienna branch">Analyst</Tag>
      </TagList>
    </div>
  ),
};

/** The filters on a list, in its toolbar: set ones carry the selection tint and a way out, offered ones a plus. */
export const Filters: Story = {
  decorators: [onPanel("Signals")],
  args: { onRemove: fn(), onClick: fn() },
  render: (args) => <FilterRow onRemove={args.onRemove} onClick={args.onClick} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Remove the severity filter" }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "source" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Remove the window filter" }));
    await expect(canvas.queryByText("window: 24h")).toBeNull();
  },
};

function FilterRow({ onRemove, onClick }: { onRemove?: () => void; onClick?: () => void }) {
  const [window, setWindow] = useState(true);
  return (
    <Toolbar>
      <TagList>
        <Tag mono pressed onRemove={onRemove} removeLabel="Remove the severity filter">
          severity: high
        </Tag>
        {window ? (
          <Tag mono pressed onRemove={() => setWindow(false)} removeLabel="Remove the window filter">
            window: 24h
          </Tag>
        ) : null}
        <Tag mono onClick={onClick}>
          <Plus aria-hidden />
          source
        </Tag>
        <Tag mono onClick={onClick}>
          <Plus aria-hidden />
          operator
        </Tag>
      </TagList>
      <ToolbarEnd>
        <Button variant="secondary" size="sm">
          Clear filters
        </Button>
      </ToolbarEnd>
    </Toolbar>
  );
}

/** A filter that toggles in place is a pressed button. */
export const Toggle: Story = {
  decorators: [onPanel("Cases")],
  render: () => <ToggleTag />,
  play: async ({ canvasElement }) => {
    const tag = within(canvasElement).getByRole("button", { name: "only open" });
    await expect(tag).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(tag);
    await expect(tag).toHaveAttribute("aria-pressed", "true");
  },
};

function ToggleTag() {
  const [on, setOn] = useState(false);
  return (
    <Tag mono pressed={on} onClick={() => setOn(!on)}>
      only open
    </Tag>
  );
}

/** A version and a build beside the product's name: names, not states. */
export const Version: Story = {
  decorators: [onPanel("Collector on ws-vie-014")],
  render: () => (
    <TagList>
      <Tag mono>v4.18.2</Tag>
      <Tag mono>build 7f3a99e</Tag>
    </TagList>
  ),
};

/** A scope a model proposed carries the ring until someone takes it. */
export const Inferred: Story = {
  decorators: [onPanel("Proposed scope")],
  args: { onClick: fn() },
  render: (args) => (
    <TagList>
      <Tag mono pressed onRemove={fn()} removeLabel="Remove the workspace scope">
        workspace: WS-01
      </Tag>
      <Tag mono inferred onClick={args.onClick}>
        source: firewall
      </Tag>
    </TagList>
  ),
};

/** In a table cell: two tags on one line, the rest behind "+N more". */
export const Compact: Story = {
  decorators: [onPanel("Members")],
  render: () => (
    <div style={{ width: 360, maxWidth: "100%" }}>
      <TagList max={2} moreLabel={(n) => `+${n} more`} onMore={() => undefined}>
        <Tag detail="whole organization">Organization admin</Tag>
        <Tag detail="test 001">Workspace admin</Tag>
        <Tag title="Handle cases: assign, status, verdict, comments">Handle cases</Tag>
      </TagList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector<HTMLElement>(".di-tag-list")!;
    const column = list.parentElement!.getBoundingClientRect();
    await expect(list.getBoundingClientRect().right).toBeLessThanOrEqual(column.right + 0.5);
    for (const tag of list.children) {
      await expect(tag.getBoundingClientRect().right).toBeLessThanOrEqual(column.right + 0.5);
    }
    for (const detail of list.querySelectorAll<HTMLElement>(".di-tag-detail")) {
      if (getComputedStyle(detail).display === "none") continue;
      const room = parseFloat(getComputedStyle(detail).fontSize) * 4;
      await expect(detail.clientWidth >= room || detail.scrollWidth <= detail.clientWidth).toBe(true);
    }
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};

/** German wording, the longest the products have: scopes wrap under the name, filters stay whole. */
export const German: Story = {
  decorators: [onPanel("Rollen und Filter")],
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <TagList>
        <Tag detail="gesamte Organisation">Organisationsadministrator</Tag>
        <Tag detail="Produktionsumgebung Wien">Arbeitsbereichsverwaltung</Tag>
      </TagList>
      <TagList>
        <Tag mono pressed onRemove={fn()} removeLabel="Den Schweregradfilter entfernen">
          Schweregrad: hoch
        </Tag>
        <Tag mono onClick={fn()}>
          <Plus aria-hidden />
          Datenquelle
        </Tag>
      </TagList>
    </div>
  ),
};

/**
 * A tag never lets its text out. In a narrow column, here the side panel of a
 * person on a phone, a name wider than its place wraps inside its frame
 * (at a space first, inside a word only when the word alone is wider), and
 * its scope goes onto a line of its own. Checked at the panel width of a
 * 360px and a 390px phone.
 */
export const Narrow: Story = {
  render: () => (
    <div className="narrow-column" style={{ width: 328, maxWidth: "100%" }}>
      <Panel title="Roles of Nora Feld" heading={2}>
        <TagList>
          <Tag detail="Production">Workspace administrator</Tag>
          <Tag detail="Produktionsumgebung Wien">Arbeitsbereichsadministratorin</Tag>
          <Tag mono>sha256:9f2c4e1ab07d3c58e6f1a2b4c9d0e7f3</Tag>
        </TagList>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(".narrow-column")!;
    for (const phone of [360, 390]) {
      column.style.width = `${phone - 32}px`;
      for (const tag of canvasElement.querySelectorAll<HTMLElement>(".di-tag")) {
        const frame = tag.getBoundingClientRect();
        for (const part of tag.querySelectorAll<HTMLElement>(".di-tag-name, .di-tag-detail")) {
          const range = document.createRange();
          range.selectNodeContents(part);
          for (const line of Array.from(range.getClientRects()).filter((rect) => rect.width > 0)) {
            await expect(line.right).toBeLessThanOrEqual(frame.right + 0.5);
            await expect(line.left).toBeGreaterThanOrEqual(frame.left - 0.5);
          }
        }
        await expect(frame.right).toBeLessThanOrEqual(column.getBoundingClientRect().right + 0.5);
      }
      const detail = within(canvasElement).getByText("Production");
      await expect(detail.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        within(canvasElement).getByText("Workspace administrator").getBoundingClientRect().top,
      );
    }
    column.style.width = "328px";
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};
