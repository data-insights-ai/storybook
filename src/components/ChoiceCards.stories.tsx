import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, MessageSquare, Webhook } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { ChoiceCards } from "./ChoiceCards";

const meta = {
  title: "Forms/ChoiceCards",
  component: ChoiceCards,
  tags: ["autodocs"],
} satisfies Meta<typeof ChoiceCards>;

export default meta;

const options = [
  { value: "chat", label: "Chat", description: "A channel your team reads.", icon: <MessageSquare /> },
  { value: "email", label: "Email", description: "Members or any address.", icon: <Mail /> },
  { value: "webhook", label: "Webhook", description: "Signed JSON for your own systems.", icon: <Webhook /> },
];

function Choice() {
  const [value, setValue] = useState("chat");
  return <ChoiceCards name="kind" legend="Channel type" options={options} value={value} onChange={setValue} />;
}

export const Kinds: StoryObj = {
  render: () => <Choice />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: /Chat/ })).toBeChecked();
    await userEvent.click(canvas.getByText("Email"));
    await expect(canvas.getByRole("radio", { name: /Email/ })).toBeChecked();
  },
};
