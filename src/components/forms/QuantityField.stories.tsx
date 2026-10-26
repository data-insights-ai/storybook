import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { QuantityField } from "./QuantityField";

function Controlled({ labelHidden = false, disabled = false }: { labelHidden?: boolean; disabled?: boolean }) {
  const [value, setValue] = useState(2);
  return (
    <QuantityField
      id="seats"
      label="Quantity"
      decrementLabel="One fewer"
      incrementLabel="One more"
      invalidHint="Enter a whole number from 1 to 20."
      max={20}
      value={value}
      onChange={setValue}
      hint={`${value} × 25 seats = ${value * 25} seats`}
      labelHidden={labelHidden}
      disabled={disabled}
    />
  );
}

const meta = {
  title: "Forms/QuantityField",
  component: Controlled,
  tags: ["autodocs"],
  args: { labelHidden: false, disabled: false },
} satisfies Meta<typeof Controlled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Quantity");
    await userEvent.click(canvas.getByRole("button", { name: "One more" }));
    await expect(input).toHaveValue("3");
    await userEvent.click(canvas.getByRole("button", { name: "One fewer" }));
    await userEvent.click(canvas.getByRole("button", { name: "One fewer" }));
    await expect(input).toHaveValue("1");
    await expect(canvas.getByRole("button", { name: "One fewer" })).toBeDisabled();
  },
};

/** Typed text that is not a quantity keeps the last valid value and says why. */
export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Quantity");
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Enter a whole number from 1 to 20.")).toBeVisible();
    await userEvent.tab();
    await expect(input).toHaveValue("2");
  },
};

/** Under a table column that already says what the value is. */
export const LabelHidden: Story = {
  args: { labelHidden: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Quantity")).toBeInTheDocument();
    await expect(canvas.getByText("Quantity")).toHaveClass("di-sr");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
