import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Stack } from "../../../layout/arrange/Stack";
import { Toolbar } from "../../../actions/Toolbar";
import { TextField } from "./TextField";
import { TextLink } from "../../../text/TextLink";
import { Panel } from "../../../layout/page/Panel";

const meta = {
  title: "Forms/Text/TextField",
  component: TextField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "source",
    label: "Source",
    hint: "",
    hintTone: "neutral",
    labelTrack: "record",
    hideLabel: false,
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
    labelTrack: { control: "radio", options: ["record", "prose"] },
    mono: { control: "boolean" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.measure === false ? (
        <Story />
      ) : (
        <div style={{ maxWidth: 400 }}>
          <Story />
        </div>
      ),
  ],
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
      <TextLink>Forgot password?</TextLink>
    </TextField>
  ),
};

/** The mark after the label is paint; the input's own `required` is what a screen reader hears. */
export const Required: Story = {
  args: { required: true, hint: "A host name, without a scheme or a path." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "Source" })).toBeRequired();
    const label = canvas.getByText("Source");
    await expect(getComputedStyle(label, "::after").content).toContain("*");
  },
};

/** A value to read and copy, not to change: the read-only tone (a step above disabled), no frame, full ink. */
export const ReadOnly: Story = {
  args: {
    id: "workspace-id",
    label: "Workspace ID",
    readOnly: true,
    defaultValue: "ws_7f3a99e2c41b",
    mono: true,
    placeholder: "",
    hint: "Assigned when the workspace was created. Quote it to support.",
  },
};

/**
 * Read-only and disabled side by side, as they meet on a settings page: the
 * read-only value keeps full ink on its own tone without a frame; the
 * disabled one sinks a step further, keeps its frame and greys its ink.
 */
export const ReadOnlyBesideDisabled: Story = {
  name: "Read-only beside disabled",
  render: () => (
    <Panel title="Workspace">
      <Stack variant="form">
        <TextField id="ro-id" label="Workspace ID" readOnly defaultValue="ws_7f3a99e2c41b" mono />
        <TextField
          id="ro-region"
          label="Region"
          disabled
          defaultValue="eu-central"
          hint="Set when the workspace was created; it cannot move."
        />
      </Stack>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const read = getComputedStyle(canvas.getByLabelText("Workspace ID"));
    const off = getComputedStyle(canvas.getByLabelText("Region"));
    await expect(read.backgroundColor).not.toBe(off.backgroundColor);
    await expect(read.color).not.toBe(off.color);
  },
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
    <Stack variant="form">
      <TextField id="s1" label="Default" placeholder="registry.example.org" />
      <TextField id="s1r" label="Required" required={true} placeholder="registry.example.org" />
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
      <TextField id="s5r" label="Read-only" readOnly={true} mono={true} defaultValue="ws_7f3a99e2c41b" />
      <TextField id="s5" label="Disabled" disabled={true} defaultValue="registry.example.org" />
    </Stack>
  ),
};

/**
 * `prose` is the label for a form a person fills in for themselves — an
 * account, a sign-up — where it is a sentence they read rather than the
 * name of a column. Family, weight, case and size move together, because
 * a 13px label still uppercase and still letterspaced is not a heavier
 * console label, it is a broken one.
 *
 * The distance between two such fields is the form `Stack`'s, not the field's.
 */
export const ProseLabel: Story = {
  name: "Prose label",
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack variant="form">
      <TextField id="account-name" label="Full name" labelTrack="prose" placeholder="Nora Feld" />
      <TextField
        id="account-email"
        label="Work email"
        labelTrack="prose"
        hint="We only use this to send the receipt for a sealed run."
        placeholder="nora.feld@data-insights.ai"
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Work email")).toBeVisible();
  },
};

/** In a one-line add form the button names the field: the label stays for assistive technology only. */
export const HiddenLabel: Story = {
  args: { id: "new-tag", label: "New tag", hideLabel: true, placeholder: "finance-eu" },
  parameters: { measure: false },
  render: (args) => (
    <Toolbar fillFirst={true}>
      <TextField {...args} />
      <Button variant="secondary">Add tag</Button>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("textbox", { name: "New tag" })).toBeVisible();
  },
};

/**
 * German runs a third longer than English. A label wraps under its own
 * width and the slot beside it keeps its line; an error wraps under its
 * icon; the required mark stays on the label's last word.
 */
export const German: Story = {
  name: "German, long labels",
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack variant="form">
      <TextField
        id="de-endpoint"
        label="Adresse des Ereignis-Hubs für die Weiterleitung an das Sicherheitsinformationssystem"
        required={true}
        placeholder="hub.beispiel.de"
        hint="Ein Hostname ohne Schema und ohne Pfad, zum Beispiel hub.beispiel.de."
      />
      <TextField
        id="de-secret"
        label="Gemeinsamer Schlüssel des Dienstkontos"
        type="password"
        required={true}
        defaultValue="geheim"
        hint="Dieser Schlüssel ist abgelaufen. Erzeugen Sie im Ereignis-Hub einen neuen und fügen Sie ihn hier ein."
        hintTone="error"
      >
        <TextLink>Schlüssel erneuern</TextLink>
      </TextField>
      <TextField
        id="de-workspace"
        label="Kennung des Arbeitsbereichs"
        readOnly={true}
        mono={true}
        defaultValue="ws_7f3a99e2c41b"
      />
      <TextField
        id="de-retention"
        label="Aufbewahrungsfrist laut Arbeitsbereichsrichtlinie"
        disabled={true}
        defaultValue="30 Tage"
        hint="Von der Richtlinie des Arbeitsbereichs festgelegt."
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const slot = within(canvasElement).getByRole("button", { name: "Schlüssel erneuern" });
    await expect(slot.getBoundingClientRect().height).toBeLessThan(24);
  },
};

/**
 * A value a model filled in, with its confidence: read-only, a meter under
 * it and the reading in words with the way to its reasons. The label names
 * the value, so a screen reader hears "Resolved operator, Nora Feld".
 */
export const Confidence: Story = {
  args: {
    id: "resolved-operator",
    label: "Resolved operator",
    readOnly: true,
    value: "Nora Feld",
    confidence: { value: 0.94, label: "0.94 · matched on 3 of 4 inputs", whyLabel: "Why?", onWhy: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "Resolved operator" })).toHaveValue("Nora Feld");
    await expect(canvas.getByRole("meter", { name: /0.94/ })).toHaveAttribute("aria-valuenow", "94");
    const why = canvas.getByRole("button", { name: "Why?" });
    await userEvent.click(why);
    await expect(args.confidence?.onWhy).toHaveBeenCalled();
    why.blur();
  },
};

/** Below the caller's threshold: the meter and the words turn to warn, and the words say what to do. */
export const ConfidenceToReview: Story = {
  args: {
    id: "resolved-host",
    label: "Resolved host",
    readOnly: true,
    mono: true,
    value: "mirror.example.net",
    confidence: {
      value: 0.42,
      label: "0.42 · below the threshold, review before sealing",
      level: "review",
      whyLabel: "Why?",
      onWhy: fn(),
    },
  },
};
