import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, FileSearch, Radar, Settings2 } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { CommandBar, CommandGroup, CommandRow } from "./CommandBar";

const meta = {
  title: "Blocks/CommandBar",
  component: CommandBar,
  tags: ["autodocs"],
  args: {
    id: "command",
    label: "Navigate, search or ask",
    placeholder: "go to, search, or ask a question",
    value: "",
    hints: ["/ commands", "↑↓ select", "↵ open"],
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

/** Empty: the bar offers where to go before it is asked anything. */
export const Empty: Story = {
  args: {
    children: (
      <CommandGroup label="Go to">
        <CommandRow icon={<FileSearch aria-hidden />} label="Overview" meta="G then O" onSelect={fn()} />
        <CommandRow icon={<Radar aria-hidden />} label="Watchlist" meta="G then W" onSelect={fn()} />
        <CommandRow icon={<Settings2 aria-hidden />} label="Settings" meta="G then S" onSelect={fn()} />
      </CommandGroup>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Navigate, search or ask");
    await userEvent.type(input, "feed");
    await expect(input).toHaveValue("feed");
  },
};

/**
 * A query that matched records and also produced an answer. The answer
 * wears the ring, so it never reads as one of the records.
 */
export const WithResults: Story = {
  args: {
    value: "paused sources",
    children: (
      <>
        <CommandGroup label="Records">
          <CommandRow icon={<Radar aria-hidden />} label="feed.example.io" meta="03 · paused" active={true} onSelect={fn()} />
          <CommandRow icon={<Radar aria-hidden />} label="beta.example.dev" meta="11 · paused" onSelect={fn()} />
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
          <CommandRow icon={<ArrowRight aria-hidden />} label="Resume all paused sources" meta="⌘⏎" onSelect={fn()} />
        </CommandGroup>
      </>
    ),
  },
};

/** A query with nothing behind it. The bar says so rather than going blank. */
export const NoResults: Story = {
  args: {
    value: "zzzz",
    children: (
      <CommandGroup label="Records">
        <CommandRow label="No record matches this query." meta="0 results" onSelect={fn()} />
      </CommandGroup>
    ),
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
