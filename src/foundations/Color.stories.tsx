import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Chart, ChartLegend, ChartTooltip, type ChartConfig } from "../components/charts/Chart";
import { Highlight } from "../components/data/text/Highlight";
import { Page, Rule, Rules, Section } from "./guide/Guide";
import "./foundations.css";

const families = [
  {
    name: "Navy",
    role: "ink and action",
    swatches: [
      ["--di-text", "#0A1F44", "#fdfdfb", "Body text, and the one filled control."],
      ["--di-text-press", "#061631", "#fdfdfb", "The pressed state of that control."],
      ["--di-text-muted", "#3D4A66", "#fdfdfb", "Secondary copy, the mono labels above a value."],
      ["--di-text-subtle", "#556076", "#fdfdfb", "Meta lines, ordinals, quiet notes."],
    ],
  },
  {
    name: "Gold",
    role: "the one thing",
    swatches: [
      ["--di-one", "#C9A24A", "#0a1f44", "Marks the one object that matters in a view. In daylight never text."],
      ["--di-one-edge", "#A6811F", "#061631", "Its edge: the attention item, the verdict."],
      ["--di-seal", "#C9A24A", "#0a1f44", "The seal: a brand moment — sign-in, onboarding, a licence or certificate. Never beside the one."],
      ["--di-ai-ring", "#A6811F", "#061631", "The hollow ring beside an inferred value."],
    ],
  },
  {
    name: "Paper",
    role: "depth by tone",
    swatches: [
      ["--di-bg-chrome", "#E9E8E3", "#0a1f44", "The sidebar, one step below the ground. Also --di-bg-strip."],
      ["--di-bg-page", "#F3F2EE", "#0a1f44", "The ground. One token, so a warmer ground is one line."],
      ["--di-bg-subtle", "#EFEEE9", "#0a1f44", "Inset: a table head, a group inside a surface."],
      ["--di-bg-surface", "#FDFDFB", "#0a1f44", "A panel, a table, a list pane. Also --di-bg-pane."],
      ["--di-bg-plane", "#FFFFFF", "#0a1f44", "What floats or is lifted: a menu, the selected row."],
    ],
  },
];

const status = [
  ["Verified", "#155230", "#E2ECE0"],
  ["Warn", "#8A4500", "#FBE7CF"],
  ["Critical", "#8A1B1B", "#F8E2DD"],
  ["Recorded", "#1F5288", "#E2EBF7"],
];

const severities = [
  ["Critical", "--di-severity-critical", "#B3161B", "#FF5F5A"],
  ["High", "--di-severity-high", "#D9481A", "#FF7A3D"],
  ["Medium", "--di-severity-medium", "#B57400", "#FF9D2E"],
  ["Low", "--di-severity-low", "#5D7797", "#94ABCB"],
  ["Info", "--di-severity-info", "#878D99", "#7F8FB0"],
];

/*
 * After dark, rendered from the tokens rather than transcribed from them.
 * The section sits in a `data-theme="dark"` region, so each swatch paints
 * `var(--di-*)` as the dark theme resolves it; the hex beside it is the
 * documented value, a caption rather than the fill.
 */
const night = [
  ["--di-bg-chrome", "--di-text", "#071733", "The sidebar, one step deeper than the ground."],
  ["--di-bg-page", "--di-text", "#0A1F44", "The ground is brand navy, not near-black."],
  ["--di-bg-subtle", "--di-text", "#0C2350", "Inset and strip."],
  ["--di-bg-surface", "--di-text", "#0F2A57", "A surface lifts from the ground."],
  ["--di-bg-plane", "--di-text", "#133068", "The plane: a menu, a lifted row."],
  ["--di-bg-hero", "--di-text", "#1A3A78", "The hero zone, a clear step above a surface (ΔL* ≥ 3, checked in zones.test.ts)."],
  ["--di-fill-strong", "--di-text-on-strong", "#F2F0E6", "The committing control turns paper-white."],
  ["--di-one-ink", "--di-bg-page", "#E6C677", "After dark gold may be read as text."],
  ["--di-select", "--di-bg-page", "#79AEEA", "Selection and focus stay cornflower."],
];

const chartRoles = [
  ["Series", "--di-chart-series", "var(--di-chart-series)", "The recorded line."],
  ["Highlight", "--di-chart-highlight", "var(--di-chart-highlight)", "The one value, in gold."],
  ["Muted", "--di-chart-muted", "var(--di-chart-muted)", "A comparison bar."],
  ["Strong", "--di-chart-muted-strong", "var(--di-chart-muted-strong)", "A second comparison, still grey."],
  ["Band", "--di-chart-band", "var(--di-chart-band)", "The range around a median."],
  ["Warn", "--di-chart-warn", "var(--di-chart-warn)", "Medium on the severity scale."],
  ["Danger", "--di-chart-danger", "var(--di-chart-danger)", "Critical on the severity scale."],
  ["Compare", "--di-chart-compare", "var(--di-chart-compare)", "What the recorded series is measured against."],
];

/*
 * The two accents, painted from the tokens inside a themed region rather
 * than from hex literals, so the swatch is the build and the hex beside it
 * is the caption. Daylight swatches sit in a `data-theme="light"` region so
 * the page reads the same under either toolbar theme; the night swatch is
 * the same role resolved on the night sheet. Brandbook v0.5 calls those
 * `--di-mark-night` and `--di-signal-night`; here they are the dark remap
 * of `--di-highlight` and `--di-signal`, because a theme remaps a role rather
 * than adding a second name for it.
 *
 * Poppy is `--di-highlight` here, not the brandbook's `--di-mark`: "mark"
 * already names the logo mark and the seal mark, and a red token called
 * mark beside a gold mark that means sealed is the one confusion this
 * palette cannot afford. The component is `Highlight`, and so is the role.
 */
const accents = [
  {
    name: "Poppy",
    role: "the highlight",
    swatches: [
      ["--di-highlight", "--di-text-on-strong", "#D23C2E", "light", "A marked passage on a brand page."],
      ["--di-highlight-ink", "--di-text-on-strong", "#A42A1F", "light", "Poppy as text on paper."],
      ["--di-highlight-tint", "--di-highlight-ink", "#FADFDA", "light", "The ground under a marked passage."],
      ["--di-highlight", "--di-bg-page", "#FF7F6E", "dark", "Poppy on the night sheet."],
    ],
  },
  {
    name: "Cornflower",
    role: "selection and signal",
    swatches: [
      ["--di-signal", "--di-text-on-strong", "#2B6CB0", "light", "Selection, focus, a compared series, a note that something is new."],
      ["--di-signal-ink", "--di-text-on-strong", "#1F5288", "light", "Cornflower as text on paper."],
      ["--di-signal-tint", "--di-signal-ink", "#E2EBF7", "light", "The ground of a selected row."],
      ["--di-signal", "--di-bg-page", "#79AEEA", "dark", "Cornflower on the night sheet."],
    ],
  },
] as const;

const coverage = [
  { period: "Q1", recorded: 61, compare: 58 },
  { period: "Q2", recorded: 70, compare: 66 },
  { period: "Q3", recorded: 82, compare: 79 },
  { period: "Q4", recorded: 94, compare: 85 },
];

const coverageConfig = {
  recorded: { label: "Recorded", color: "var(--di-chart-series)" },
  compare: { label: "Comparison", color: "var(--di-chart-compare)" },
} satisfies ChartConfig;

function AccentsInUse() {
  return (
    <div className="di-accent-use">
      <p className="di-accent-use-eyebrow">In use</p>
      <p className="di-accent-use-claim">
        Coverage rose to <Highlight variant="figure">94 %</Highlight> —{" "}
        <Highlight>without a new source</Highlight>.
      </p>
      <Chart label="Coverage by quarter, recorded against comparison" config={coverageConfig}>
        <BarChart data={coverage} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barGap={2}>
          <XAxis dataKey="period" tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip />
          <ChartLegend />
          <Bar dataKey="recorded" fill="var(--color-recorded)" radius={0} />
          <Bar dataKey="compare" fill="var(--color-compare)" radius={0} />
        </BarChart>
      </Chart>
    </div>
  );
}

function Board() {
  return (
    <Page
      eyebrow="Colour"
      title="Paper, navy, one gold."
      lede="A cool paper is the ground and depth is a step in tone, not a line. Navy is the ink and, in daylight, the only thing that acts. Gold marks the one thing that matters in a view — an object, never a word in daylight. Cornflower is selection and focus. Severity is one scale for everything."
    >
      <div className="di-ratio" aria-hidden>
        <div style={{ flex: 72, background: "#f3f2ee", color: "#0a1f44" }}>
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
        <Rules>
          <Rule>In an operational view gold marks one object: the first attention item, a verdict, the one value of a chart. In daylight it is an edge or a mark, never text.</Rule>
          <Rule>The seal is gold too, and so it is a brand moment only: sign-in, the brand mark, an empty or onboarding state, a licence or certificate seal. It never appears in an operational view beside the one, and the seal button is never an operational action.</Rule>
        </Rules>
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
        lede="The dot is a second channel, never the only one. Warn is its own amber, so it never reads as the one gold. Each word sits on a wash that keeps it above 5:1."
      >
        <div style={{ display: "flex", gap: "var(--di-space-12)", flexWrap: "wrap" }}>
          {status.map(([name, fg, bg]) => (
            <div key={name} className="di-swatch" style={{ background: bg, color: fg, minWidth: 160 }}>
              <b>{name}</b>
              <small>{fg}</small>
            </div>
          ))}
        </div>
      </Section>
      <Section
        eyebrow="Severity"
        title="One scale, in every product and every chart."
        lede="A filled mark beside the word, never colour alone and never the text's own colour. After dark medium runs orange rather than yellow, so it never reads as gold."
      >
        <div className="di-swatches">
          {(["light", "dark"] as const).map((theme) => (
            <section key={theme} className="di-swatch-col" data-theme={theme} style={{ background: "var(--di-bg-page)" }}>
              {severities.map(([word, token, day, night]) => (
                <div key={token} className="di-swatch is-mark">
                  <i style={{ background: `var(${token})` }} aria-hidden />
                  <b>
                    {word}
                    <small>{theme === "light" ? day : night}</small>
                  </b>
                </div>
              ))}
            </section>
          ))}
        </div>
      </Section>
      <Section
        eyebrow="After dark"
        title="Designed, not inverted."
        lede="The ground is brand navy and the surfaces lift from it in tone; the sidebar sits one step deeper. Navy cannot act on navy, so the committing control turns paper-white. Gold may be text here."
      >
        <div className="di-swatches" data-theme="dark">
          <section className="di-swatch-col" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              {night.map(([name, ink, hex, role]) => (
                <div key={name} className="di-swatch" style={{ background: `var(${name})`, color: `var(${ink})` }}>
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
        eyebrow="Accents"
        title="Poppy marks a passage. Cornflower selects."
        lede="Clear primaries that carry at a distance. Poppy marks a passage on a brand page; cornflower is selection, focus and a compared series. Neither is a status and neither fills a button."
      >
        <div className="di-swatches">
          {accents.map((family) => (
            <section key={family.name} className="di-swatch-col">
              <h2>
                {family.name} <span>/ {family.role}</span>
              </h2>
              {family.swatches.map(([name, ink, hex, theme, role]) => (
                <div
                  key={`${name}-${theme}`}
                  data-theme={theme}
                  className="di-swatch"
                  style={{ background: `var(${name})`, color: `var(${ink})` }}
                >
                  <b>
                    {name}
                    <small>{hex}</small>
                  </b>
                  <span>{role}</span>
                </div>
              ))}
            </section>
          ))}
          <section className="di-swatch-col">
            <AccentsInUse />
            <Rules>
              <Rule>At most one accent per page. The two meet only in a chart.</Rule>
              <Rule>Poppy is not “critical”. A failure is the severity scale's critical, and says so in words.</Rule>
              <Rule>Never on a button. After dark cornflower lightens to #79AEEA so it still reads on navy.</Rule>
            </Rules>
          </section>
        </div>
      </Section>
      <Section
        eyebrow="Charts"
        title="One series in ink, the one value in gold."
        lede="Gold is the single value the eye should land on. A severity hue appears only where a reading crossed a threshold — never to tell two ordinary series apart."
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
  tags: ["layer:foundation"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Palette: Story = { render: () => <Board /> };
