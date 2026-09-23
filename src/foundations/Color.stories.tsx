import type { Meta, StoryObj } from "@storybook/react-vite";
import "./foundations.css";

const families = [
  {
    name: "Navy",
    role: "primary",
    swatches: [
      ["Navy 950", "#05112B", "#f7f4ec", "Deep fields, sidebar."],
      ["Navy 900", "#0A1F44", "#f7f4ec", "Ink, buttons, the voice."],
      ["Navy 800", "#122E5E", "#f7f4ec", "Hover on navy, raised rail."],
      ["Navy 700", "#1D4280", "#f7f4ec", "Supporting navy."],
    ],
  },
  {
    name: "Gold",
    role: "accent",
    swatches: [
      ["Gold 700", "#7C5F17", "#f7f4ec", "Small text on ivory. AA."],
      ["Gold 600", "#A6811F", "#05112b", "Display gold. Navy type, not ivory."],
      ["Gold 500", "#C9A24A", "#0a1f44", "The truth-tittle. Accents only."],
      ["Gold 400", "#D9B86B", "#0a1f44", "Gold type on navy."],
      ["Gold 100", "#F2E5C3", "#0a1f44", "Quiet wash, not a fill."],
    ],
  },
  {
    name: "Neutrals",
    role: "surface",
    swatches: [
      ["Ivory", "#F7F4EC", "#0a1f44", "Page. Warm, not white."],
      ["Paper", "#FBF8F1", "#0a1f44", "Cards and fields."],
      ["Ink", "#0E1528", "#f7f4ec", "Body text on light."],
      ["Rule", "rgba(14, 21, 40, 0.12)", "#0a1f44", "Hairline dividers only. Never a fill."],
    ],
  },
];

const status = [
  ["Running", "#186D41", "#E0E7DC"],
  ["Paused", "#7C5F17", "#FAF3DF"],
  ["Failed", "#AB2E37", "#F1E0DB"],
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
          Four colours. One story.
        </h1>
        <p className="di-lede">
          Ivory is the stage. Navy is the voice. Gold is one moment per view — the tittle in the mark, or a single eyebrow. Never a section fill.
        </p>
      </header>
      <div className="di-ratio" aria-hidden>
        <div style={{ flex: 60, background: "#f7f4ec", color: "#0a1f44" }}>
          <strong>60%</strong>
          Ivory
        </div>
        <div style={{ flex: 30, background: "#0a1f44", color: "#f7f4ec" }}>
          <strong>30%</strong>
          Navy
        </div>
        <div style={{ flex: 10, background: "#c9a24a", color: "#0a1f44" }}>
          <strong>10%</strong>
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
          Paused is Gold 700, the same gold that clears AA on ivory. Running is #186D41 and failed is #AB2E37, the hues from the console screenshots. Each word sits on a wash that keeps it above 5:1.
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
          Charts use the same navy and gold. Series is the line. Accent is the single value the eye should land on. Muted bars are everyone else. The band is a range, not a claim.
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
