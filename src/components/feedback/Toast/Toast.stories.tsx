import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Toast, ToastAction, ToastRegion } from "./Toast";

const meta = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "Four sources revoked.",
    body: "They were removed from the register at 09:14:22Z.",
    auditId: "audit 7f3a99e0",
    dismissLabel: "Dismiss this receipt",
    onDismiss: fn(),
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    body: { control: "text" },
    auditId: { control: "text" },
    dismissLabel: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A receipt for something that already happened, and was already confirmed. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toBeVisible());
    const close = canvas.getByRole("button", { name: "Dismiss this receipt" });
    await expect(close).not.toHaveFocus();
    await userEvent.click(close);
    await expect(args.onDismiss).toHaveBeenCalledOnce();
    // A script click focuses with a ring; the product unmounts the toast here, so the story puts it back at rest.
    close.blur();
    await expect(close).not.toHaveFocus();
  },
};

/** Without an audit id, for an action that writes nothing to the record. */
export const WithoutAudit: Story = {
  args: {
    title: "Filters cleared.",
    body: "The register is showing every source again.",
    auditId: "",
  },
};

/** In its region, fixed at the bottom of the view, where a product mounts the current receipt. */
export const InItsRegion: Story = {
  render: (args) => (
    <ToastRegion>
      <Toast {...args} />
    </ToastRegion>
  ),
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector(".di-toast-region");
    await waitFor(() => expect(within(canvasElement).getByRole("status")).toBeVisible());
    await expect(region?.contains(within(canvasElement).getByRole("status"))).toBe(true);
  },
};

/** A way to the record, never a way back out of the action. */
export const WithAction: Story = {
  render: (args) => (
    <Toast {...args}>
      <ToastAction>
        <Button variant="secondary" size="sm">
          Open record
        </Button>
      </ToastAction>
    </Toast>
  ),
};

/** A longer body still holds to one line of consequence. */
export const Long: Story = {
  args: {
    title: "The signing key was rotated.",
    body: "Entries sealed before 09:14:22Z stay valid under the previous key, which is now archived and cannot sign.",
    auditId: "audit c18b70d4",
  },
};

/**
 * The receipt arriving and leaving. It rises and fades in one move, under
 * 240ms — and the caller holds it for that beat on the way out, so the
 * exit is seen rather than cut.
 *
 * Auto-dismiss lives here in the story, not in the component: a receipt
 * carries an audit id, and the system should not decide how long an
 * operator gets to read it.
 */
export const Arriving: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    type Entry = { id: number; title: string; body: string; audit: string; leaving: boolean };

    const [entries, setEntries] = useState<Entry[]>([]);
    const next = useRef(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const dismiss = useCallback((id: number) => {
      setEntries((list) => list.map((e) => (e.id === id ? { ...e, leaving: true } : e)));
      // One beat for the exit animation, then it is gone.
      timers.current.push(setTimeout(() => setEntries((list) => list.filter((e) => e.id !== id)), 200));
    }, []);

    const emit = useCallback(() => {
      const id = next.current++;
      const stamp = `09:${String(14 + (id % 45)).padStart(2, "0")}:22Z`;
      setEntries((list) => [
        ...list,
        {
          id,
          title: "Four sources revoked.",
          body: `They were removed from the register at ${stamp}.`,
          audit: `audit ${(0x7f3a99e0 + id).toString(16)}`,
          leaving: false,
        },
      ]);
      timers.current.push(setTimeout(() => dismiss(id), 4000));
    }, [dismiss]);

    useEffect(() => {
      emit();
      const held = timers.current;
      return () => held.forEach(clearTimeout);
    }, [emit]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 260 }}>
        <div>
          <Button variant="secondary" size="sm" onClick={emit}>
            Emit a receipt
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {entries.map((entry) => (
            <Toast
              key={entry.id}
              className={entry.leaving ? "is-leaving" : ""}
              title={entry.title}
              body={entry.body}
              auditId={entry.audit}
              onDismiss={() => dismiss(entry.id)}
              dismissLabel="Dismiss this receipt"
            />
          ))}
        </div>
      </div>
    );
  },
};

/** Long German wording with an action: the body wraps beside the action, the close stays on the title's line. */
export const German: Story = {
  args: {
    title: "Vier Datenquellen wurden widerrufen.",
    body: "Sie wurden um 09:14:22Z aus dem Verzeichnis entfernt; bereits versiegelte Einträge bleiben nachprüfbar.",
    auditId: "audit 7f3a99e0",
    dismissLabel: "Diese Bestätigung schließen",
  },
  render: (args) => (
    <Toast {...args}>
      <ToastAction>
        <Button variant="secondary" size="sm">
          Eintrag öffnen
        </Button>
      </ToastAction>
    </Toast>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Vier Datenquellen wurden widerrufen.").getBoundingClientRect();
    const close = canvas.getByRole("button", { name: "Diese Bestätigung schließen" }).getBoundingClientRect();
    await expect(close.top).toBeLessThan(title.bottom);
  },
};
