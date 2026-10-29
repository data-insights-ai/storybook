import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, MessageSquare, Webhook } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { ChoiceCards } from "./ChoiceCards";

const meta = {
  title: "Forms/ChoiceCards",
  component: ChoiceCards,
  tags: ["layer:form", "autodocs"],
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

/** Cards in groups, each description one line, the rest in a tooltip; the legend hidden under a heading that already names the choice. */
export const Grouped: StoryObj<typeof meta> = {
  args: { name: "source", legend: "Source type", options: [], value: "", onChange: () => undefined },
  render: () => {
    const [value, setValue] = useState("defender");
    return (
      <ChoiceCards
        name="source"
        legend="Source type"
        hideLegend
        options={[
          { value: "defender", label: "Microsoft Defender XDR", description: "Incidents and alerts as they happen.", more: "Every Defender product and Sentinel, with each update.", group: "Recommended for Microsoft" },
          { value: "entra", label: "Microsoft Entra ID", description: "Sign-in and audit logs.", group: "Recommended for Microsoft" },
          { value: "hub", label: "Azure Event Hub", description: "Streaming API and diagnostic settings.", group: "Azure" },
          { value: "activity", label: "Azure activity log", description: "Control-plane operations of one subscription.", group: "Azure" },
          { value: "file", label: "File drop", description: "Exports uploaded by hand.", group: "Other" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Recommended for Microsoft")).toBeVisible();
    await expect(canvas.getByRole("radio", { name: /Defender/ })).toBeChecked();
  },
};
