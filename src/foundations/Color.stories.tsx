import type { Meta, StoryObj } from "@storybook/react-vite";
import "./foundations.css";

const families = [
  {
    name: "Navy",
    role: "ink and action",
    swatches: [
      ["Ink", "#0A1F44", "#fcfbf7", "Body text, and the one filled control."],
      ["Ink press", "#061631", "#fcfbf7", "The pressed state of that control."],
      ["Ink 2", "#4A5570", "#fcfbf7", "Secondary copy, labels."],
      ["Ink 3", "#5B6478", "#fcfbf7", "Ordinals, meta, quiet notes."],
    ],
  },
  {
    name: "Gold",
    role: "the seal",
    swatches: [
      ["Seal", "#C9A24A", "#0a1f44", "The mark. A fact, recorded."],
      ["Ring", "#A6811F", "#061631", "The hollow ring. A model's claim."],
      ["Seal ink", "#7A5C0E", "#fcfbf7", "The only gold readable as text on paper."],
      ["Gold 400", "#D9B45E", "#0a1f44", "Gold on the night sheet."],
      ["Seal wash", "#F7EDD5", "#6e4708", "Under a gold word. Never a fill."],
    ],
  },
  {
    name: "Paper",
    role: "the ground",
    swatches: [
      ["Canvas", "#F4F1E8", "#0a1f44", "The page. Warm, and the first tell."],
      ["Sheet", "#FCFBF7", "#0a1f44", "A panel, a field, a card."],
      ["Grid", "#FFFFFF", "#0a1f44", "The one cold surface. Tables only."],
      ["Sunken", "#EAE5D7", "#0a1f44", "A track, a disabled control, a segment."],
      ["Rule", "#DCD5C3", "#0a1f44", "Hairline dividers only. Never a fill."],
    ],
  },
];

const status = [
  ["Verified", "#155230", "#E7EFE5"],
  ["Anomaly", "#6E4708", "#F7EDD5"],
  ["Critical", "#8A1B1B", "#F8E6E2"],
  ["Recorded", "#0A1F44", "#E6E9F0"],
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
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
      <header>
        <h1 className="di-block-title" style={{ fontSize: 32 }}>
          Paper, ink, seal.
        </h1>
        <p className="di-lede">
          Warm paper is the ground. Navy is the ink and, on paper, the only thing that acts — there is no
          invented accent, so what writes is what commits. Gold is not decoration: a filled dot means the
          value is recorded and verifiable, and a hollow ring means a model inferred it and nothing has
          vouched for it yet.
        </p>
      </header>
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
                  <small>{name === "Rule" ? "Ink · 12%" : hex}</small>
                </b>
                <span>{role}</span>
              </div>
            ))}
          </section>
        ))}
      </div>
      <section>
        <h2 className="di-block-title">Operational status</h2>
        <p className="di-lede">
          Four states, and the word always carries the meaning: the dot is a second channel, never the
          only one. Anomaly runs on the gold ramp rather than inventing a second yellow. Each word sits on
          a wash that keeps it above 5:1.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          {status.map(([name, fg, bg]) => (
            <div key={name} className="di-swatch" style={{ background: bg, color: fg, minWidth: 160 }}>
              <b>{name}</b>
              <small>{fg}</small>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="di-block-title">Chart roles</h2>
        <p className="di-lede">
          A chart has one series in navy and everything else in warm neutral. Accent is the single value
          the eye should land on. A semantic hue appears only where a reading crossed a threshold — never
          to tell two ordinary series apart.
        </p>
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
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Color",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Palette: Story = { render: () => <Board /> };
