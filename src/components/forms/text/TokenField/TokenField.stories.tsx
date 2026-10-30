import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { TokenField } from "./TokenField";

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const meta = {
  title: "Forms/Text/TokenField",
  component: TokenField,
  tags: ["layer:form", "autodocs"],
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
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenField>;

export default meta;
type Story = StoryObj<typeof meta>;

function Field({ initial = ["nora.feld@data-insights.ai"], ...args }: Parameters<typeof TokenField>[0] & { initial?: string[] }) {
  const [values, setValues] = useState<string[]>(initial);
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

/** An entry the field does not take stays where it was typed, marked, until it is corrected or removed. */
export const WithInvalidEntry: Story = {
  render: (args) => <Field {...args} initial={["nora.feld@data-insights.ai", "jonas.brandt@data-insights", "lena.vogt@data-insights.ai"]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1 entry is not an email address.")).toBeVisible();
    await expect(canvas.getByLabelText("Email addresses")).toHaveAttribute("aria-invalid", "true");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Field {...args} />,
};
