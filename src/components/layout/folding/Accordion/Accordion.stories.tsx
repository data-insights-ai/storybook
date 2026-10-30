import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Panel } from "../../page/Panel";
import { Accordion, AccordionDetail, AccordionItem } from "./Accordion";

/** Deprecated: `Accordion` is `DisclosureGroup` with a `Disclosure toggle="head"` per group. Removed in 0.12. */
const meta = {
  title: "Layout/Folding/Accordion",
  component: Accordion,
  tags: ["layer:block", "status:deprecated"],
  args: { label: "Signals by attack phase", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function Phases({ label }: { label: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Panel>
      <Accordion label={label}>
        {[
          ["TA0001", "Initial Access"],
          ["TA0008", "Lateral Movement"],
        ].map(([id, title]) => (
          <AccordionItem key={id} title={title} open={open === id} onOpenChange={(next) => setOpen(next ? id : null)}>
            <AccordionDetail>{id}</AccordionDetail>
            <p>Signals in {title}.</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Panel>
  );
}

/** The old names render the merged `Disclosure`. */
export const Deprecated: Story = {
  render: (args) => <Phases label={args.label} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const head = canvas.getByRole("button", { name: /Lateral Movement/ });
    await userEvent.click(head);
    await expect(head).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("region", { name: "Lateral Movement" })).toBeVisible();
  },
};
