import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AttentionItem,
  AttentionList,
  Button,
  Figure,
  FigureRow,
  HeroFigure,
  Panel,
  SeverityMark,
  StatusPill,
  Surface,
  SurfaceTakeaway,
} from "../../index";
import { DocPage, DocSection, DoDont, Swatch } from "./DocKit";

const meta = {
  title: "Direction A/Foundations",
  tags: ["layer:foundation", "!autodocs", "direction:a"],
  parameters: { direction: "a", layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Colour roles: structure, action, the one accent, selection, status. */
export const Colour: Story = {
  render: () => (
    <DocPage kicker="Foundations ·" title="Colour" claim="Every colour has one job. Gold has the rarest: the one thing that matters in the view.">
      <DocSection title="Text, four levels" lede="Primary for values and reading, secondary for labels and ledes, tertiary for meta, disabled for what cannot be used. Each is its own value in both themes; after dark muted and subtle are no longer one colour.">
        <div className="doc-a-grid">
          <Swatch token="--di-text" role="Primary · values" />
          <Swatch token="--di-text-secondary" role="Secondary · labels" />
          <Swatch token="--di-text-tertiary" role="Tertiary · meta" />
          <Swatch token="--di-text-tertiary" on="--di-layer-ground" role="Tertiary on ground" />
        </div>
      </DocSection>
      <DocSection title="Action, selection, the one thing" lede="The filled button is navy in daylight and paper-white after dark, so gold never has to act. Cornflower is where you are: the selected row, the focus ring, the current nav item. Gold is what matters.">
        <div className="doc-a-grid">
          <Swatch token="--di-action-bg" role="Action fill" mark />
          <Swatch token="--di-select" role="Selection · focus" mark />
          <Swatch token="--di-select-ink" on="--di-layer-ground" role="Selection as text" />
          <Swatch token="--di-one-ink" role="The one thing (text)" />
          <Swatch token="--di-one" role="The one thing (fill, never alone)" mark />
        </div>
      </DocSection>
      <DocSection title="Status" lede="Status words carry their own colour on a tint. Warn is amber now, its own hue, no longer borrowed from gold.">
        <div className="doc-a-grid">
          <Swatch token="--di-status-ok-fg" on="--di-status-ok-bg" role="OK · arriving" />
          <Swatch token="--di-status-warn-fg" on="--di-status-warn-bg" role="Warn · silent for a day" />
          <Swatch token="--di-status-danger-fg" on="--di-status-danger-bg" role="Danger · failing" />
          <Swatch token="--di-status-recorded-fg" on="--di-status-recorded-bg" role="Info · new" />
        </div>
      </DocSection>
      <DocSection title="Gold, do and don’t">
        <DoDont doText="One gold region per view, on the referent that matters: the claim’s key words and the item they name." dontText="Gold for an eyebrow, a link underline, a warning and a primary button at once. Nobody can learn what it means.">
          <>
            <AttentionList label="Do">
              <AttentionItem rank="01" emphasis emphasisLabel="Start here" severity="critical" severityLabel="Critical" title="Case 4 · nobody owns it" reason="Data is leaving the file server." />
            </AttentionList>
          </>
          <>
            <p className="doc-a-meta" style={{ color: "var(--di-one-ink)" }}>WORKSPACE</p>
            <p>
              <span style={{ borderBottom: "1px solid var(--di-one)" }}>Open the cases</span> ·{" "}
              <span style={{ color: "var(--di-one-ink)" }}>medium</span> ·{" "}
              <span style={{ background: "var(--di-one)", color: "#0a1f44", padding: "4px 8px", borderRadius: 6 }}>Save</span>
            </p>
          </>
        </DoDont>
      </DocSection>
    </DocPage>
  ),
};

/** The one severity scale every product and chart uses. */
export const Severity: Story = {
  render: () => (
    <DocPage kicker="Foundations ·" title="Severity" claim="One scale, five steps, the same in every product: high is red-orange everywhere.">
      <DocSection title="The scale" lede="Severity is a mark of four steps plus the word. The steps fill as the level rises, so the scale reads without colour; the word stays in text colour and clears AA on every surface.">
        <div className="doc-a-grid">
          {(["critical", "high", "medium", "low", "info"] as const).map((level) => (
            <div key={level} className="doc-a-swatch" style={{ background: "var(--di-layer-surface)" }}>
              <span className="doc-a-chip" style={{ background: `var(--di-severity-${level})` }} />
              <SeverityMark level={level} label={level[0].toUpperCase() + level.slice(1)} />
              <code>--di-severity-{level}</code>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection title="Do and don’t">
        <DoDont doText="The shared mark, in a list, a table, a chart legend. Critical alone may lay a tint, where it has to stop the eye." dontText="A product’s own palette: medium in gold, high in olive, critical and high both red. The same level must not change colour between products.">
          <>
            <SeverityMark level="critical" label="Critical" variant="chip" />
            <SeverityMark level="high" label="High" />
            <SeverityMark level="medium" label="Medium" />
          </>
          <>
            <StatusPill tone="danger" dot>Critical</StatusPill>
            <StatusPill tone="danger" dot>High</StatusPill>
            <span style={{ color: "#6e6112", background: "#fdfcf9", padding: "2px 8px", borderRadius: 999 }}>● High (CVE)</span>
            <span style={{ color: "#0a1f44", background: "#fdfcf9", padding: "2px 8px", borderRadius: 999 }}>● Medium (CVE)</span>
          </>
        </DoDont>
      </DocSection>
    </DocPage>
  ),
};

/** Seven type steps with visible distance between them. */
export const Type: Story = {
  render: () => (
    <DocPage kicker="Foundations ·" title="Type" claim="Seven steps, and you can see each one: the claim first, the body last.">
      <DocSection title="The ramp" lede="Sansation for what is said large (claim, hero figure, section). IBM Plex Sans for reading. IBM Plex Mono for what a machine wrote and for labels, in capitals, so a label never looks like its value.">
        <div>
          {[
            ["Claim · 26–36 / 700", <p style={{ font: "var(--di-type-claim-weight) var(--di-type-claim-size)/1.12 var(--di-type-claim-family)" }}>Two things need you now.</p>],
            ["Hero figure · 44–60", <p style={{ font: "700 var(--di-type-hero-size)/1 var(--di-type-hero-family)" }}>182.5</p>],
            ["Section · 22 / 700", <p style={{ font: "700 var(--di-type-section-size)/1.2 var(--di-type-section-family)" }}>Story of the case</p>],
            ["Block title · 15 / 600", <p style={{ font: "600 var(--di-type-block-size)/1.35 var(--di-type-block-family)" }}>Two sources stopped delivering</p>],
            ["Body · 14 / 400", <p>Identity sign-ins lost its read permission; sign-in detections are blind.</p>],
            ["Label · 11 mono caps", <p className="dir-a-label" style={{ font: "500 var(--di-type-label-size) var(--di-type-label-family)", letterSpacing: "var(--di-type-label-tracking)", textTransform: "uppercase", color: "var(--di-text-secondary)" }}>Time to acknowledge</p>],
            ["Meta · 12 mono", <p className="doc-a-meta">As of 12 Oct, 10:00 · 14 sources</p>],
          ].map(([name, specimen]) => (
            <div className="doc-a-type-row" key={String(name)}>
              <span className="doc-a-meta">{name}</span>
              {specimen}
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection title="Do and don’t">
        <DoDont doText="A label in mono capitals above a bright value; the step between them is obvious at a glance." dontText="Today: a 13px panel title, a 12px label and a 13px value. Everything weighs the same and the eye has nowhere to land.">
          <>
            <FigureRow label="Do">
              <Figure label="Time to acknowledge" value="2.9 h">median · 7 days</Figure>
              <Figure label="Unassigned" value="2" tone="warn">of 3 open</Figure>
            </FigureRow>
          </>
          <>
            <div className="doc-a-old">
              <p style={{ fontSize: 13, fontWeight: 600 }}>Detection activity, 7 days</p>
              <p style={{ fontSize: 12, color: "var(--di-text-secondary)" }}>Time to acknowledge (median, 7 d)</p>
              <p style={{ fontSize: 13 }}>2.9h</p>
            </div>
          </>
        </DoDont>
      </DocSection>
    </DocPage>
  ),
};

/** Surface layers: tone instead of borders. */
export const Surfaces: Story = {
  render: () => (
    <DocPage kicker="Foundations ·" title="Surfaces and elevation" claim="Depth comes from tone, not from lines. Two visible levels, never more.">
      <DocSection title="The layers" lede="Chrome holds the navigation and is never heavier than the content. Ground is the page. Surface lifts a block by tone and a faint edge. Inset sinks a group inside a surface. Emphasis is a surface with the gold edge, once per view. Hero is the one luminous navy zone. A plane (menu, sheet, dialog) is the only thing with a real shadow.">
        <div className="doc-a-grid">
          <Swatch token="--di-text" on="--di-layer-chrome" role="Chrome" />
          <Swatch token="--di-text" on="--di-layer-ground" role="Ground" />
          <Swatch token="--di-text" on="--di-layer-surface" role="Surface" />
          <Swatch token="--di-text" on="--di-layer-inset" role="Inset" />
        </div>
        <Surface label="Surface" title="A block on the ground">
          <Surface level="inset" label="Inset" title="A group inside it — the deepest level">
            <p className="doc-a-meta">No border. The tone is the boundary.</p>
          </Surface>
        </Surface>
        <Surface emphasis label="Emphasis" title="The one block that matters in the view">
          <p>Gold edge and glow. One per view.</p>
        </Surface>
        <Surface level="hero" label="Hero" title="The page’s signature visual sits here">
          <HeroFigure label="Open cases" value="3" />
        </Surface>
      </DocSection>
      <DocSection title="Do and don’t">
        <DoDont doText="A surface, and inside it an inset. A table sits directly on its surface, its head in the inset tone." dontText="Today: a framed table inside a framed panel inside a panel. Three tones and three borders around one list.">
          <>
            <Surface label="Phase 01" title="Exfiltration">
              <Surface level="inset">
                <p className="doc-a-meta">12 Oct 03:38 · large upload to 192.0.2.88</p>
              </Surface>
            </Surface>
          </>
          <>
            <Panel index="00" title="Activity">
              <Panel index="01" title="Exfiltration">
                <div className="doc-a-old">12 Oct 03:38 · large upload</div>
              </Panel>
            </Panel>
          </>
        </DoDont>
      </DocSection>
    </DocPage>
  ),
};

/** Space, radius, emphasis of actions. */
export const SpaceAndRadius: Story = {
  name: "Space and radius",
  render: () => (
    <DocPage kicker="Foundations ·" title="Space and radius" claim="Space separates meaning: wide between parts, tight inside them.">
      <DocSection title="Rhythm" lede="The ramp stays (2 to 96, named by value). What changes is where it goes: 32 from the claim to the content, 48 between sections, 24 inside a surface, 16 between items of one list. The page frame grows to 32.">
        <table className="doc-a-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Between</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>--di-rhythm-claim</code></td><td>32</td><td>The claim and what follows it</td></tr>
            <tr><td><code>--di-rhythm-section</code></td><td>48</td><td>Two sections of a page</td></tr>
            <tr><td><code>--di-surface-pad</code></td><td>24</td><td>A surface’s edge and its content</td></tr>
            <tr><td><code>--di-content-pad</code></td><td>32</td><td>The page frame</td></tr>
          </tbody>
        </table>
      </DocSection>
      <DocSection title="Radius" lede="Softer than today, because there are no lines left to hold the shape: 12 a surface, 8 an inset, 6 a control, 4 a field.">
        <div className="doc-a-grid">
          {[["--di-radius-surface", "12 · surface"], ["--di-radius-inset", "8 · inset"], ["--di-radius-control", "6 · control"], ["--di-radius-micro", "4 · field"]].map(([token, label]) => (
            <div key={token} className="doc-a-swatch" style={{ background: "var(--di-layer-surface)" }}>
              <span className="doc-a-chip" style={{ borderRadius: `var(${token})`, background: "var(--di-layer-inset)", height: 64 }} />
              <code>{token}</code>
              <span className="doc-a-meta">{label}</span>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection title="Do and don’t">
        <DoDont doText="One filled button per view, next to what it acts on. Secondary actions outline, tertiary as text." dontText="Three filled buttons, and Next 1,300px away from Cancel in the page corner.">
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <Button>Isolate srv-fs-02</Button>
              <Button variant="secondary">Reset svc-backup</Button>
              <Button variant="ghost">Set a verdict</Button>
            </div>
          </>
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button>Cancel</Button>
              <Button>Save</Button>
              <Button>Next</Button>
            </div>
          </>
        </DoDont>
        <Surface label="Takeaway">
          <SurfaceTakeaway>Space and size do the work borders used to do.</SurfaceTakeaway>
        </Surface>
      </DocSection>
    </DocPage>
  ),
};
