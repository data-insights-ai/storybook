import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableIndex,
  TableRow,
} from "../components/DataTable";
import { StatusPill } from "../components/StatusPill";
import "./foundations.css";

type Verdict = "adopted" | "adapted" | "refused";

const TONE: Record<Verdict, "ok" | "warn" | "danger"> = {
  adopted: "ok",
  adapted: "warn",
  refused: "danger",
};

const ledger: { trend: string; verdict: Verdict; reason: string }[] = [
  {
    trend: "Command palette ⌘K",
    verdict: "adopted",
    reason: "A register is meant to be queried. One field for navigating, searching and asking.",
  },
  {
    trend: "Explainability “why?”",
    verdict: "adopted",
    reason:
      "Already the product thesis. Parameters and ignored inputs, not a prose apology.",
  },
  {
    trend: "Confidence indicators",
    verdict: "adopted",
    reason: "A rule under the field, plus the number. Colour alone never carries the meaning.",
  },
  {
    trend: "In-context privacy badges",
    verdict: "adopted",
    reason: "Stated at the field that processes the data, with region and retention.",
  },
  {
    trend: "Living cards with an AI banner",
    verdict: "adopted",
    reason:
      "Embedded in the card, below the measurement and above the records it derives from.",
  },
  {
    trend: "An AI control that looks different",
    verdict: "adapted",
    reason: "A gold hairline and a hollow ring — unsealed. Not a gradient, not a sparkle.",
  },
  {
    trend: "Tactile micro-interaction",
    verdict: "adapted",
    reason:
      "On buttons only, and under 240ms. Never on a table row: forty thousand rows have to hold still.",
  },
  {
    trend: "Undo-first, no confirmation",
    verdict: "refused",
    reason:
      "Every action is confirmed beforehand, stating basis, scope and reversibility. The toast is a receipt with an audit id, never a window to escape through.",
  },
  {
    trend: "Glassmorphism, backdrop blur",
    verdict: "refused",
    reason:
      "A mono value behind frosted glass is unreadable, and the contrast fails unpredictably.",
  },
  {
    trend: "Gradient edges, glow, pulse, ✨",
    verdict: "refused",
    reason:
      "The least verifiable output cannot be the most decorated one. Cyan-to-violet also belongs to no one.",
  },
  {
    trend: "Adaptive floating dock",
    verdict: "refused",
    reason:
      "Navigation that hides itself cannot be described in an audit. The rail stays fixed; frequency may reorder one visible group, labelled and reversible.",
  },
];

function Ledger() {
  return (
    <div style={{ maxWidth: 980 }}>
      <h1 className="di-block-title" style={{ fontSize: 32 }}>
        What we take from 2027, and what we refuse.
      </h1>
      <p className="di-lede" style={{ marginBottom: 24 }}>
        The 2027 patterns arrive with a visual style — glass, gradient edges, pulsing borders, sparkle
        glyphs — and with a substance: automation has to declare itself, explain itself, and be
        answerable. We take the substance and refuse the style, because a provenance product cannot
        make its least verifiable output its most decorated one. Each line below carries its reason, so
        the decision can be argued with rather than inherited.
      </p>
      <DataTable caption="Adoption ledger">
        <TableHead>
          <TableColumn index={true}>Number</TableColumn>
          <TableColumn>Trend</TableColumn>
          <TableColumn>Verdict</TableColumn>
          <TableColumn>Reason</TableColumn>
        </TableHead>
        <TableBody>
          {ledger.map((row, i) => (
            <TableRow key={row.trend} tone={row.verdict === "refused" ? "danger" : "neutral"}>
              <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
              <TableCell>{row.trend}</TableCell>
              <TableCell>
                <StatusPill tone={TONE[row.verdict]}>{row.verdict}</StatusPill>
              </TableCell>
              <TableCell>
                <span style={{ display: "block", maxWidth: 480, lineHeight: 1.45, padding: "10px 0" }}>
                  {row.reason}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}

const meta = { title: "Foundations/Adoption" } satisfies Meta;
export default meta;

export const LedgerStory: StoryObj = {
  name: "Ledger",
  render: () => <Ledger />,
};
