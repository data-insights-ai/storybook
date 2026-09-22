import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShieldCheck } from "lucide-react";
import { Button } from "./Button";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  tags: ["autodocs"],
  args: {
    tone: "info",
  },
  argTypes: {
    tone: { control: "radio", options: ["info", "ok", "warn"] },
    children: { control: false },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Policy: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <Notice {...args}>
      <NoticeText>
        <NoticeTitle>Centrally managed policy</NoticeTitle>
        <NoticeBody>Webhook endpoints are changed in the company security portal.</NoticeBody>
      </NoticeText>
    </Notice>
  ),
};

export const Protection: Story = {
  args: { tone: "ok" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <ShieldCheck aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <NoticeTitle>Protection is active</NoticeTitle>
        <NoticeBody>Watched entries are checked continuously against the connected sources.</NoticeBody>
      </NoticeText>
      <NoticeAction>
        <Button size="sm">Details</Button>
      </NoticeAction>
    </Notice>
  ),
};
