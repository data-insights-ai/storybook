import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { ComboBox } from "./ComboBox";
import { Button } from "../../../actions/Button";
import { Modal, ModalContent, ModalFooter, ModalTitle } from "../../../overlays/Modal";

const suggestions = [
  { value: "NR-01", label: "Northern register" },
  { value: "SR-02", label: "Southern register" },
  { value: "WR-03", label: "Western register" },
];
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--di-rhythm-field)",
  maxWidth: "400px",
} as const;

const meta = {
  title: "Forms/Select/ComboBox",
  tags: ["layer:form"],
  component: ComboBox,
  args: {
    id: "register-code",
    name: "register",
    label: "Register code",
    value: "",
    suggestions,
    toggleLabel: "Show register suggestions",
    emptyLabel: "",
    placeholder: "Choose or enter a code",
    hint: "",
    hintTone: "neutral",
    labelTrack: "record",
    hideLabel: false,
    mono: true,
    disabled: false,
    readOnly: false,
    required: false,
    children: null,
    onValueChange: fn(),
  },
  argTypes: { children: { control: false } },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <form onSubmit={(event) => event.preventDefault()} style={formStyle}>
        <ComboBox
          {...args}
          value={value}
          onValueChange={(next) => {
            args.onValueChange(next);
            setValue(next);
          }}
        />
        <div>
          <Button type="submit">Save source</Button>
        </div>
      </form>
    );
  },
} satisfies Meta<typeof ComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Search either the human label or the code. Choosing a label emits its code,
 * never the label; blur and native form submission keep that exact value. */
export const Default: Story = {};
export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
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

/**
 * Custom text is exact caller-owned text, including whitespace and
 * punctuation. While nothing matches, no list opens, so the line under the
 * field stays readable.
 */
export const CustomValue: Story = {
  args: { hint: "A code from the register, or one of your own." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "  local/Extra + 7  ");
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(input).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.getByText("A code from the register, or one of your own.")).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, "North");
    await expect(page.getByRole("option", { name: /Northern register/ })).toBeVisible();
    await userEvent.type(input, "zz");
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull());
    await userEvent.clear(input);
    await userEvent.type(input, "  local/Extra + 7  ");
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await expect(input).toHaveValue("  local/Extra + 7  ");
    await expect(new FormData(input.closest("form")!).get("register")).toBe("  local/Extra + 7  ");
  },
};

/** External changes are authoritative even while the control has a selection. */
export const ExternalReset: Story = {
  args: { value: "SR-02" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <form onSubmit={(event) => event.preventDefault()} style={formStyle}>
        <ComboBox
          {...args}
          value={value}
          onValueChange={(next) => {
            args.onValueChange(next);
            setValue(next);
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--di-gap-8)" }}>
          <Button type="button" variant="secondary" onClick={() => setValue("NR-01")}>
            Restore recorded code
          </Button>
          <Button type="button" variant="ghost" onClick={() => setValue("")}>
            Clear recorded code
          </Button>
        </div>
      </form>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
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

/**
 * Suggestions that arrive late, after an arrow pressed while there were
 * none: that arrow opened nothing, so it highlights nothing later either,
 * and Enter keeps what was typed.
 */
export const LateSuggestions: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [loaded, setLoaded] = useState<typeof suggestions>([]);
    useEffect(() => {
      const timer = setTimeout(() => setLoaded(suggestions), 400);
      return () => clearTimeout(timer);
    }, []);
    return (
      <form onSubmit={(event) => event.preventDefault()} style={formStyle}>
        <ComboBox
          {...args}
          suggestions={loaded}
          hint={loaded.length === 0 ? "Loading the registers on record." : "3 registers on record."}
          value={value}
          onValueChange={(next) => {
            args.onValueChange(next);
            setValue(next);
          }}
        />
      </form>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    await expect(page.queryByRole("listbox")).toBeNull();
    await canvas.findByText("3 registers on record.");
    await expect(page.queryByRole("listbox")).toBeNull();
    await userEvent.type(input, "r");
    await expect(page.getByRole("option", { name: /Northern register/ })).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveValue("r");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("r");
  },
};

/** No suggestions at all: neither typing nor the toggle opens an empty list. */
export const EmptySuggestions: Story = {
  args: { suggestions: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "NR-01");
    await expect(page.queryByRole("listbox")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Show register suggestions" }));
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(input).toHaveValue("NR-01");
  },
};

/** A product that wants to say nothing matched passes `emptyLabel`; the list then opens with it. */
export const EmptyText: Story = {
  args: { emptyLabel: "No matching suggestions. You can enter another code." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "XX-99");
    await expect(page.getByText("No matching suggestions. You can enter another code.")).toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox")).toBeNull());
  },
};
/** Composition events exercise the maintained IME guard; this is not an OS
 * input-method qualification or an assertion that every browser behaves alike. */
export const ComposingInput: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
    await userEvent.click(input);
    fireEvent.compositionStart(input);
    fireEvent.input(input, { target: { value: "新しい/値" }, isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 229, isComposing: true });
    fireEvent.compositionEnd(input, { data: "新しい/値" });
    await userEvent.tab();
    await expect(input).toHaveValue("新しい/値");
  },
};
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
export const Disabled: Story = {
  args: { value: "NR-01", disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("combobox", { name: "Register code" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: /^Show register suggestions/ })).toBeDisabled();
  },
};
export const ReadOnly: Story = {
  args: { value: "NR-01", readOnly: true },
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "change");
    await expect(input).toHaveValue("NR-01");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
/** A recorded value can replace a focused draft and become read only together.
 * The external update must neither reopen suggestions nor hide nearby controls. */
export const ReadOnlyUpdate: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(""),
      [readOnly, setReadOnly] = useState(false);
    return (
      <form onSubmit={(event) => event.preventDefault()} style={formStyle}>
        <ComboBox
          {...args}
          value={value}
          readOnly={readOnly}
          onValueChange={(next) => {
            args.onValueChange(next);
            setValue(next);
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--di-gap-8)" }}>
          <Button
            type="button"
            variant="secondary"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setValue("NR-01");
              setReadOnly(true);
            }}
          >
            Lock recorded code
          </Button>
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setReadOnly(false)}
          >
            Edit recorded code
          </Button>
        </div>
      </form>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
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
export const Error: Story = {
  args: { value: "unknown", hint: "This code is not available here.", hintTone: "error" },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", { name: "Register code" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("This code is not available here.");
  },
};
export const Night: Story = { globals: { theme: "dark" }, play: KeyboardSelection.play };

/** The popup remains inside a native modal, where the rest of the page is inert. */
export const InDialog: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false),
      [value, setValue] = useState("");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Review code</Button>
        <Modal open={open} labelledBy="review-code-title" onClose={() => setOpen(false)}>
          <ModalContent>
            <ModalTitle id="review-code-title">Review the register code</ModalTitle>
            <ComboBox {...args} value={value} onValueChange={setValue} />
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel review
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
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

/** Keyboard only: Tab reaches the input and skips the toggle, ArrowDown opens every
 * suggestion, the arrows walk them, Enter takes one and closes the list. */
export const KeyboardWalk: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(3));
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const active = () => canvasElement.ownerDocument.getElementById(input.getAttribute("aria-activedescendant") ?? "");
    await waitFor(() => expect(active()).toHaveTextContent("Northern register"));
    await userEvent.keyboard("{ArrowDown}");
    await expect(active()).toHaveTextContent("Southern register");
    await userEvent.keyboard("{ArrowDown}{ArrowUp}");
    await expect(active()).toHaveTextContent("Southern register");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(input).toHaveValue("SR-02"));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("SR-02");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await expect(input).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Save source" })).toHaveFocus();
  },
};

/** Escape closes the list and keeps the typed text and the focus; typing opens it again. */
export const KeyboardEscape: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole("combobox", { name: "Register code" });
    await userEvent.click(input);
    await userEvent.type(input, "reg");
    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(3));
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await expect(input).toHaveValue("reg");
    await expect(input).toHaveFocus();
    await userEvent.clear(input);
    await userEvent.type(input, "west");
    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(1));
    await expect(page.getByRole("option", { name: /Western register/ })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
  },
};

/** Escape in a modal closes the list and leaves the dialog open. */
export const EscapeInDialog: Story = {
  render: InDialog.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Review code" }));
    const dialog = canvas.getByRole("dialog", { name: "Review the register code" });
    const input = within(dialog).getByRole("combobox", { name: "Register code" });
    await userEvent.type(input, "reg");
    await waitFor(() => expect(page.getAllByRole("option")).toHaveLength(3));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
    await expect(canvas.getByRole("dialog", { name: "Review the register code" })).toBeVisible();
    await expect(input).toHaveFocus();
  },
};
