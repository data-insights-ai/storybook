import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "../forms/Choice";
import { Disclosure, DisclosureLead } from "./Disclosure";
import { Stack } from "./Layout";

const meta = {
  title: "Layout/Folding/Disclosure",
  component: Disclosure,
  tags: ["layer:block", "autodocs"],
} satisfies Meta<typeof Disclosure>;

export default meta;

function Group() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState(["granted"]);
  const all = ["granted", "revoked", "role"];
  const toggle = (k: string) => setChosen((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  return (
    <Disclosure
      id="access"
      open={open}
      onOpenChange={setOpen}
      toggleLabel="Show access events"
      meta={`${chosen.length} of ${all.length}`}
    >
      <DisclosureLead>
        <Checkbox
          id="access-all"
          label="Access"
          checked={chosen.length === all.length}
          indeterminate={chosen.length > 0 && chosen.length < all.length}
          onChange={() => setChosen(chosen.length === all.length ? [] : all)}
        />
      </DisclosureLead>
      <Stack gap={8}>
        {all.map((k) => (
          <Checkbox key={k} id={k} label={k} checked={chosen.includes(k)} onChange={() => toggle(k)} />
        ))}
      </Stack>
    </Disclosure>
  );
}

export const GroupOfChoices: StoryObj = {
  render: () => <Group />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Show access events" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText("revoked")).toBeVisible();
    await userEvent.click(canvas.getByLabelText("Access"));
    await expect(canvas.getByText("3 of 3")).toBeVisible();
  },
};
