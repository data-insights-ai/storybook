import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { DetailSection, DetailSectionActions, DetailSectionForm } from "./DetailSection";
import { Fact, FactList } from "../../../data/records/FactList";
import { Select } from "../../../forms/select/Select";
import { TextField } from "../../../forms/text/TextField";

const meta = {
  title: "Layout/Page/DetailSection",
  component: DetailSection,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "General",
    lede: "The name members and partners see.",
    editLabel: "Edit",
    editing: false,
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof DetailSection>;

export default meta;
type Story = StoryObj<typeof meta>;

function Editable(args: { title: string; lede?: string; editLabel?: string }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Northwind Survey");
  const [draft, setDraft] = useState(name);
  return (
    <DetailSection {...args} editing={editing} onEdit={() => (setDraft(name), setEditing(true))}>
      <FactList layout="columns">
        <Fact label="Name">{name}</Fact>
        <Fact label="Kind">Customer</Fact>
      </FactList>
      <DetailSectionForm
        saveLabel="Save"
        cancelLabel="Cancel"
        onCancel={() => setEditing(false)}
        onSubmit={() => (setName(draft), setEditing(false))}
      >
        <TextField id="org-name" label="Name" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <Select id="org-kind" label="Kind" mono={false} defaultValue="customer">
          <option value="customer">Customer</option>
          <option value="partner">Partner</option>
        </Select>
      </DetailSectionForm>
    </DetailSection>
  );
}

/** Reads by default; Edit switches this section into its form, Save or Cancel switches back. */
export const ReadThenEdit: Story = {
  render: (args) => <Editable {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit" }));
    const field = canvas.getByLabelText("Name");
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.clear(field);
    await userEvent.type(field, "Northwind Research");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(canvas.getByText("Northwind Research")).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("button", { name: "Edit" })).toHaveFocus());
  },
};

/** A section that only reads, with its own action beside the title. */
export const WithActions: Story = {
  args: { title: "Domains", lede: "Addresses at these domains sign in through this connection.", editLabel: "" },
  render: (args) => (
    <DetailSection {...args}>
      <DetailSectionActions>
        <Button variant="secondary" size="sm">
          Add domain
        </Button>
      </DetailSectionActions>
      <FactList layout="columns">
        <Fact label="Verified">northwind.example</Fact>
      </FactList>
    </DetailSection>
  ),
};
