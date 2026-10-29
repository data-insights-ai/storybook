import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ChoiceCards } from "../forms/choice/ChoiceCards";
import { CreateFlow } from "./CreateFlow";
import { Fact, FactList } from "../data/records/FactList";
import { TextField } from "../forms/text/TextField";
import { Page } from "../layout/Page";

const steps = ["Choose a type", "Details", "Review"];
const ledes = ["", "How the platform reaches your identity provider.", "The connection is active once it is created."];
const kinds = [
  { value: "oidc", label: "OpenID Connect", description: "Any identity provider that speaks OIDC." },
  { value: "saml", label: "SAML 2.0", description: "A provider that signs SAML assertions." },
  { value: "ldap", label: "LDAP", description: "A directory reached through a relay." },
];

const meta = {
  title: "Overlays/CreateFlow",
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
      {step === 0 ? <ChoiceCards name="kind" legend="Protocol" options={kinds} value={kind} onChange={setKind} /> : null}
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

/** Choose the type, fill in the details, review, create. */
export const NewConnection: Story = {
  render: (args) => <Flow {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("SAML 2.0"));
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(canvas.getByLabelText("Name")).toHaveFocus());
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
    await userEvent.type(canvas.getByLabelText("Name"), "Head office{Enter}");
    await expect(canvas.getByRole("heading", { name: "Review" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Create connection" }));
    await expect(canvas.getByText("Created Head office.")).toBeVisible();
  },
};

/** On its own page (`width="page"`): the step is a panel with its lede, and the cards use the page's width. */
export const OnAPage: Story = {
  args: { width: "page" },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div style={{ padding: 32 }}>
      <Page width="detail">
        <Flow {...args} />
      </Page>
    </div>
  ),
};
