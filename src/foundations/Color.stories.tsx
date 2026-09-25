import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, Section } from "./guide/Guide";
import "./foundations.css";

const families = [
  {
    name: "Navy",
    role: "ink and action",
    swatches: [
      ["--di-text", "#0A1F44", "#fcfbf7", "Body text, and the one filled control."],
      ["--di-text-press", "#061631", "#fcfbf7", "The pressed state of that control."],
      ["--di-text-muted", "#4A5570", "#fcfbf7", "Secondary copy, labels."],
      ["--di-text-subtle", "#5B6478", "#fcfbf7", "Ordinals, meta, quiet notes."],
    ],
  },
  {
    name: "Gold",
    role: "the seal",
    swatches: [
      ["--di-seal", "#C9A24A", "#0a1f44", "The mark. A fact, recorded."],
      ["--di-ai-ring", "#A6811F", "#061631", "The hollow ring. A model's claim."],
      ["--di-seal-ink", "#7A5C0E", "#fcfbf7", "The only gold readable as text on paper."],
      ["--di-gold-400", "#D9B45E", "#0a1f44", "Gold on the night sheet."],
      ["--di-seal-bg", "#F7EDD5", "#6e4708", "Under a gold word. Never a fill."],
    ],
  },
  {
    name: "Paper",
    role: "the ground",
    swatches: [
      ["--di-bg-page", "#F4F1E8", "#0a1f44", "The page. Warm, and the first tell."],
      ["--di-bg-surface", "#FCFBF7", "#0a1f44", "A panel, a field, a card."],
      ["--di-bg-grid", "#FFFFFF", "#0a1f44", "The one cold surface. Tables only."],
      ["--di-bg-subtle", "#EAE5D7", "#0a1f44", "A track, a disabled control, a segment."],
      ["--di-rule", "#DCD5C3", "#0a1f44", "Hairline dividers only. Never a fill."],
    ],
  },
];

const status = [
  ["Verified", "#155230", "#E7EFE5"],
  ["Anomaly", "#6E4708", "#F7EDD5"],
  ["Critical", "#8A1B1B", "#F8E6E2"],
  ["Recorded", "#0A1F44", "#E6E9F0"],
];

/*
 * The night sheet. The page documented daylight only, while every
 * component ships a dark remap — so the one place a designer could check
 * what dark actually does was the components themselves.
 */
const night = [
  ["--di-bg-page", "#071229", "#f2f5fb", "The page, after dark."],
  ["--di-bg-surface", "#0c1b37", "#f2f5fb", "A panel on that ground."],
  ["--di-fill-strong", "#c9a24a", "#241a02", "The committing control. Gold, because navy cannot act on navy."],
  ["--di-focus", "#d9b45e", "#241a02", "The focus ring follows its ground."],
  ["--di-seal", "#c9a24a", "#241a02", "The seal does not move. A fact is a fact in either theme."],
  ["--di-seal-ink", "#d9b45e", "#241a02", "Gold read as text on navy is Gold 400."],
];

const chartRoles = [
  ["Series", "--di-chart-series", "var(--di-chart-series)", "The recorded line."],
  ["Accent", "--di-chart-accent", "var(--di-chart-accent)", "The one value."],
  ["Muted", "--di-chart-muted", "var(--di-chart-muted)", "A comparison bar."],
  ["Strong", "--di-chart-muted-strong", "var(--di-chart-muted-strong)", "A second comparison, still grey."],
  ["Band", "--di-chart-band", "var(--di-chart-band)", "The range around a median."],
];

function Board() {
  return (
    <Page
      eyebrow="Colour"
      title="Paper, ink, seal."
      lede="Warm paper is the ground. Navy is the ink and, on paper, the only thing that acts — there is no invented accent, so what writes is what commits. Gold is not decoration: a filled dot means the value is recorded and verifiable, and a hollow ring means a model inferred it and nothing has vouched for it yet."
    >
      <div className="di-ratio" aria-hidden>
        <div style={{ flex: 72, background: "#f4f1e8", color: "#0a1f44" }}>
          <strong>72%</strong>
          Paper
        </div>
        <div style={{ flex: 25, background: "#0a1f44", color: "#fcfbf7" }}>
          <strong>25%</strong>
          Navy
        </div>
        <div style={{ flex: 3, background: "#c9a24a", color: "#0a1f44" }}>
          <strong>3%</strong>
          Gold
        </div>
      </div>
      <Section
        eyebrow="The palette"
        title="Every swatch is a token."
        lede="A component binds to the name on the left, never to the hex. The hex is printed so a designer can check a mock against the build, not so it can be typed into one."
      >
        <div className="di-swatches">
        {families.map((family) => (
          <section key={family.name} className="di-swatch-col">
            <h2>
              {family.name} <span>/ {family.role}</span>
            </h2>
            {family.swatches.map(([name, hex, ink, role]) => (
              <div key={name} className="di-swatch" style={{ background: hex, color: ink }}>
                <b>
                  {name}
                  <small>{hex}</small>
                </b>
                <span>{role}</span>
              </div>
            ))}
          </section>
        ))}
        </div>
      </Section>
      <Section
        eyebrow="Status"
        title="Four states, and the word always carries the meaning."
        lede="The dot is a second channel, never the only one. Anomaly runs on the gold ramp rather than inventing a second yellow. Each word sits on a wash that keeps it above 5:1."
      >
        <div style={{ display: "flex", gap: "var(--di-space-3)", flexWrap: "wrap" }}>
          {status.map(([name, fg, bg]) => (
            <div key={name} className="di-swatch" style={{ background: bg, color: fg, minWidth: 160 }}>
              <b>{name}</b>
              <small>{fg}</small>
            </div>
          ))}
        </div>
      </Section>
      <Section
        eyebrow="After dark"
        title="One exception, and it is the fill."
        lede="Every role remaps, but only one reverses its meaning: navy cannot act as the accent against a navy ground, so the committing control turns gold. That is the single exception in the system, and it exists only on the night sheet."
      >
        <div className="di-swatches">
          <section className="di-swatch-col" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              {night.map(([name, hex, ink, role]) => (
                <div key={name} className="di-swatch" style={{ background: hex, color: ink }}>
                  <b>
                    {name}
                    <small>{hex}</small>
                  </b>
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Section>
      <Section
        eyebrow="Charts"
        title="One series in navy, everything else warm neutral."
        lede="Accent is the single value the eye should land on. A semantic hue appears only where a reading crossed a threshold — never to tell two ordinary series apart."
      >
        <ul className="di-chart-roles">
          {chartRoles.map(([name, token, color, role]) => (
            <li key={name}>
              <i style={{ background: color }} />
              <b>
                {name} <small>{token}</small>
              </b>
              <span>{role}</span>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}

const meta = {
  title: "Foundations/Color",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Palette: Story = { render: () => <Board /> };
