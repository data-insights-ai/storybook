import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TextField } from "./TextField";
import { TextLink } from "./TextLink";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    id: "email",
    label: "Email or username",
    defaultValue: "nora.feld@data-insights.ai",
    type: "text",
    autoComplete: "username",
    disabled: false,
    readOnly: false,
    required: false,
    hint: "",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url"],
    },
    hint: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("Email or username");
    await expect(field).toHaveValue("nora.feld@data-insights.ai");
  },
};

export const Password: Story = {
  args: {
    id: "password",
    label: "Password",
    type: "password",
    defaultValue: "correct horse battery",
    autoComplete: "current-password",
  },
  render: (args) => (
    <TextField {...args}>
      <TextLink quiet={true}>Forgot password?</TextLink>
    </TextField>
  ),
};
