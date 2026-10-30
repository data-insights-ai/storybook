import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { FieldStack } from "../../../layout/arrangement/FieldStack";
import { Stack } from "../../../layout/arrangement/Stack";
import { Panel } from "../../../layout/page/Panel";
import { TextArea } from "../../text/TextArea";
import { TextField } from "../../text/TextField";
import { SaveBar } from "./SaveBar";

const meta = {
  title: "Forms/Field/SaveBar",
  component: SaveBar,
  tags: ["layer:form", "autodocs"],
  args: { label: "Unsaved changes", message: "2 unsaved changes in the alert template", children: null },
} satisfies Meta<typeof SaveBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Under a long form, after the last panel: it stays at the bottom of the
 * window while the form scrolls, and leaves once the changes are saved or
 * discarded. A short form ends in `Actions` instead.
 */
export const Unsaved: Story = {
  render: (args) => (
    <Stack gap={24}>
      <Panel title="Alert template" heading={2}>
        <FieldStack>
          <TextField id="subject" label="Subject" defaultValue="{{severity}} on {{host}}: {{rule}}" mono={true} />
          <TextArea
            id="body"
            label="Body"
            rows={14}
            mono={true}
            defaultValue={"Case {{case.id}} was opened at {{case.opened}}.\n\nRule: {{rule}}\nHost: {{host}}\nOperator: {{operator}}\n\nOpen the case: {{case.url}}"}
          />
        </FieldStack>
      </Panel>
      <SaveBar {...args}>
        <Button variant="secondary">Discard</Button>
        <Button>Save changes</Button>
      </SaveBar>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Unsaved changes" });
    await expect(region).toHaveTextContent("2 unsaved changes in the alert template");
  },
};
