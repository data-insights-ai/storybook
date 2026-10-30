import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Plus } from "lucide-react";
import { Button } from "../../actions/Button";
import { SegmentedControl } from "../../forms/choice/SegmentedControl";
import { TextField } from "../../forms/text/TextField";
import { Panel } from "../../layout/page/Panel";
import { Stack } from "../../layout/arrangement/Stack";
import { Toolbar } from "../../layout/arrangement/Toolbar";
import { DensityProvider, densityChoices, useDensity, type Density } from "./DensityProvider";

const labels: Record<Density, string> = { comfortable: "Comfortable", compact: "Compact" };

/** A setting anywhere below the provider changes the density through the hook. */
function DensitySetting() {
  const { density, setDensity } = useDensity();
  return (
    <SegmentedControl
      name="density"
      legend="Density"
      value={density}
      onChange={(next) => setDensity(next as Density)}
      options={densityChoices.map((value) => ({ value, label: labels[value] }))}
    />
  );
}

/** The app keeps the choice (the person's preference) and hands it to the provider. */
function Sample({ initial }: { initial: Density }) {
  const [density, setDensity] = useState<Density>(initial);
  return (
    <DensityProvider value={density} onChange={setDensity}>
      <Stack gap={16}>
        <Panel title="Display" heading={2}>
          <DensitySetting />
        </Panel>
        <Panel title="Sources" heading={2}>
          <Toolbar>
            <TextField id="density-name" label="Name" placeholder="edge-gw-01" />
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">
              <Plus /> Large
            </Button>
          </Toolbar>
        </Panel>
      </Stack>
    </DensityProvider>
  );
}

const meta = {
  title: "Shell/DensityProvider",
  tags: ["layer:pattern"],
  component: DensityProvider,
  args: { value: "comfortable", children: null },
  argTypes: { value: { control: "radio", options: densityChoices }, children: { control: false } },
  render: ({ value = "comfortable" }: ComponentProps<typeof DensityProvider>) => <Sample initial={value} />,
} satisfies Meta<typeof DensityProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const root = () => document.documentElement.getAttribute("data-density");
const height = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("button", { name }).getBoundingClientRect().height;

/** Compact shrinks every size; the large button stays larger than the medium one in both. */
export const Choice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    await waitFor(() => expect(root()).toBe("comfortable"));
    const medium = height(canvas, "Medium");
    const large = height(canvas, "Large");
    await expect(large).toBeGreaterThan(medium);

    await userEvent.click(canvas.getByRole("radio", { name: "Compact" }));
    await waitFor(() => expect(root()).toBe("compact"));
    await expect(height(canvas, "Large")).toBeGreaterThan(height(canvas, "Medium"));
    if (!coarse) await expect(height(canvas, "Medium")).toBeLessThan(medium);
  },
};

/** The person's saved choice arrives as the value. */
export const Compact: Story = {
  args: { value: "compact" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(root()).toBe("compact"));
    await expect(canvas.getByRole("radio", { name: "Compact" })).toBeChecked();
  },
};
