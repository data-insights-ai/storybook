import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { MultiComboBox } from "./MultiComboBox";
import { TokenField } from "./TokenField";
import { Button } from "../../../actions/Button";
import { Modal, ModalContent, ModalTitle } from "../../../overlays/Modal";

const people = [
  { value: "u-nora", label: "Nora Feld" },
  { value: "u-jonas", label: "Jonas Berger" },
  { value: "u-lea", label: "Lea Hofmann" },
  { value: "u-milan", label: "Milan Kovač" },
  { value: "u-sara", label: "Sara Lindqvist" },
  { value: "u-tomas", label: "Tomás Ortega" },
];

const meta = {
  title: "Forms/Select/MultiComboBox",
  tags: ["layer:form"],
  component: MultiComboBox,
  args: {
    id: "notify-members",
    label: "Members",
    options: people,
    values: [],
    toggleLabel: "Show members",
    emptyLabel: "",
    removeLabel: (name: string) => `Remove ${name}`,
    placeholder: "Search members",
    hint: "Each gets the mail at their verified address.",
    hintTone: "neutral",
    labelTrack: "record",
    disabled: false,
    onChange: fn(),
  },
  argTypes: { removeLabel: { control: false }, options: { control: false } },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([...args.values]);
    useEffect(() => setValues([...args.values]), [args.values]);
    return (
      <div style={{ maxWidth: "480px" }}>
        <MultiComboBox
          {...args}
          values={values}
          onChange={(next) => {
            args.onChange(next);
            setValues(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof MultiComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Nobody chosen yet: the placeholder says what to type. */
export const Empty: Story = {};

/** Chosen members stand in the field; each leaves with its own button. */
export const Chosen: Story = { args: { values: ["u-nora", "u-lea", "u-tomas"] } };

/** The field's reason it cannot be saved, in place of its hint. */
export const Invalid: Story = {
  args: { hint: "Choose at least one member or a permission.", hintTone: "error" },
};

export const Disabled: Story = { args: { values: ["u-nora"], disabled: true } };

/** Type to narrow, pick several without the list closing, drop one again. */
export const PickSeveral: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await userEvent.type(input, "lea");
    await expect(page.queryByRole("option", { name: /Nora Feld/ })).toBeNull();
    await userEvent.click(page.getByRole("option", { name: /Lea Hofmann/ }));
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-lea"]));
    await expect(input).toHaveValue("");
    await userEvent.click(page.getByRole("option", { name: /Nora Feld/ }));
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-lea", "u-nora"]));
    await expect(page.getByRole("option", { name: /Lea Hofmann/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(canvas.getByRole("button", { name: "Remove Lea Hofmann" }));
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-nora"]));
  },
};

/** Nobody matches what was typed: the list closes rather than covering the line under the field. */
export const NoMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await expect(page.getByRole("option", { name: /Nora Feld/ })).toBeVisible();
    await userEvent.type(input, "zzz");
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull());
    await expect(canvas.getByText("Each gets the mail at their verified address.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Show members" }));
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(input).toHaveValue("zzz");
    await userEvent.clear(input);
    await expect(page.getByRole("option", { name: /Nora Feld/ })).toBeVisible();
  },
};

/** With `emptyLabel` the list stays open and says so. */
export const EmptyText: Story = {
  args: { emptyLabel: "No member matches." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await userEvent.type(input, "zzz");
    await expect(page.getByText("No member matches.")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByText("No member matches.")).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Show members" }));
    await expect(page.getByText("No member matches.")).toBeVisible();
    await expect(input).toHaveValue("zzz");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByText("No member matches.")).toBeNull());
  },
};

/** Arrow keys and Enter choose, Enter on a checked row drops it; Backspace in the empty input drops the last one. */
export const Keyboard: Story = {
  args: { values: ["u-nora"] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await userEvent.type(input, "Sara");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-nora", "u-sara"]));
    await userEvent.keyboard("{Backspace}");
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-nora"]));
    await userEvent.type(input, "Nora");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith([]));
  },
};

/** In a modal the list stays inside the dialog, so it can still be pressed. */
export const InAModal: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState<string[]>([]);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Choose members</Button>
        <Modal open={open} labelledBy="notify-members-title" onClose={() => setOpen(false)}>
          <ModalContent>
            <ModalTitle id="notify-members-title">Notify members</ModalTitle>
            <MultiComboBox {...args} values={values} onChange={setValues} />
          </ModalContent>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Choose members" }));
    const input = await page.findByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await userEvent.click(page.getByRole("option", { name: /Jonas Berger/ }));
    await userEvent.keyboard("{Escape}");
    await expect(page.getByRole("button", { name: "Remove Jonas Berger" })).toBeVisible();
  },
};

/** Keyboard only: Tab into the field opens the list, the arrows walk it, Enter
 * checks a row and the list stays open, Escape closes it and keeps the focus. */
export const KeyboardWalk: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "true"));
    await expect(page.getAllByRole("option")).toHaveLength(6);
    const active = () => canvasElement.ownerDocument.getElementById(input.getAttribute("aria-activedescendant") ?? "");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(active()).toHaveTextContent("Nora Feld"));
    await userEvent.keyboard("{ArrowDown}");
    await expect(active()).toHaveTextContent("Jonas Berger");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(args.onChange).toHaveBeenLastCalledWith(["u-jonas"]));
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("option", { name: /Jonas Berger/ })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await expect(input).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Remove Jonas Berger" })).toBeVisible();
  },
};

/** A notification needs someone to go to: the label carries the mark, the input says it is required. */
export const Required: Story = {
  args: { required: true, hint: "At least one member gets the alert." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox", { name: "Members" })).toHaveAttribute("aria-required", "true");
    await expect(canvasElement.querySelector(".di-field-label.is-required")).not.toBeNull();
  },
};

/** Escape closes the list; pressed again on the closed list it leaves the chosen members alone. */
export const EscapeKeepsEntries: Story = {
  args: { values: ["u-nora", "u-lea"] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Members" });
    await userEvent.click(input);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await userEvent.keyboard("{Escape}");
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole("button", { name: "Remove Lea Hofmann" })).toBeVisible();
  },
};

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Addresses({
  initial,
  suggest = false,
  disabled = false,
  hint = "Separate addresses with a space or comma, or paste a list.",
}: {
  initial: string[];
  suggest?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  const [values, setValues] = useState<string[]>(initial);
  const bad = values.filter((v) => !email.test(v)).length;
  return (
    <div style={{ maxWidth: "480px" }}>
      <MultiComboBox
        id="invite-emails"
        label="Email addresses"
        freeEntry
        options={
          suggest
            ? [
                { value: "nora.feld@data-insights.ai", label: "nora.feld@data-insights.ai" },
                { value: "jonas.berger@data-insights.ai", label: "jonas.berger@data-insights.ai" },
                { value: "lea.hofmann@data-insights.ai", label: "lea.hofmann@data-insights.ai" },
              ]
            : undefined
        }
        toggleLabel={suggest ? "Show colleagues" : undefined}
        values={values}
        onChange={setValues}
        validate={(v) => email.test(v)}
        invalidLabel="not an email address"
        removeLabel={(v) => `Remove ${v}`}
        placeholder="name@example.com"
        disabled={disabled}
        required
        hint={bad > 0 ? `${bad} entry is not an email address.` : hint}
        hintTone={bad > 0 ? "error" : "neutral"}
      />
    </div>
  );
}

/**
 * Free entry: the reader types the values. A separator or a pasted list turns
 * text into entries; one `validate` rejects stays, marked, until corrected.
 * Without suggestions there is no list and no toggle: a plain text input.
 */
export const FreeEntry: Story = {
  render: () => <Addresses initial={["nora.feld@data-insights.ai"]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email addresses" });
    await expect(canvas.queryByRole("combobox")).toBeNull();
    await userEvent.type(input, "jonas.brandt@data-insights.ai, not-an-address ");
    await expect(canvas.getByText("jonas.brandt@data-insights.ai")).toBeVisible();
    await expect(canvas.getByText("1 entry is not an email address.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Remove not-an-address" }));
    await expect(canvas.queryByText("not-an-address")).toBeNull();
    await userEvent.click(input);
    await userEvent.paste("lea.vogt@data-insights.ai; milan.kovac@data-insights.ai");
    await expect(canvas.getByText("milan.kovac@data-insights.ai")).toBeVisible();
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue("milan.kovac@data-insights.ai");
  },
};

/** An entry the field does not take stays where it was typed, marked, until it is corrected or removed. */
export const FreeEntryInvalid: Story = {
  render: () => (
    <Addresses initial={["nora.feld@data-insights.ai", "jonas.brandt@data-insights", "lena.vogt@data-insights.ai"]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1 entry is not an email address.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Email addresses" })).toHaveAttribute("aria-invalid", "true");
    await expect(canvasElement.querySelectorAll(".di-token.is-invalid")).toHaveLength(1);
  },
};

/** Free entry with suggestions: typing narrows them, a pick or Enter on new text adds an entry. */
export const FreeEntryWithSuggestions: Story = {
  render: () => <Addresses initial={[]} suggest />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Email addresses" });
    await userEvent.click(input);
    await userEvent.type(input, "lea");
    await userEvent.click(page.getByRole("option", { name: /lea.hofmann/ }));
    await expect(canvas.getByRole("button", { name: "Remove lea.hofmann@data-insights.ai" })).toBeVisible();
    await userEvent.type(input, "auditor@extern.example{Enter}");
    await expect(canvas.getByText("auditor@extern.example")).toBeVisible();
    await expect(input).toHaveValue("");
  },
};

export const FreeEntryDisabled: Story = {
  render: () => <Addresses initial={["nora.feld@data-insights.ai"]} disabled />,
};

/** German labels run long: the label wraps, entries wrap inside the frame, the error hangs off its first line. */
export const German: Story = {
  args: {
    id: "de-members",
    label: "Mitglieder, die bei einer kritischen Meldung benachrichtigt werden",
    values: ["u-nora", "u-lea", "u-tomas", "u-sara"],
    toggleLabel: "Mitglieder anzeigen",
    removeLabel: (name: string) => `${name} entfernen`,
    placeholder: "Mitglieder suchen",
    required: true,
    hint: "Wählen Sie mindestens ein Mitglied oder eine Berechtigung aus, bevor Sie speichern.",
    hintTone: "error",
  },
};

/** `TokenField` is deprecated: it renders this field with `freeEntry`, so nothing changes for its callers until 0.12. */
export const DeprecatedTokenField: Story = {
  render: function Render() {
    const [values, setValues] = useState(["nora.feld@data-insights.ai"]);
    return (
      <div style={{ maxWidth: "480px" }}>
        <TokenField
          id="legacy-emails"
          label="Email addresses"
          values={values}
          onChange={setValues}
          isValid={(v) => email.test(v)}
          removeLabel={(v) => `Remove ${v}`}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Email addresses" }), "jonas@data-insights.ai ");
    await expect(canvas.getByRole("button", { name: "Remove jonas@data-insights.ai" })).toBeVisible();
  },
};
