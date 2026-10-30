import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocCasesA } from "./SocCasesA";
import { SocCasesToday } from "./SocCasesToday";

const meta = {
  title: "Direction A/Screens/SOC cases",
  component: SocCasesA,
  tags: ["layer:screen", "!autodocs", "direction:a"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SocCasesA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today: a framed table; a case opens as its own page with seven tabs and a triage rail. */
export const Today: Story = { render: () => <SocCasesToday /> };

/** Direction A: list and case side by side; the case opens on the verdict and its one action. */
export const DirectionA: Story = { name: "Direction A", parameters: { direction: "a" }, render: () => <SocCasesA /> };

/** On a phone the two take turns: here the open case, with the way back to the list. */
export const DirectionAPhoneDetail: Story = {
  name: "Direction A · case open",
  parameters: { direction: "a" },
  render: () => <SocCasesA showing="detail" />,
};
