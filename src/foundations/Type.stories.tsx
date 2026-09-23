import type { Meta, StoryObj } from "@storybook/react-vite";
import "./foundations.css";

const SANS = '"Space Grotesk", "Helvetica Neue", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const rows = [
  {
    meta: "Display · Space Grotesk 600",
    sample: "Provable AI.",
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 48,
      letterSpacing: "-0.015em",
      lineHeight: 1.05,
    },
  },
  {
    meta: "Section · Space Grotesk 600",
    sample: "Watched identities",
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 28,
      letterSpacing: "-0.015em",
      lineHeight: 1.1,
    },
  },
  {
    meta: "Body · Space Grotesk 400",
    sample:
      "Every answer is grounded in a temporal knowledge graph, and every graph edge carries a timestamp.",
    style: {
      fontFamily: SANS,
      fontSize: 16,
      lineHeight: 1.55,
    },
  },
  {
    meta: "Interface · Space Grotesk 500",
    sample: "Add entry",
    style: {
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 13,
    },
  },
  {
    meta: "Measurement · JetBrains Mono 500",
    sample: "4,182",
    style: {
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: 28,
      fontVariantNumeric: "tabular-nums" as const,
      letterSpacing: "-0.015em",
      lineHeight: 1.1,
    },
  },
  {
    meta: "Identifier · JetBrains Mono 400",
    sample: "a4f9c21e · 2026-09-18T09:12:04Z",
    style: {
      fontFamily: MONO,
      fontSize: 13,
      fontVariantNumeric: "tabular-nums" as const,
    },
  },
  {
    meta: "Section mark · JetBrains Mono 500",
    sample: "§ 04 — COVERAGE",
    style: {
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      color: "var(--di-accent-text)",
    },
  },
];

function Scale() {
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 className="di-block-title" style={{ fontSize: 32 }}>
        Two families, two jobs.
      </h1>
      <p className="di-lede">
        Space Grotesk is everything a person reads as prose: headings, body copy, the labels on controls.
        JetBrains Mono is everything a machine wrote — identifiers, hashes, timestamps, measured values,
        and the § marks that number a screen. The split is not a texture. Tabular figures run down the mono
        track so a column of readings does not jitter as it updates.
      </p>
      <div className="di-type-sample" style={{ marginTop: 24 }}>
        {rows.map((row) => (
          <div key={row.meta} className="di-type-row">
            <div className="di-type-meta">{row.meta}</div>
            <div style={row.style}>{row.sample}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Track() {
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 className="di-block-title" style={{ fontSize: 32 }}>
        The mono track.
      </h1>
      <p className="di-lede">
        Which track a string sits in is a statement about where it came from. If a person wrote it, it is
        Space Grotesk. If the system recorded it, it is JetBrains Mono — and it is then something that can
        be cited.
      </p>
      <div className="di-type-sample" style={{ marginTop: 24 }}>
        <div className="di-type-row">
          <div className="di-type-meta">Prose</div>
          <div style={{ fontFamily: SANS, fontSize: 13 }}>
            The source was paused after four consecutive rate limits.
          </div>
        </div>
        <div className="di-type-row">
          <div className="di-type-meta">Record</div>
          <div style={{ fontFamily: MONO, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
            feed.example.io · paused 2026-09-23T08:47:11Z · 429 ×4
          </div>
        </div>
        <div className="di-type-row">
          <div className="di-type-meta">Figures, tabular</div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 15,
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
    </div>
  );
}

const meta = { title: "Foundations/Type" } satisfies Meta;
export default meta;

export const ScaleStory: StoryObj = {
  name: "Scale",
  render: () => <Scale />,
};

export const TrackStory: StoryObj = {
  name: "Track",
  render: () => <Track />,
};
