import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CopyValue } from "./CopyValue";
import { Stack } from "../../layout/arrange/Stack";
import { Fact, FactList } from "../../records/FactList";
import { onPanel } from "../../../../.storybook/onPanel";

const meta = {
  title: "Actions/CopyValue",
  component: CopyValue,
  tags: ["layer:primitive", "autodocs"],
  decorators: [onPanel("Organization")],
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
  render: (args) => (
    <Stack gap={8}>
      <CopyValue {...args} />
      <p style={{ margin: 0 }}>Support asks for this ID when you report a problem.</p>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Copy organization ID" })).toBeVisible();
  },
};

/** The lines a value runs over: one on a wide screen, where a wide fact has the room; at most three on a phone. */
async function expectFewLines(value: Element) {
  const range = document.createRange();
  range.selectNodeContents(value);
  const lines = new Set(Array.from(range.getClientRects(), (line) => Math.round(line.top))).size;
  await expect(lines).toBeLessThanOrEqual(window.innerWidth >= 1000 ? 1 : 3);
}

/** In a fact list, beside the other facts of a record. */
export const InFacts: Story = {
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Name">Northwind Survey</Fact>
      <Fact label="Organization ID">
        <CopyValue {...args} />
      </Fact>
      <Fact label="Region">eu-central</Fact>
    </FactList>
  ),
};

/**
 * A long webhook URL, in a `Fact wide` so it takes the list's whole row: one
 * line on a wide screen. It wraps only at its boundaries — after "//",
 * before "/", "." and "-" — so no word of the address is split on a phone,
 * and the whole value stays readable and checkable.
 */
export const LongAddress: Story = {
  args: {
    value: "https://hooks.data-insights.ai/workspaces/northwind-survey/events/signal-forwarding?format=json",
    copyLabel: "Copy webhook URL",
  },
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Endpoint" wide>
        <CopyValue {...args} />
      </Fact>
      <Fact label="Format">JSON</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const value = canvasElement.querySelector(".di-copy-value")!;
    await expect(value.querySelectorAll("wbr").length).toBeGreaterThan(5);
    await expectFewLines(value);
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
      <Fact label="Empfangsadresse" wide>
        <CopyValue {...args} />
      </Fact>
      <Fact label="Signaturverfahren">HMAC-SHA256</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    await expectFewLines(canvasElement.querySelector(".di-copy-value")!);
  },
};
