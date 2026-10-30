import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { QuantityField } from "./QuantityField";

const meta = {
  title: "Forms/Text/QuantityField",
  component: QuantityField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "seats",
    label: "Seats",
    decrementLabel: "One fewer",
    incrementLabel: "One more",
    invalidHint: "Enter a whole number from 1 to 20.",
    min: 1,
    max: 20,
    value: 2,
    hint: "",
    hideLabel: false,
    disabled: false,
    onChange: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <QuantityField
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
        hint={`${value} × 25 seats = ${value * 25} seats`}
      />
    );
  },
} satisfies Meta<typeof QuantityField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Seats");
    await userEvent.click(canvas.getByRole("button", { name: "One more" }));
    await expect(input).toHaveValue("3");
    await userEvent.click(canvas.getByRole("button", { name: "One fewer" }));
    await userEvent.click(canvas.getByRole("button", { name: "One fewer" }));
    await expect(input).toHaveValue("1");
    await expect(canvas.getByRole("button", { name: "One fewer" })).toBeDisabled();
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    await userEvent.tab();
    await expect(input).toHaveValue("1");
  },
};

/** Typed text that is not a quantity keeps the last valid value and says why; leaving the field puts that value back. */
export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Seats");
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Enter a whole number from 1 to 20.")).toBeVisible();
  },
};

/** Under a table column that already says what the value is. */
export const HideLabel: Story = {
  args: { hideLabel: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Seats")).toBeInTheDocument();
    await expect(canvas.getByText("Seats").closest(".di-sr")).not.toBeNull();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
