import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CopyValue } from "./CopyValue";
import { Fact, FactList } from "../../records/FactList";

const meta = {
  title: "Actions/CopyValue",
  component: CopyValue,
  tags: ["layer:primitive", "autodocs"],
  args: {
    value: "6f1c2a9e-4b7d-4e0a-9c55-2f3d8a71b0c4",
    copyLabel: "Copy organization ID",
    copiedLabel: "Copied",
    mono: true,
  },
} satisfies Meta<typeof CopyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Identifier: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Copy organization ID" })).toBeVisible();
  },
};

/** In a fact list, beside the other facts of a record. */
export const InFacts: Story = {
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Name">Northwind Survey</Fact>
      <Fact label="Organization ID">
        <CopyValue {...args} />
      </Fact>
    </FactList>
  ),
};

/**
 * A long webhook URL. It wraps only at its boundaries — after "//", before
 * "/", "." and "-" — so no word of the address is split on a phone, and the
 * whole value stays readable and checkable.
 */
export const LongAddress: Story = {
  args: {
    value: "https://hooks.data-insights.ai/workspaces/northwind-survey/events/signal-forwarding?format=json",
    copyLabel: "Copy webhook URL",
  },
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Endpoint">
        <CopyValue {...args} />
      </Fact>
      <Fact label="Format">JSON</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const value = canvasElement.querySelector(".di-copy-value")!;
    await expect(value.querySelectorAll("wbr").length).toBeGreaterThan(5);
  },
};

/** German labels: the button's name is long, the value wraps the same way. */
export const LongAddressGerman: Story = {
  args: {
    value: "https://hooks.data-insights.ai/arbeitsbereiche/nordwind-umfrage/ereignisse/signalweiterleitung",
    copyLabel: "Webhook-Adresse in die Zwischenablage kopieren",
    copiedLabel: "Kopiert",
  },
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Empfangsadresse">
        <CopyValue {...args} />
      </Fact>
      <Fact label="Signaturverfahren">HMAC-SHA256</Fact>
    </FactList>
  ),
};
