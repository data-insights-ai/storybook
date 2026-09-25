import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, Section } from "./guide/Guide";
import "./foundations.css";

/*
 * Every row names the token it is set in and says where the console
 * actually uses it. The page used to hardcode the font stacks as strings
 * and quote sizes the components do not ship — a body of 16px where
 * base.css sets 13px, and a weight of 600 where every heading is 700.
 * A specimen that disagrees with the build is worse than none.
 */

const SANS = "var(--di-font-ui)";
const MONO = "var(--di-font-code)";
const TIGHT = "var(--di-tracking-tight)";

type Row = { token: string; note: string; sample: string; style: CSSProperties };

const prose: Row[] = [
  {
    token: "--di-font-size-1000 · 56 · 700",
    note: "Foundations page title",
    sample: "Provable AI.",
    style: { fontFamily: SANS, fontWeight: 700, fontSize: "var(--di-font-size-1000)", letterSpacing: TIGHT, lineHeight: 1.05 },
  },
  {
    token: "--di-font-size-800 · 34 · 700",
    note: "Foundations section heading",
    sample: "Warm paper, not cool grey.",
    style: { fontFamily: SANS, fontWeight: 700, fontSize: "var(--di-font-size-800)", letterSpacing: TIGHT, lineHeight: 1.1 },
  },
  {
    token: "--di-font-size-700 · 28 · 700",
    note: "PageHeader",
    sample: "Watched identities",
    style: { fontFamily: SANS, fontWeight: 700, fontSize: "var(--di-font-size-700)", letterSpacing: TIGHT, lineHeight: 1.1 },
  },
  {
    token: "--di-font-size-600 · 20 · 700",
    note: "SectionTitle, Metric figure",
    sample: "Sources on record",
    style: { fontFamily: SANS, fontWeight: 700, fontSize: "var(--di-font-size-600)", letterSpacing: TIGHT, lineHeight: 1.2 },
  },
  {
    token: "--di-font-size-500 · 16 · 400",
    note: "Brand page lede",
    sample: "Every answer is grounded in a temporal knowledge graph.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-500)", lineHeight: 1.55 },
  },
  {
    token: "--di-font-size-400 · 13 · 400",
    note: "The console body — base.css",
    sample: "The source was paused after four consecutive rate limits.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-400)", lineHeight: 1.5 },
  },
  {
    token: "--di-font-size-400 · 13 · 500",
    note: "Control labels",
    sample: "Add entry",
    style: { fontFamily: SANS, fontWeight: 500, fontSize: "var(--di-font-size-400)" },
  },
  {
    token: "--di-font-size-300 · 12 · 400",
    note: "Screen lede, field hints",
    sample: "Entries already sealed stay on record.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-300)", lineHeight: 1.35 },
  },
];

const machine: Row[] = [
  {
    token: "--di-font-size-700 · 28 · 500",
    note: "StatTile figure",
    sample: "4,182",
    style: { fontFamily: MONO, fontWeight: 500, fontSize: "var(--di-font-size-700)", fontVariantNumeric: "tabular-nums", letterSpacing: TIGHT, lineHeight: 1.1 },
  },
  {
    token: "--di-font-size-400 · 13 · 400",
    note: "Identifiers, hashes, timestamps",
    sample: "a4f9c21e · 2026-09-18T09:12:04Z",
    style: { fontFamily: MONO, fontSize: "var(--di-font-size-400)", fontVariantNumeric: "tabular-nums" },
  },
  {
    token: "--di-font-size-200 · 11 · 500",
    note: "Eyebrow, § mark — Seal ink",
    sample: "§ 04 — COVERAGE",
    style: { fontFamily: MONO, fontWeight: 500, fontSize: "var(--di-font-size-200)", letterSpacing: "var(--di-tracking-eyebrow)", textTransform: "uppercase", color: "var(--di-seal-ink)" },
  },
  {
    token: "--di-font-size-100 · 10 · 500",
    note: "Kbd, tile ordinal",
    sample: "⌘K",
    style: { fontFamily: MONO, fontWeight: 500, fontSize: "var(--di-font-size-100)" },
  },
];

function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="di-type-sample">
      {rows.map((row) => (
        <div key={row.token + row.sample} className="di-type-row">
          <div className="di-type-meta">
            {row.token}
            <span>{row.note}</span>
          </div>
          <div style={row.style}>{row.sample}</div>
        </div>
      ))}
    </div>
  );
}

const meta = { title: "Foundations/Type" } satisfies Meta;
export default meta;

/** The scale, with the token each step is set in and where it is used. */
export const ScaleStory: StoryObj = {
  name: "Scale",
  render: () => (
    <Page
      eyebrow="Type"
      title="Two families, two jobs."
      lede="Space Grotesk is everything a person reads as prose: headings, body copy, the labels on controls. JetBrains Mono is everything a machine wrote — identifiers, hashes, timestamps, measured values, and the § marks that number a screen. The split is not a texture."
    >
      <Section
        eyebrow="Prose"
        title="Space Grotesk."
        lede="Nine steps, and the console lives in the bottom four. Display and Title exist for these brand pages; a product screen never goes above the PageHeader."
      >
        <Rows rows={prose} />
      </Section>
      <Section
        eyebrow="Record"
        title="JetBrains Mono."
        lede="Figures are tabular, so a column of readings does not jitter as it updates. Which track a string sits in states where it came from."
      >
        <Rows rows={machine} />
      </Section>
    </Page>
  ),
};

/** The same sentence, in each track, meaning two different things. */
export const TrackStory: StoryObj = {
  name: "Track",
  render: () => (
    <Page
      eyebrow="Type"
      title="The mono track is a claim about provenance."
      lede="If a person wrote it, it is Space Grotesk. If the system recorded it, it is JetBrains Mono — and it is then something that can be cited."
    >
      <Section eyebrow="Side by side" title="One reads as an account. The other reads as a record.">
        <div className="di-type-sample">
          <div className="di-type-row">
            <div className="di-type-meta">
              Prose<span>a person wrote it</span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: "var(--di-font-size-400)" }}>
              The source was paused after four consecutive rate limits.
            </div>
          </div>
          <div className="di-type-row">
            <div className="di-type-meta">
              Record<span>the system wrote it</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: "var(--di-font-size-400)", fontVariantNumeric: "tabular-nums" }}>
              feed.example.io · paused 2026-09-23T08:47:11Z · 429 ×4
            </div>
          </div>
          <div className="di-type-row">
            <div className="di-type-meta">
              Figures<span>tabular, so they do not jitter</span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: "var(--di-font-size-500)",
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>1,842</span>
              <span>1,109</span>
              <span>744</span>
              <span>487</span>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  ),
};
