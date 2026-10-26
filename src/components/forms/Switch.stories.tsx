import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    id: "demo-data",
    on: false,
    title: "Demo data",
    description: "",
    layout: "inline",
    disabled: false,
    onToggle: fn(),
  },
  argTypes: {
    id: { control: "text" },
    on: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    layout: { control: "radio", options: ["inline", "row"] },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    // The switch is controlled, so the story holds the state the caller
    // would. `on` stays an arg, so the Controls toggle keeps working.
    const [on, setOn] = useState(args.on);
    useEffect(() => setOn(args.on), [args.on]);
    return (
      <div style={{ maxWidth: 380 }}>
        <Switch
          {...args}
          on={on}
          onToggle={(next) => {
            setOn(next);
            args.onToggle(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `inline` is the default: the control leads and the title follows one
 * gap later, the same geometry `Checkbox` and `Radio` use, with the
 * control centred on the first line of the title.
 */
export const Off: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: "Demo data" })).toHaveAttribute("aria-checked", "false");
  },
};

export const On: Story = {
  args: { on: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: "Demo data" })).toHaveAttribute("aria-checked", "true");
  },
};

/**
 * A switch commits as it moves: one click reports the next state to the
 * caller, and the caller is what turns the control around. This story is
 * the one that ends somewhere other than where it started.
 */
export const Toggling: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: "Demo data" });
    await expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
    await expect(control).toHaveAttribute("aria-checked", "true");
  },
};

export const WithDescription: Story = {
  args: {
    on: true,
    description: "Records on this page are samples. Nothing here is sealed.",
  },
};

/**
 * `row` pushes the control to the trailing edge. The distance is the
 * column a settings sheet lines its switches up in — it is a layout
 * someone asked for, never slack the component invented.
 */
export const Row: Story = {
  args: { layout: "row" },
};

/** Which is what `row` is for: several switches sharing one column. */
export const SettingsColumn: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [state, setState] = useState({ demo: true, seal: false, notify: true });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 380 }}>
        <Switch
          id="col-demo"
          layout="row"
          title="Demo data"
          description="Records on this page are samples."
          on={state.demo}
          onToggle={(on) => setState((prev) => ({ ...prev, demo: on }))}
        />
        <Switch
          id="col-seal"
          layout="row"
          title="Seal on ingest"
          on={state.seal}
          onToggle={(on) => setState((prev) => ({ ...prev, seal: on }))}
        />
        <Switch
          id="col-notify"
          layout="row"
          title="Notify on failure"
          description="One message per failed batch, not per entry."
          on={state.notify}
          onToggle={(on) => setState((prev) => ({ ...prev, notify: on }))}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Fixed by the workspace policy." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: "Demo data" })).toBeDisabled();
  },
};

export const DisabledOn: Story = {
  args: { disabled: true, on: true, description: "Fixed by the workspace policy." },
};
