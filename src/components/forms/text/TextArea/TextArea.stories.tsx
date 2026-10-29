import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";

const meta = {
  title: "Forms/Text/TextArea",
  component: TextArea,
  tags: ["layer:form", "autodocs"],
  args: { id: "ca", label: "Server CA", mono: true, rows: 6, placeholder: "-----BEGIN CERTIFICATE-----" },
} satisfies Meta<typeof TextArea>;

export default meta;

export const Certificate: StoryObj<typeof meta> = {};
export const Invalid: StoryObj<typeof meta> = {
  args: { value: "not a certificate", hint: "Not a PEM certificate.", hintTone: "error", onChange: () => {} },
};
