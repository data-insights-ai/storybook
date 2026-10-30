import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, FileSearch, Radar, Settings2 } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CommandBar, CommandChip, CommandEmpty, CommandGroup, CommandRow } from "./CommandBar";

/**
 * One field for going somewhere, finding a record and asking a question:
 * the app's ⌘K palette.
 *
 * - **Use it** as the palette a product opens over any page (in a dialog).
 * - **Not** for filtering a list in place (`SearchField` in the list's
 *   toolbar), for choosing a value in a form (`ComboBox`), or for a row's
 *   actions (`Menu`).
 *
 * Anatomy: the field, the results as `CommandGroup`s of `CommandRow`s (or one
 * `CommandEmpty`), and a foot with the key legend and where the query is
 * processed. Content: a row's label is what it opens or does; its meta is a
 * key, a count or a source, never a sentence. An answer a model wrote wears
 * the ring (`inferred`) and says `inferred`. The privacy note is always
 * stated. Accessibility: the field is a combobox owning a listbox; focus stays
 * in the field, Up/Down/Home/End move the highlight, Enter chooses it.
 */
const meta = {
  title: "Navigation/CommandBar",
  component: CommandBar,
  tags: ["layer:block", "autodocs"],
  args: {
    id: "command",
    label: "Navigate, search or ask",
    placeholder: "go to, search, or ask",
    value: "",
    hints: ["↑↓ move", "↵ open", "esc close"],
    privacyNote: "local processing",
    onValueChange: fn(),
    children: null,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    privacyNote: { control: "text" },
    hints: { control: false },
    children: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <CommandBar
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      >
        {args.children}
      </CommandBar>
    );
  },
} satisfies Meta<typeof CommandBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const opened = { overview: fn(), watchlist: fn(), settings: fn() };

const goTo = (
  <CommandGroup label="Go to">
    <CommandRow label="Overview" meta="G then O" onSelect={opened.overview}>
      <FileSearch aria-hidden />
    </CommandRow>
    <CommandRow label="Watchlist" meta="G then W" onSelect={opened.watchlist}>
      <Radar aria-hidden />
    </CommandRow>
    <CommandRow label="Settings" meta="G then S" onSelect={opened.settings}>
      <Settings2 aria-hidden />
    </CommandRow>
  </CommandGroup>
);

/** Empty: the bar offers where to go before it is asked anything. The first row is highlighted. */
export const Empty: Story = {
  args: { children: goTo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Navigate, search or ask" });
    await expect(field).toHaveValue("");
    await expect(canvas.getByRole("listbox", { name: "Navigate, search or ask" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Go to" })).toBeVisible();
    const overview = canvas.getByRole("option", { name: /Overview/ });
    await expect(field).toHaveAttribute("aria-activedescendant", overview.id);
    await expect(overview).toHaveAttribute("aria-selected", "true");
  },
};

/**
 * The arrow keys move the highlight while focus stays in the field; it wraps
 * at both ends, Home and End jump, Enter opens the highlighted row.
 */
export const Keyboard: Story = {
  args: { children: goTo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox");
    Object.values(opened).forEach((open) => open.mockClear());
    const [overview, watchlist, settings] = canvas.getAllByRole("option");
    await userEvent.click(field);
    await userEvent.keyboard("{ArrowDown}");
    await expect(field).toHaveFocus();
    await expect(field).toHaveAttribute("aria-activedescendant", watchlist.id);
    await expect(watchlist).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await expect(field).toHaveAttribute("aria-activedescendant", settings.id);
    await userEvent.keyboard("{Home}");
    await expect(field).toHaveAttribute("aria-activedescendant", overview.id);
    await userEvent.keyboard("{End}");
    await expect(field).toHaveAttribute("aria-activedescendant", settings.id);
    await userEvent.keyboard("{Enter}");
    await expect(opened.settings).toHaveBeenCalledOnce();
    await expect(opened.overview).not.toHaveBeenCalled();
    await userEvent.hover(watchlist);
    await expect(field).toHaveAttribute("aria-activedescendant", watchlist.id);
    await userEvent.type(field, "w");
    await waitFor(() => expect(field).toHaveAttribute("aria-activedescendant", overview.id));
  },
};

/**
 * Being asked something. The query is reported to the caller, which is
 * what decides the rows — here they stay as they were.
 */
export const Typing: Story = {
  args: { children: goTo },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Navigate, search or ask" });
    await userEvent.type(input, "feed");
    await expect(input).toHaveValue("feed");
    await expect(args.onValueChange).toHaveBeenCalled();
  },
};

/**
 * A query that matched records and also produced an answer. The answer
 * wears the ring, so it never reads as one of the records, and it wraps
 * rather than being cut.
 */
export const WithResults: Story = {
  args: {
    value: "paused sources",
    children: (
      <>
        <CommandGroup label="Records">
          <CommandRow label="feed.example.io" meta="03 · paused" onSelect={fn()}>
            <Radar aria-hidden />
          </CommandRow>
          <CommandRow label="beta.example.dev" meta="11 · paused" onSelect={fn()}>
            <Radar aria-hidden />
          </CommandRow>
        </CommandGroup>
        <CommandGroup label="Answer">
          <CommandRow
            inferred={true}
            label="Two of 24 sources are paused, both on rate limits."
            meta="inferred"
            onSelect={fn()}
          />
        </CommandGroup>
        <CommandGroup label="Commands">
          <CommandRow label="Resume all paused sources" meta="⌘⏎" onSelect={fn()}>
            <ArrowRight aria-hidden />
          </CommandRow>
        </CommandGroup>
      </>
    ),
  },
};

/** A query with nothing behind it. The bar says so, as a status, instead of offering an option that does nothing. */
export const NoResults: Story = {
  args: {
    value: "zzzz",
    children: <CommandEmpty>No record, page or command matches “zzzz”.</CommandEmpty>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("No record, page or command matches");
    await expect(canvas.queryByRole("option")).toBeNull();
    await expect(canvas.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  },
};

/** Where the query goes is stated, not implied. */
export const External: Story = {
  args: {
    value: "summarise the last seal",
    privacyNote: "sent to the model · eu-central",
    children: (
      <CommandGroup label="Answer">
        <CommandRow
          inferred={true}
          label="The last seal covers 4,182 entries through 09:12:04Z."
          meta="inferred"
          onSelect={fn()}
        />
      </CommandGroup>
    ),
  },
};

/** German labels run longest; a row wraps between words and its key stays on the first line. */
export const LongGermanLabels: Story = {
  args: {
    label: "Navigieren, suchen oder fragen",
    placeholder: "Gehe zu, suche oder frage",
    value: "einstellungen",
    hints: ["↑↓ bewegen", "↵ öffnen", "esc schließen"],
    privacyNote: "lokale Verarbeitung",
    children: (
      <CommandGroup label="Gehe zu">
        <CommandRow label="Zu den Einstellungen der Datenquelle wechseln" meta="G dann E" onSelect={fn()}>
          <Settings2 aria-hidden />
        </CommandRow>
        <CommandRow label="Benachrichtigungseinstellungen des Arbeitsbereichs" meta="G dann B" onSelect={fn()}>
          <Settings2 aria-hidden />
        </CommandRow>
      </CommandGroup>
    ),
  },
};

/**
 * The scopes the bar is searching within. A suggested scope came from a
 * model, so it carries the hollow ring rather than a filled mark.
 */
export const Scopes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <CommandChip state="active">workspace: WS-01</CommandChip>
      <CommandChip state="available" onSelect={fn()}>
        state: paused
      </CommandChip>
      <CommandChip state="suggested" onSelect={fn()}>
        sealed before 2026-09-01
      </CommandChip>
    </div>
  ),
};
