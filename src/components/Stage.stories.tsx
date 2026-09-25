import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileCheck2, Link2, Radio, Stamp } from "lucide-react";
import { expect, within } from "storybook/test";
import { SealValue } from "./Seal";
import { Spinner } from "./Spinner";
import { Stage, StageFooter, StageIcon, StageTrack } from "./Stage";

const meta = {
  title: "Blocks/Stage",
  component: Stage,
  tags: ["autodocs"],
  args: {
    step: "01",
    title: "Connect",
    body: "A source is named, reached and checked for a manifest.",
    current: false,
  },
  argTypes: {
    step: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
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
      <StageFooter>≈ 30 seconds</StageFooter>
    </Stage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Connect")).toBeVisible();
  },
};

/**
 * The stage the record is in now. The closing line is a slot, so the step
 * that is running can say so with a `Spinner` instead of a frozen string.
 */
export const Current: Story = {
  args: { current: true, step: "03", title: "Seal", body: "Every entry gets a hash and a timestamp." },
  render: (args) => (
    <Stage {...args}>
      <StageIcon>
        <Stamp aria-hidden />
      </StageIcon>
      <StageFooter>
        <Spinner label="sealing" />
      </StageFooter>
    </Stage>
  ),
};

/** A step that finished reports the value it recorded, sealed. */
export const SealedFoot: Story = {
  name: "Sealed foot",
  args: { step: "03", title: "Seal", body: "Every entry gets a hash and a timestamp." },
  render: (args) => (
    <Stage {...args}>
      <StageIcon>
        <Stamp aria-hidden />
      </StageIcon>
      <StageFooter>
        <SealValue stateLabel="Sealed">a4f9c21e</SealValue>
      </StageFooter>
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
      <Stage step="01" title="Connect" body="A source is named, reached and checked for a manifest.">
        <StageIcon>
          <Link2 aria-hidden />
        </StageIcon>
        <StageFooter>≈ 30 seconds</StageFooter>
      </Stage>
      <Stage step="02" title="Ingest" body="Entries land in the register, unsealed and not yet citable.">
        <StageIcon>
          <Radio aria-hidden />
        </StageIcon>
        <StageFooter>continuous</StageFooter>
      </Stage>
      <Stage step="03" title="Seal" body="Every entry gets a hash and a timestamp." current={true}>
        <StageIcon>
          <Stamp aria-hidden />
        </StageIcon>
        <StageFooter>≈ 4 seconds</StageFooter>
      </Stage>
      <Stage step="04" title="Publish" body="The sealed extract can be cited and verified offline.">
        <StageIcon>
          <FileCheck2 aria-hidden />
        </StageIcon>
        <StageFooter>on request</StageFooter>
      </Stage>
    </StageTrack>
  ),
};
