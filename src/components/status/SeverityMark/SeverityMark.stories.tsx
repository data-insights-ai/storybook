import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SeverityMark, type Severity } from "./SeverityMark";

const meta = {
  title: "Status/SeverityMark",
  component: SeverityMark,
  tags: ["layer:primitive", "autodocs"],
  args: { level: "high", label: "High", variant: "mark" },
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** how severe something is, on the one five-step scale every product and chart shares.",
          "**When to use:** a case, a finding, an alert, a signal: beside its name, in a list or a column headed “Severity”. **When not to:** a run state (running, failed) is a `StatusPill`; a measured level against bands is a `LevelMeter`.",
          "**Anatomy:** four steps that fill as the level rises (info fills none; its first step is outlined), then the word in text colour.",
          "**Variants:** `mark` (default); `chip` lays a tint under a critical item that has to stop the eye, once per view; `bare` keeps the word for screen readers only, under a “Severity” column header.",
          "**Content rules:** the word is the level in the reader’s language (Kritisch, Hoch, Mittel, Niedrig, Info). The word is regular weight: in a card or a hero the title is the one bold line.",
          "**Accessibility:** the steps are hidden; the word is read. Colour is never the only channel: the step count and the word carry the level.",
        ].join("\n\n"),
      },
    },
  },
  argTypes: {
    level: { control: "radio", options: ["critical", "high", "medium", "low", "info"] },
    label: { control: "text" },
    variant: { control: "radio", options: ["mark", "chip", "bare"] },
  },
} satisfies Meta<typeof SeverityMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A filled mark and the word: the word carries the meaning, the colour confirms it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("High")).toBeVisible();
    await expect(canvasElement.querySelectorAll(".di-sev-step.is-on")).toHaveLength(3);
  },
};

const scale: Array<[Severity, string]> = [
  ["critical", "Critical"],
  ["high", "High"],
  ["medium", "Medium"],
  ["low", "Low"],
  ["info", "Info"],
];

/** A case list, the usual place: the mark and the word lead each row, the name stays the strongest text. */
export const InAList: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul style={{ display: "grid", gap: "var(--di-gap-12)", maxWidth: 480, margin: 0, padding: 0, listStyle: "none" }}>
      {(
        [
          ["critical", "Kritisch", "Anmeldung mit gestohlenem Dienstkonto"],
          ["high", "Hoch", "Ungewöhnlicher Datenabfluss aus dem Dateiserver"],
          ["medium", "Mittel", "Veraltete Agentenversion auf zwölf Endgeräten"],
          ["low", "Niedrig", "Fehlgeschlagene Anmeldungen außerhalb der Arbeitszeit"],
        ] as Array<[Severity, string, string]>
      ).map(([level, word, title]) => (
        <li
          key={level}
          style={{
            display: "grid",
            gridTemplateColumns: "6.5rem 1fr",
            gap: "var(--di-gap-12)",
            alignItems: "baseline",
          }}
        >
          <SeverityMark level={level} label={word} />
          <span>{title}</span>
        </li>
      ))}
    </ul>
  ),
};

/** The one scale, in order. Every product and every chart uses these five. */
export const Scale: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--di-gap-24)" }}>
      {scale.map(([level, label]) => (
        <SeverityMark key={level} level={level} label={label} />
      ))}
    </div>
  ),
};

/** The tint stops the eye on a critical item, such as a case's own header. */
export const Chip: Story = {
  args: { level: "critical", label: "Critical", variant: "chip" },
};

/** In a column headed "Severity" the word is read out but not printed. */
export const Bare: Story = {
  args: { level: "medium", label: "Medium", variant: "bare" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Medium")).toHaveClass("di-sr");
  },
};
