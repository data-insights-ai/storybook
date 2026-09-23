import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Building2,
  Bug,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Database,
  Download,
  Globe,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  Network,
  Plus,
  Radar,
  RefreshCw,
  Rss,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Webhook,
  Workflow,
  X,
} from "lucide-react";
import { Icon } from "./Icon";
import { IconSet } from "../foundations/guide/IconSet";

const meta = {
  title: "Components/Icon",
  component: Icon,
  args: {
    size: 24,
    cited: false,
    label: "",
    children: <Search />,
  },
  argTypes: {
    children: { control: false },
    size: { control: "radio", options: [16, 24] },
    cited: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {};

const consoleIcons: { name: string; icon: ReactNode }[] = [
  { name: "Building2", icon: <Building2 /> },
  { name: "Bug", icon: <Bug /> },
  { name: "ChevronLeft", icon: <ChevronLeft /> },
  { name: "ChevronRight", icon: <ChevronRight /> },
  { name: "CircleUser", icon: <CircleUser /> },
  { name: "Database", icon: <Database /> },
  { name: "Download", icon: <Download /> },
  { name: "Globe", icon: <Globe /> },
  { name: "LockKeyhole", icon: <LockKeyhole /> },
  { name: "LogOut", icon: <LogOut /> },
  { name: "Mail", icon: <Mail /> },
  { name: "MessageSquare", icon: <MessageSquare /> },
  { name: "Network", icon: <Network /> },
  { name: "Plus", icon: <Plus /> },
  { name: "Radar", icon: <Radar /> },
  { name: "RefreshCw", icon: <RefreshCw /> },
  { name: "Rss", icon: <Rss /> },
  { name: "Search", icon: <Search /> },
  { name: "Share2", icon: <Share2 /> },
  { name: "Shield", icon: <Shield /> },
  { name: "ShieldCheck", icon: <ShieldCheck /> },
  { name: "SlidersHorizontal", icon: <SlidersHorizontal /> },
  { name: "UserRound", icon: <UserRound /> },
  { name: "Webhook", icon: <Webhook /> },
  { name: "Workflow", icon: <Workflow /> },
  { name: "X", icon: <X /> },
];

export const Vocabulary: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Brand meanings, with the Lucide export under each one. Import that name from lucide-react and pass the element to Icon.",
      },
    },
  },
  render: () => <IconSet />,
};

export const Console: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Lucide exports already used in the console patterns. Add an icon here when a screen starts using it.",
      },
    },
  },
  render: () => (
    <ul className="di-icon-catalog">
      {consoleIcons.map((item) => (
        <li key={item.name}>
          <Icon>{item.icon}</Icon>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  ),
};
