import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ChoiceGroup } from "../choice/ChoiceGroup";
import { CreateFlow } from "./CreateFlow";
import { Fact, FactList } from "../../records/FactList";
import { TextField } from "../text/TextField";
import { Page } from "../../layout/page/Page";
import { Panel, PanelActions } from "../../layout/page/Panel";
import { Button } from "../../actions/Button";
import { Dialog } from "../../overlays/Dialog";

const steps = ["Choose a type", "Details", "Review"];
const ledes = ["", "How the platform reaches your identity provider.", "The connection is active once it is created."];
const kinds = [
  { value: "oidc", label: "OpenID Connect", description: "Any identity provider that speaks OIDC." },
  { value: "saml", label: "SAML 2.0", description: "A provider that signs SAML assertions." },
  { value: "ldap", label: "LDAP", description: "A directory reached through a relay." },
];

const meta = {
  title: "Forms/CreateFlow",
  component: CreateFlow,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Steps",
    steps,
    step: 0,
    stateLabels: { done: "done", current: "current step", upcoming: "upcoming" },
    backLabel: "Back",
    nextLabel: "Next",
    submitLabel: "Create connection",
    cancelLabel: "Cancel",
    canAdvance: true,
    busy: false,
    error: "",
    onBack: () => {},
    onNext: () => {},
    onSubmit: () => {},
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof CreateFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

function Flow(args: Parameters<typeof CreateFlow>[0]) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState("oidc");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  if (done) return <p>Created {name}.</p>;
  return (
    <CreateFlow
      {...args}
      step={step}
      lede={args.width === "page" ? ledes[step] : undefined}
      canAdvance={step !== 1 || name.trim() !== ""}
      onBack={() => setStep((s) => s - 1)}
      onNext={() => setStep((s) => s + 1)}
      onSubmit={() => setDone(true)}
      onCancel={() => setStep(0)}
    >
      {step === 0 ? (
        <ChoiceGroup appearance="cards" name="kind" legend="Protocol" options={kinds} value={kind} onChange={setKind} />
      ) : null}
      {step === 1 ? (
        <TextField id="conn-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      ) : null}
      {step === 2 ? (
        <FactList layout="columns">
          <Fact label="Protocol">{kinds.find((k) => k.value === kind)?.label}</Fact>
          <Fact label="Name">{name}</Fact>
        </FactList>
      ) : null}
    </CreateFlow>
  );
}

function InADialog(args: Parameters<typeof CreateFlow>[0]) {
  const [open, setOpen] = useState(false);
  return (
    <Panel title="Sign-in connections" heading={2}>
      <PanelActions>
        <Button onClick={() => setOpen(true)}>New connection</Button>
      </PanelActions>
      <p>Members sign in through the connections listed here. None is set up yet.</p>
      <Dialog open={open} onClose={() => setOpen(false)} title="New connection" closeLabel="Close">
        <Flow {...args} />
      </Dialog>
    </Panel>
  );
}

/** In a side `Dialog`: choose the type, fill in the details, review, create. */
export const NewConnection: Story = {
  render: (args) => <InADialog {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "New connection" }));
    const canvas = within(
      await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "New connection" }),
    );
    await userEvent.click(canvas.getByText("SAML 2.0"));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(canvas.getByLabelText("Name")).toHaveFocus());
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
    await userEvent.type(canvas.getByLabelText("Name"), "Head office{Enter}");
    await expect(canvas.getByRole("heading", { name: "Review" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Create connection" })).toBeEnabled();
  },
};

/** The first step in the dialog, the chosen type in focus: the ring sits on the card's edge, whole, inside the scrolling body. */
export const ChoosingAType: Story = {
  render: (args) => <InADialog {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "New connection" }));
    const canvas = within(
      await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "New connection" }),
    );
    await userEvent.click(canvas.getByText("OpenID Connect"));
    await expect(canvas.getByRole("radio", { name: /OpenID Connect/ })).toBeChecked();
  },
};

/** The second step in the dialog, the name field in focus, its ring whole above the sticky actions. */
export const FillingInDetails: Story = {
  render: (args) => <InADialog {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "New connection" }));
    const canvas = within(
      await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "New connection" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(canvas.getByLabelText("Name")).toHaveFocus());
    await userEvent.type(canvas.getByLabelText("Name"), "Head office");
  },
};

/** On its own page (`width="page"`): the step is a panel with its lede, and the cards use the page's width. */
export const OnAPage: Story = {
  args: { width: "page" },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <Page width="detail">
      <Flow {...args} />
    </Page>
  ),
};
