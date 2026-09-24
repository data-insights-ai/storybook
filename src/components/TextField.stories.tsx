import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TextField } from "./TextField";
import { TextLink } from "./TextLink";

const meta = {
  title: "Forms/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    id: "source",
    label: "Source",
    hint: "",
    hintTone: "neutral",
    mono: false,
    placeholder: "registry.example.org",
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    hintTone: { control: "radio", options: ["neutral", "sealed", "error"] },
    mono: { control: "boolean" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Source");
    await userEvent.type(input, "registry.example.org");
    await expect(input).toHaveValue("registry.example.org");
  },
};

export const WithHint: Story = {
  args: { hint: "A host name, without a scheme or a path." },
};

/**
 * There is one line under the field, and `hintTone` says what it is. An
 * error is that line reading differently, so the field can never argue
 * with itself by showing help and an error at once.
 */
export const WithError: Story = {
  args: {
    hint: "This host did not resolve.",
    hintTone: "error",
    defaultValue: "registry.exmaple.org",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Source");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("This host did not resolve.")).toBeVisible();
  },
};

/** A resolved value the register can vouch for, carrying the seal. */
export const WithSealedHint: Story = {
  args: {
    id: "manifest",
    label: "Manifest",
    mono: true,
    defaultValue: "a4f9c21e",
    hint: "resolved 2026-09-18T09:12:04Z",
    hintTone: "sealed",
    placeholder: "",
  },
};

/** Identifiers and hashes are typed in the mono track. */
export const Mono: Story = {
  args: { id: "hash", label: "Short hash", mono: true, placeholder: "7f3a99e" },
};

/** A slot beside the label, for the way out of the field. */
export const WithLabelSlot: Story = {
  args: { id: "password", label: "Password", type: "password", placeholder: "" },
  render: (args) => (
    <TextField {...args}>
      <TextLink quiet={true}>Forgot password?</TextLink>
    </TextField>
  ),
};

export const Required: Story = {
  args: { required: true, hint: "Required." },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "registry.example.org", mono: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "registry.example.org" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Source")).toBeDisabled();
  },
};

/** Every state in one column. */
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 340 }}>
      <TextField id="s1" label="Default" placeholder="registry.example.org" />
      <TextField id="s2" label="With hint" hint="A host name, without a scheme." />
      <TextField
        id="s3"
        label="Sealed"
        mono={true}
        defaultValue="a4f9c21e"
        hint="resolved 09:12:04Z"
        hintTone="sealed"
      />
      <TextField
        id="s4"
        label="Invalid"
        hint="This host did not resolve."
        hintTone="error"
        defaultValue="registry.exmaple.org"
      />
      <TextField id="s5" label="Disabled" disabled={true} defaultValue="registry.example.org" />
    </div>
  ),
};
