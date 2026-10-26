import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { TokenField } from "./TokenField";

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const meta = {
  title: "Forms/TokenField",
  component: TokenField,
  tags: ["autodocs"],
  args: {
    id: "invite-emails",
    label: "Email addresses",
    values: [],
    onChange: () => {},
    invalidLabel: "not an email address",
    removeLabel: (v: string) => `Remove ${v}`,
    hint: "Separate addresses with a space or comma, or paste a list.",
    hintTone: "neutral",
    labelTrack: "record",
    placeholder: "name@example.com",
    disabled: false,
    maxLength: 320,
  },
} satisfies Meta<typeof TokenField>;

export default meta;
type Story = StoryObj<typeof meta>;

function Field(args: Parameters<typeof TokenField>[0]) {
  const [values, setValues] = useState<string[]>(["nora.feld@data-insights.ai"]);
  const bad = values.filter((v) => !email.test(v)).length;
  return (
    <TokenField
      {...args}
      values={values}
      onChange={setValues}
      isValid={(v) => email.test(v)}
      hint={bad > 0 ? `${bad} entry is not an email address.` : args.hint}
      hintTone={bad > 0 ? "error" : "neutral"}
    />
  );
}

/** Type, separate, or paste a list; an invalid entry stays, marked. */
export const Addresses: Story = {
  render: (args) => <Field {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Email addresses");
    await userEvent.type(input, "jonas.brandt@data-insights.ai, not-an-address ");
    await expect(canvas.getByText("jonas.brandt@data-insights.ai")).toBeVisible();
    await expect(canvas.getByText("1 entry is not an email address.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Remove not-an-address" }));
    await expect(canvas.queryByText("not-an-address")).toBeNull();
  },
};
