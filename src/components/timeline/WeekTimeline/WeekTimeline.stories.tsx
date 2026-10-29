import type { Meta, StoryObj } from "@storybook/react-vite";
import { WeekTimeline } from "./WeekTimeline";

const night = [
  { from: 0, to: 7 * 60 },
  { from: 21 * 60, to: 24 * 60 },
];

const meta = {
  title: "Timeline/WeekTimeline",
  component: WeekTimeline,
  tags: ["layer:primitive", "autodocs"],
  args: {
    summary: "Quiet every night from 21:00 to 07:00 and all weekend",
    rows: [
      { label: "Mon", spans: night },
      { label: "Tue", spans: night },
      { label: "Wed", spans: night },
      { label: "Thu", spans: night },
      { label: "Fri", spans: night },
      { label: "Sat", spans: [{ from: 0, to: 1440 }] },
      { label: "Sun", spans: [{ from: 0, to: 1440 }] },
    ],
  },
} satisfies Meta<typeof WeekTimeline>;

export default meta;

export const QuietHours: StoryObj<typeof meta> = {};
