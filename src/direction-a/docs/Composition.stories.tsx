import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocPage, DocSection } from "./DocKit";

const meta = {
  title: "Direction A/Composition",
  tags: ["layer:foundation", "!autodocs", "direction:a"],
  parameters: { direction: "a", layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Block = [string, string?];

function Wire({ title, rows, rules }: { title: string; rows: Block[][]; rules: string[] }) {
  return (
    <div className="doc-a-wire">
      <p className="dir-a-label" style={{ font: "500 var(--di-type-label-size) var(--di-type-label-family)", letterSpacing: "var(--di-type-label-tracking)", textTransform: "uppercase", color: "var(--di-text-secondary)" }}>
        {title}
      </p>
      {rows.map((row, i) => (
        <div className="doc-a-wire-row" key={i}>
          {row.map(([text, kind], j) => (
            <span key={`${text}-${j}`} className={`doc-a-block${kind ? ` is-${kind}` : ""}`}>
              {text}
            </span>
          ))}
        </div>
      ))}
      <ol>
        {rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
    </div>
  );
}

/** What sits where on each kind of page, from the top. */
export const PageAnatomy: Story = {
  name: "Page anatomy",
  render: () => (
    <DocPage kicker="Composition ·" title="Page anatomy" claim="Every page says its point first, then proves it, then gives the detail.">
      <DocSection title="Five page types" lede="Each type has one order from the top. The name of the page is the h1, small, because the navigation already says where the reader is; the claim is the largest text.">
        <div className="doc-a-anatomy">
          <Wire
            title="Overview"
            rows={[[["Context · Name   Claim — what needs you, computed", "claim"]], [["01 the one thing", "one"], ["02"], ["03"]], [["Hero: the product’s signature visual", "hero"]], [["figure", "quiet"], ["figure", "quiet"], ["figure", "quiet"], ["figure", "quiet"]], [["secondary"], ["secondary"]], [["health in one line", "quiet"]]]}
            rules={["Claim from data, never a sentence about the UI", "Attention list: at most three, ranked, one action each", "One hero, at least twice any other block", "No grid of equal tiles"]}
          />
          <Wire
            title="List (and detail)"
            rows={[[["Name · count", "quiet"], ["filter", "inset"]], [["list", "inset"], ["Record claim: the verdict, the one action", "claim"]], [["list", "inset"], ["proof", "one"]], [["list", "inset"], ["figures", "quiet"]], [["list", "inset"], ["evidence on its surface"]]]}
            rules={["Records with a triage loop (cases, assets) use the permanent split", "Selection is cornflower, never gold", "A small list (< 8 rows) moves to its parent’s overview", "A table sits on its surface, never in a framed panel"]}
          />
          <Wire
            title="Detail (own page)"
            rows={[[["crumbs", "quiet"]], [["Context · Name · status   Verdict claim", "claim"]], [["one filled action"], ["secondary", "inset"]], [["proof", "one"]], [["figures", "quiet"]], [["tab"], ["tab"], ["tab"]], [["sections"]]]}
            rules={["Status inline after the name, not 900px away", "No eyebrow when there are crumbs", "The rail holds decisions only after the verdict", "At most five tabs"]}
          />
          <Wire
            title="Create"
            rows={[[["Name · what this creates", "claim"]], [["stepper", "quiet"]], [["one step at form measure (720)"]], [["Cancel · Commit, at the end of the column", "inset"]]]}
            rules={["Commit sits beside Cancel, at the end of the form", "Short flows open in a sheet", "No gold: nothing has been proved yet"]}
          />
          <Wire
            title="Empty, error, not found"
            rows={[[["Name stays, toolbar stays", "quiet"]], [["Claim: what is missing and why", "claim"]], [["one action", "inset"]]]}
            rules={["Replaces the content area, keeps the header", "One component everywhere, with a cause and an action", "Not found is a page state, never a silent redirect"]}
          />
        </div>
      </DocSection>
    </DocPage>
  ),
};

/** The surface model and the emphasis levels. */
export const SurfacesAndEmphasis: Story = {
  name: "Surfaces and emphasis",
  render: () => (
    <DocPage kicker="Composition ·" title="Surfaces and emphasis" claim="Two visible levels per region, and one thing that matters per view.">
      <DocSection title="What sits on what">
        <div className="doc-a-scroll">
          <table className="doc-a-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Holds</th>
                <th>Daylight</th>
                <th>After dark</th>
                <th>Never</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Chrome</td><td>Navigation, app bar</td><td>Paper a step below the ground</td><td>The ground itself, a hairline apart</td><td>Darker or more saturated than the content</td></tr>
              <tr><td>Ground</td><td>The page, the claim, figure rows</td><td>Warm paper</td><td>Brand navy, not near-black</td><td>A border around the page</td></tr>
              <tr><td>Surface</td><td>A block, a table, a list</td><td>Near-white, faint edge</td><td>Navy lifted a step</td><td>A surface inside a surface</td></tr>
              <tr><td>Inset</td><td>A group inside a surface, a table head, code</td><td>Ground tone</td><td>Navy sunk a step</td><td>Anything inside it with a fill</td></tr>
              <tr><td>Emphasis</td><td>The one thing that matters</td><td>Gold edge, soft glow</td><td>Gold edge 75%, 60px glow</td><td>More than one per view</td></tr>
              <tr><td>Hero</td><td>The signature visual</td><td>Navy, radial light, grid</td><td>Lifted navy, radial light</td><td>More than one per page; ordinary content</td></tr>
              <tr><td>Plane</td><td>Menu, sheet, dialog, toast</td><td>White and a shadow</td><td>Lifted navy and a shadow</td><td>A shadow on anything that does not float</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>
      <DocSection title="Emphasis levels" lede="Five levels a reader can tell apart at a glance. Each has a limit.">
        <div className="doc-a-scroll">
          <table className="doc-a-table">
            <thead>
              <tr><th>Level</th><th>Use</th><th>Component</th><th>Limit</th></tr>
            </thead>
            <tbody>
              <tr><td>E1 Claim</td><td>What the page says, computed from the data</td><td><code>Briefing</code></td><td>1 per page</td></tr>
              <tr><td>E2 The one thing</td><td>The item the claim names, in gold</td><td><code>BriefingMark</code>, <code>Surface emphasis</code>, <code>AttentionItem emphasis</code></td><td>1 referent per view</td></tr>
              <tr><td>E3 Hero</td><td>The number or visual the page exists for</td><td><code>HeroFigure</code>, <code>Surface level="hero"</code></td><td>1 per page</td></tr>
              <tr><td>E4 Section and block</td><td>Where a page has parts; the title of a surface</td><td><code>SectionTitle</code>, <code>Surface title</code></td><td>—</td></tr>
              <tr><td>E5 Supporting</td><td>Figures, rows, meta</td><td><code>FigureRow</code>, lists, tables</td><td>—</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>
      <DocSection title="Colour roles in a view">
        <div className="doc-a-scroll">
          <table className="doc-a-table">
            <thead>
              <tr><th>Role</th><th>Colour</th><th>Never for</th></tr>
            </thead>
            <tbody>
              <tr><td>Structure and text</td><td>Navy on paper, paper on navy, four text levels</td><td>—</td></tr>
              <tr><td>Action</td><td>Navy fill in daylight, paper-white after dark</td><td>Status, decoration</td></tr>
              <tr><td>The one thing</td><td>Gold</td><td>Eyebrows, links, warn, severity, buttons, focus</td></tr>
              <tr><td>Selection and focus</td><td>Cornflower</td><td>Status</td></tr>
              <tr><td>Status</td><td>Green, amber, red, cornflower ink, grey</td><td>Decoration</td></tr>
              <tr><td>Severity</td><td>The shared scale, critical to info</td><td>Product remaps</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>
    </DocPage>
  ),
};
