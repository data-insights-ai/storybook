import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { InlineForm } from "./InlineForm";
import { Select } from "../../../forms/select/Select";
import { TextField } from "../../../forms/text/TextField";

const meta = {
  title: "Layout/Arrangement/InlineForm",
  component: InlineForm,
  tags: ["layer:pattern", "status:deprecated"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof InlineForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: the same row is `<Toolbar fillFirst>`; this name renders it until 0.12. */
export const Inline: Story = {
  render: () => (
    <form>
      <InlineForm>
        <TextField id="if-domain" label="Domain" placeholder="northwind.example" hint="Verified by a DNS record." />
        <Select id="if-mode" label="Sign-in" mono={false} defaultValue="required">
          <option value="required">Required</option>
          <option value="optional">Optional</option>
        </Select>
        <Button type="submit">Add domain</Button>
      </InlineForm>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Domain").getBoundingClientRect();
    const button = canvas.getByRole("button", { name: "Add domain" }).getBoundingClientRect();
    if (canvasElement.getBoundingClientRect().width >= 640) {
      await expect(Math.abs(input.top + input.height / 2 - (button.top + button.height / 2))).toBeLessThan(2);
    }
  },
};
