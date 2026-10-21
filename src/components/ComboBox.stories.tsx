import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { ComboBox } from "./ComboBox";
import { Button } from "./Button";
import { Modal, ModalContent, ModalTitle } from "./Modal";

const suggestions = [
  { value: "NR-01", label: "Northern register" },
  { value: "SR-02", label: "Southern register" },
  { value: "WR-03", label: "Western register" },
];
const meta = {
  title: "Forms/ComboBox",
  component: ComboBox,
  args: {
    id: "register-code", name: "register", label: "Register code", value: "",
    suggestions, toggleLabel: "Show register suggestions", emptyLabel: "No matching suggestions. You can enter another code.",
    placeholder: "Choose or enter a code", hint: "", hintTone: "neutral", labelTrack: "record", hideLabel: false, mono: true,
    disabled: false, readOnly: false, required: false, children: null, onValueChange: fn(),
  },
  argTypes: { children: { control: false } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <form onSubmit={(event) => event.preventDefault()} style={{ maxWidth: "480px" }}>
      <ComboBox {...args} value={value} onValueChange={(next) => { args.onValueChange(next); setValue(next); }} />
      <Button type="button" variant="ghost" onClick={() => setValue("NR-01")}>Restore recorded code</Button>
      <Button type="button" variant="ghost" onClick={() => setValue("")}>Clear recorded code</Button>
    </form>;
  },
} satisfies Meta<typeof ComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Search either the human label or the code. Choosing a label emits its code,
 * never the label; blur and native form submission keep that exact value. */
export const Default: Story = {};
export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement), page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "Southern");
    await expect(page.getByRole("option", { name: /Southern register/ })).toBeVisible();
    await expect(page.queryByRole("option", { name: /Northern register/ })).toBeNull();
    args.onValueChange.mockClear();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(input).toHaveValue("SR-02"));
    await userEvent.tab();
    await expect(input).toHaveValue("SR-02");
    await expect(args.onValueChange).toHaveBeenCalledWith("SR-02");
    await expect(args.onValueChange.mock.calls.every(([value]) => value === "SR-02")).toBe(true);
    await expect(new FormData(input.closest("form")!).get("register")).toBe("SR-02");
    await userEvent.clear(input);
    await userEvent.type(input, "WR-");
    await expect(page.getByRole("option", { name: /Western register/ })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveValue("WR-");
  },
};

/** Custom text is exact caller-owned text, including whitespace and punctuation. */
export const CustomValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement), page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "  local/Extra + 7  ");
    await expect(page.getByText("No matching suggestions. You can enter another code.")).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await expect(input).toHaveValue("  local/Extra + 7  ");
    await expect(new FormData(input.closest("form")!).get("register")).toBe("  local/Extra + 7  ");
  },
};

/** External changes are authoritative even while the control has a selection. */
export const ExternalReset: Story = {
  args: { value: "SR-02" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement), page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await expect(input).toHaveValue("SR-02");
    await userEvent.click(canvas.getByRole("button", { name: /^Show register suggestions/ }));
    await userEvent.click(page.getByRole("option", { name: /Western register/ }));
    await expect(input).toHaveValue("WR-03");
    args.onValueChange.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Restore recorded code" }));
    await expect(input).toHaveValue("NR-01");
    await userEvent.click(canvas.getByRole("button", { name: "Clear recorded code" }));
    await expect(input).toHaveValue("");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const EmptySuggestions: Story = { args: { suggestions: [] }, play: CustomValue.play };
/** Composition events exercise the maintained IME guard; this is not an OS
 * input-method qualification or an assertion that every browser behaves alike. */
export const ComposingInput: Story = { play: async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
  await userEvent.click(input);
  fireEvent.compositionStart(input);
  fireEvent.input(input, { target: { value: "新しい/値" }, isComposing: true });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 229, isComposing: true });
  fireEvent.compositionEnd(input, { data: "新しい/値" });
  await userEvent.tab();
  await expect(input).toHaveValue("新しい/値");
} };
export const Required: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Register code" }) as HTMLInputElement;
    await expect(input.checkValidity()).toBe(false);
    await userEvent.type(input, "custom-code");
    await userEvent.tab();
    await expect(input.checkValidity()).toBe(true);
  },
};
export const Disabled: Story = { args: { value: "NR-01", disabled: true }, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("combobox", { name: "Register code" })).toBeDisabled();
  await expect(canvas.getByRole("button", { name: /^Show register suggestions/ })).toBeDisabled();
} };
export const ReadOnly: Story = { args: { value: "NR-01", readOnly: true }, play: async ({ canvasElement, args }) => {
  const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
  await userEvent.type(input, "change");
  await expect(input).toHaveValue("NR-01");
  await expect(args.onValueChange).not.toHaveBeenCalled();
} };
/** A recorded value can replace a focused draft and become read only together.
 * The external update must neither reopen suggestions nor hide nearby controls. */
export const ReadOnlyUpdate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(""), [readOnly, setReadOnly] = useState(false);
    return <form onSubmit={(event) => event.preventDefault()} style={{ maxWidth: "480px" }}>
      <ComboBox {...args} value={value} readOnly={readOnly}
        onValueChange={(next) => { args.onValueChange(next); setValue(next); }} />
      <Button type="button" variant="ghost" onMouseDown={(event) => event.preventDefault()}
        onClick={() => { setValue("NR-01"); setReadOnly(true); }}>Lock recorded code</Button>
      <Button type="button" variant="ghost" onMouseDown={(event) => event.preventDefault()}
        onClick={() => setReadOnly(false)}>Edit recorded code</Button>
    </form>;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement), page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    const lock = canvas.getByRole("button", { name: "Lock recorded code" });
    await userEvent.type(input, "WR-03");
    await userEvent.keyboard("{Escape}");
    await expect(input).toHaveFocus();
    await expect(input, "Escape closes the focused draft").toHaveAttribute("aria-expanded", "false");
    args.onValueChange.mockClear();
    await userEvent.click(lock);
    await expect(input).toHaveValue("NR-01");
    await expect(input).toHaveAttribute("readonly");
    await expect(input).toHaveFocus();
    await waitFor(() => expect(input, "A readonly refresh stays closed").toHaveAttribute("aria-expanded", "false"));
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(canvas.getByRole("button", { name: "Lock recorded code" })).toBeVisible();
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(new FormData(input.closest("form")!).get("register")).toBe("NR-01");
    await userEvent.keyboard("{ArrowDown}");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.tab();
    await userEvent.click(canvas.getByRole("button", { name: "Edit recorded code" }));
    await expect(input).not.toHaveAttribute("readonly");
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(canvas.getByRole("button", { name: /^Show register suggestions/ }));
    await expect(page.getByRole("listbox")).toBeVisible();
    fireEvent.click(lock); // External state update, without an outside-pointer dismissal.
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(input).toHaveValue("NR-01");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
export const Error: Story = { args: { value: "unknown", hint: "This code is not available here.", hintTone: "error" }, play: async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription("This code is not available here.");
} };
export const Night: Story = { globals: { theme: "dark" }, play: KeyboardSelection.play };

/** The popup remains inside a native modal, where the rest of the page is inert. */
export const InDialog: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false), [value, setValue] = useState("");
    return <>
      <Button onClick={() => setOpen(true)}>Review code</Button>
      <Modal open={open} labelledBy="review-code-title" onClose={() => setOpen(false)}>
        <ModalContent><ModalTitle id="review-code-title">Review the register code</ModalTitle>
          <ComboBox {...args} value={value} onValueChange={setValue} />
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel review</Button>
        </ModalContent>
      </Modal>
    </>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement), page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Review code" }));
    const dialog = canvas.getByRole("dialog", { name: "Review the register code" });
    await userEvent.click(within(dialog).getByRole("button", { name: /^Show register suggestions/ }));
    await userEvent.click(page.getByRole("option", { name: /Southern register/ }));
    await expect(within(dialog).getByRole("combobox", { name: "Register code" })).toHaveValue("SR-02");
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel review" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(canvas.getByRole("button", { name: "Review code" })).toHaveFocus();
  },
};
