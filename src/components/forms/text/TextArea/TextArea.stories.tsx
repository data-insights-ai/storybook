import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TextArea } from "./TextArea";

const meta = {
  title: "Forms/Text/TextArea",
  component: TextArea,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "ca",
    label: "Server CA",
    mono: true,
    rows: 6,
    placeholder: "-----BEGIN CERTIFICATE-----",
    required: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;

export const Certificate: StoryObj<typeof meta> = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText("Server CA");
    await expect(field.tagName).toBe("TEXTAREA");
    await userEvent.type(field, "-----BEGIN CERTIFICATE-----");
    await expect(field).toHaveValue("-----BEGIN CERTIFICATE-----");
  },
};
export const Invalid: StoryObj<typeof meta> = {
  args: { value: "not a certificate", hint: "Not a PEM certificate.", hintTone: "error", onChange: () => {} },
};
