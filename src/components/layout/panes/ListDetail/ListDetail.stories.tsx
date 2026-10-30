import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  ListDetail,
  ListDetailBack,
  ListDetailHead,
  ListDetailItem,
  ListDetailItems,
  ListDetailList,
  ListDetailPane,
} from "./ListDetail";

/** Deprecated: `ListDetail` is `Split variant="list"`. Removed in 0.12. */
const meta = {
  title: "Layout/Panes/ListDetail",
  component: ListDetail,
  tags: ["layer:pattern", "status:deprecated"],
  args: { showing: "list", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ListDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

function Cases() {
  const [showing, setShowing] = useState<"list" | "detail">("list");
  return (
    <ListDetail showing={showing}>
      <ListDetailList label="Cases">
        <ListDetailHead>
          <span>1 open case</span>
        </ListDetailHead>
        <ListDetailItems>
          <ListDetailItem
            title="Port scan from a workstation"
            meta="Case 3"
            selected
            onSelect={() => setShowing("detail")}
          />
        </ListDetailItems>
      </ListDetailList>
      <ListDetailPane label="Case 3">
        <ListDetailBack label="All cases" onBack={() => setShowing("list")} />
        <p>Port scan from a workstation.</p>
      </ListDetailPane>
    </ListDetail>
  );
}

/** The old names render `Split variant="list"`. */
export const Deprecated: Story = {
  globals: { viewport: { value: "wide" } },
  render: () => <Cases />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole("button", { current: true });
    await userEvent.click(item);
    await expect(canvas.getByRole("region", { name: "Case 3" })).toBeVisible();
  },
};
