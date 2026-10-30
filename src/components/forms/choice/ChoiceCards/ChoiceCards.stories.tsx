import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cloud, Database, FileText, Info, Mail, MessageSquare, Server, Shield, Webhook } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Notice, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../../../feedback/Notice";
import { ChoiceCards } from "./ChoiceCards";

const meta = {
  title: "Forms/Choice/ChoiceCards",
  component: ChoiceCards,
  tags: ["layer:block", "autodocs"],
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
  render: function Render() {
    const [value, setValue] = useState("defender");
    return (
      <ChoiceCards
        name="source"
        legend="Source type"
        hideLegend
        options={[
          {
            value: "defender",
            label: "Microsoft Defender XDR",
            description: "Incidents and alerts as they happen.",
            more: "Every Defender product and Sentinel, with each update.",
            group: "Recommended for Microsoft",
          },
          {
            value: "entra",
            label: "Microsoft Entra ID",
            description: "Sign-in and audit logs.",
            group: "Recommended for Microsoft",
          },
          {
            value: "hub",
            label: "Azure Event Hub",
            description: "Streaming API and diagnostic settings.",
            group: "Azure",
          },
          {
            value: "activity",
            label: "Azure activity log",
            description: "Control-plane operations of one subscription.",
            group: "Azure",
          },
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

/**
 * Kinds the product is built for but cannot offer yet, under the cards:
 * smaller dashed tiles in a list, five a row on a wide page, not radios, so
 * Tab and the arrow keys pass them by.
 */
export const Planned: StoryObj<typeof meta> = {
  args: { name: "source", legend: "Source type", options: [], value: "", onChange: () => undefined },
  render: function Render() {
    const [value, setValue] = useState("defender");
    return (
      <ChoiceCards
        name="source"
        legend="Source type"
        hideLegend
        options={[
          {
            value: "defender",
            label: "Microsoft Defender XDR",
            description: "Incidents and alerts as they happen.",
            icon: <Shield />,
          },
          {
            value: "hub",
            label: "Azure Event Hub",
            description: "Streaming API and diagnostic settings.",
            icon: <Cloud />,
          },
          { value: "file", label: "File drop", description: "Exports uploaded by hand.", icon: <FileText /> },
        ]}
        value={value}
        onChange={setValue}
        planned={{
          label: "Coming later",
          lede: "Planned sources, not available yet.",
          options: [
            { value: "syslog", label: "Syslog", icon: <Server /> },
            { value: "s3", label: "Object storage", icon: <Database /> },
            { value: "mail", label: "Mail gateway", icon: <Mail /> },
            { value: "chat", label: "Chat audit log", icon: <MessageSquare /> },
            { value: "hook", label: "Generic webhook", icon: <Webhook /> },
            { value: "edr", label: "Endpoint agent", icon: <Shield /> },
          ],
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", { name: "Coming later" });
    await expect(within(list).getAllByRole("listitem")).toHaveLength(6);
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
    await expect(within(list).queryByRole("radio")).toBeNull();
    await expect(canvas.getByRole("radio", { name: /Defender/ })).toBeChecked();
  },
};

const guides: Record<string, string> = {
  defender: "Register an app in the tenant, grant it Security Reader, and paste its client id in the next step.",
  hub: "Create a consumer group for this workspace on the hub, then paste its connection string in the next step.",
  file: "Upload one export now; each later file goes through the same drop.",
};

/**
 * The slot between the cards and the planned list: what the chosen card
 * asks of the reader next. It follows the choice, so it stays under the
 * cards and above what cannot be chosen yet.
 */
export const WithGuide: StoryObj<typeof meta> = {
  name: "With a guide",
  args: { name: "source", legend: "Source type", options: [], value: "", onChange: () => undefined },
  render: function Render() {
    const [value, setValue] = useState("defender");
    return (
      <ChoiceCards
        name="source-guided"
        legend="Source type"
        options={[
          {
            value: "defender",
            label: "Microsoft Defender XDR",
            description: "Incidents and alerts as they happen.",
            icon: <Shield />,
          },
          {
            value: "hub",
            label: "Azure Event Hub",
            description: "Streaming API and diagnostic settings.",
            icon: <Cloud />,
          },
          { value: "file", label: "File drop", description: "Exports uploaded by hand.", icon: <FileText /> },
        ]}
        value={value}
        onChange={setValue}
        planned={{ label: "Coming later", options: [{ value: "syslog", label: "Syslog", icon: <Server /> }] }}
      >
        <Notice>
          <NoticeIcon>
            <Info />
          </NoticeIcon>
          <NoticeText>
            <div>
              <NoticeTitle>Before you continue</NoticeTitle>
              <NoticeBody>{guides[value]}</NoticeBody>
            </div>
          </NoticeText>
        </Notice>
      </ChoiceCards>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const guide = canvas.getByText("Before you continue");
    const planned = canvas.getByRole("list", { name: "Coming later" });
    const cards = canvas.getByRole("radio", { name: /File drop/ }).closest("label") as HTMLElement;
    await expect(guide.getBoundingClientRect().top).toBeGreaterThan(cards.getBoundingClientRect().bottom);
    await expect(planned.getBoundingClientRect().top).toBeGreaterThan(guide.getBoundingClientRect().bottom);
    await userEvent.click(canvas.getByText("File drop"));
    await expect(canvas.getByText(/Upload one export now/)).toBeVisible();
  },
};
