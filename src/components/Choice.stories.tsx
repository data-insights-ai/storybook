import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Checkbox, ChoiceGroup } from "./Choice";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    id: "seal-on-ingest",
    label: "Seal on ingest",
    description: "",
    defaultChecked: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Seal on ingest")).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

/** The click, kept out of the two stories named for a resting state. */
export const Checking: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByLabelText("Seal on ingest");
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    description: "Every entry gets a hash as it lands, before any operator sees it.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Fixed by the workspace policy." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Seal on ingest")).toBeDisabled();
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, description: "Fixed by the workspace policy." },
  play: async ({ args, canvasElement, globals }) => {
    const canvas = within(canvasElement);
    if (globals.theme === "dark") {
      await waitFor(() => expect(canvasElement.ownerDocument.documentElement).toHaveAttribute("data-theme", "dark"));
    }
    const checkbox = canvas.getByRole("checkbox", { name: "Seal on ingest" });
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toBeChecked();
    const mark = checkbox.parentElement!.querySelector("svg")!;
    const box = mark.parentElement!;
    // The disabled stroke must remain a check, not an opaque square.
    await expect(getComputedStyle(mark).opacity).toBe("1");
    await expect(getComputedStyle(mark).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(getComputedStyle(mark).color).not.toBe(getComputedStyle(box).backgroundColor);
    await userEvent.click(canvas.getByText("Seal on ingest"));
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const DisabledCheckedNight: Story = {
  ...DisabledChecked,
  globals: { theme: "dark" },
};

/** Several checkboxes under one legend. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ChoiceGroup legend="Notify on">
      <Checkbox id="n1" label="Failed ingest" defaultChecked={true} />
      <Checkbox id="n2" label="Key expiry" defaultChecked={true} />
      <Checkbox id="n3" label="New source" />
      <Checkbox id="n4" label="Seal broken" description="Always on for an admin." disabled={true} defaultChecked={true} />
    </ChoiceGroup>
  ),
};

/** Some of a group is chosen: the box under which the group sits. */
export const Indeterminate: Story = {
  args: { label: "All access events", indeterminate: true },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("checkbox", { name: "All access events" }) as HTMLInputElement;
    await expect(box.indeterminate).toBe(true);
    await expect(box).toBePartiallyChecked();
  },
};
