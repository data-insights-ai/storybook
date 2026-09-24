import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileCheck2, Link2, Radio, Stamp } from "lucide-react";
import { expect, within } from "storybook/test";
import { Stage, StageIcon, StageTrack } from "./Stage";

const meta = {
  title: "Blocks/Stage",
  component: Stage,
  tags: ["autodocs"],
  args: {
    step: "01",
    title: "Connect",
    body: "A source is named, reached and checked for a manifest.",
    foot: "≈ 30 seconds",
    current: false,
  },
  argTypes: {
    step: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
    foot: { control: "text" },
    current: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        {/* A stage sits under a section title on a screen; the story
            supplies that level so the heading order stays valid. */}
        <h2 className="di-sr">Pipeline</h2>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stage {...args}>
      <StageIcon>
        <Link2 aria-hidden />
      </StageIcon>
    </Stage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Connect")).toBeVisible();
  },
};

/** The stage the record is in now. */
export const Current: Story = {
  args: { current: true, step: "03", title: "Seal", body: "Every entry gets a hash and a timestamp.", foot: "≈ 4 seconds" },
  render: (args) => (
    <Stage {...args}>
      <StageIcon>
        <Stamp aria-hidden />
      </StageIcon>
    </Stage>
  ),
};

/** The whole track, which is how a stage is read. */
export const Track: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    (Story) => (
      <>
        <h2 className="di-sr">Pipeline</h2>
        <Story />
      </>
    ),
  ],
  render: () => (
    <StageTrack>
      <Stage step="01" title="Connect" body="A source is named, reached and checked for a manifest." foot="≈ 30 seconds">
        <StageIcon>
          <Link2 aria-hidden />
        </StageIcon>
      </Stage>
      <Stage step="02" title="Ingest" body="Entries land in the register, unsealed and not yet citable." foot="continuous">
        <StageIcon>
          <Radio aria-hidden />
        </StageIcon>
      </Stage>
      <Stage step="03" title="Seal" body="Every entry gets a hash and a timestamp." foot="≈ 4 seconds" current={true}>
        <StageIcon>
          <Stamp aria-hidden />
        </StageIcon>
      </Stage>
      <Stage step="04" title="Publish" body="The sealed extract can be cited and verified offline." foot="on request">
        <StageIcon>
          <FileCheck2 aria-hidden />
        </StageIcon>
      </Stage>
    </StageTrack>
  ),
};
