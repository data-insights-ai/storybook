import type { Meta, StoryObj } from "@storybook/react-vite";
import "./foundations.css";

const rows = [
  {
    meta: "Display · Sansation 700",
    sample: "Provable AI.",
    style: {
      fontFamily: '"Sansation", "Helvetica Neue", sans-serif',
      fontWeight: 700,
      fontSize: 48,
      letterSpacing: "-0.025em",
      lineHeight: 1,
    },
  },
  {
    meta: "Section · Sansation 700",
    sample: "Watched identities",
    style: {
      fontFamily: '"Sansation", "Helvetica Neue", sans-serif',
      fontWeight: 700,
      fontSize: 32,
      letterSpacing: "-0.025em",
      lineHeight: 1.05,
    },
  },
  {
    meta: "Body · IBM Plex Sans 400",
    sample: "Every answer is grounded in a temporal knowledge graph, and every graph edge carries a timestamp.",
    style: {
      fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
      fontSize: 16,
      lineHeight: 1.55,
    },
  },
  {
    meta: "UI · IBM Plex Sans 500",
    sample: "Add entry",
    style: {
      fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
      fontWeight: 500,
      fontSize: 14,
    },
  },
  {
    meta: "Evidence · IBM Plex Mono 500",
    sample: "TKG · NODE #2412 · 2026-09-22",
    style: {
      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase" as const,
      color: "var(--di-accent-text)",
    },
  },
];

function Scale() {
  return (
    <div style={{ maxWidth: 880 }}>
      <h1 className="di-block-title" style={{ fontSize: 32 }}>
        Three voices.
      </h1>
      <p className="di-lede">
        Five steps, each with a reason. Sansation carries H1 at 72–104, H2 at 40–50, and H3 at 24–30. IBM Plex Sans is the body, 16–19. IBM Plex Mono at 11–12, in Gold 700, is the one eyebrow. The console uses the same families, a step denser than a cover.
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

const meta = { title: "Foundations/Type" } satisfies Meta;
export default meta;

export const ScaleStory: StoryObj = {
  name: "Scale",
  render: () => <Scale />,
};
