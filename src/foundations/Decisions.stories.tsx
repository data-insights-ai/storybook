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
import { Page, Section } from "./guide/Guide";
import "./foundations.css";

/*
 * This page was called "Adoption", its story was called "Ledger" and its
 * heading was "What we take from 2027" — three names for one thing, none
 * of which said what the page is. It is a decision record: the reasoning
 * behind the rules the other Foundations pages state, kept so a rule can
 * be argued with instead of inherited. It sorts last for that reason.
 *
 * "Ledger" was also the wrong word twice over: a register *is* a ledger,
 * so the name read as though the page were about the register metaphor.
 */

type Verdict = "adopted" | "adapted" | "refused";

/*
 * The tone reports the kind of decision, not its quality. A refusal is a
 * decision the system stands behind, so it is `neutral` — it is not a
 * failure, and it was drawn as one when `refused` mapped to `danger` and
 * tinted the whole row.
 */
const TONE: Record<Verdict, "ok" | "recorded" | "neutral"> = {
  adopted: "ok",
  adapted: "recorded",
  refused: "neutral",
};

const decisions: { pattern: string; verdict: Verdict; built: string; reason: string }[] = [
  {
    pattern: "Command palette ⌘K",
    verdict: "adopted",
    built: "CommandBar",
    reason: "A register is meant to be queried. One field for navigating, searching and asking.",
  },
  {
    pattern: "An explanation of why a model proposed something",
    verdict: "adopted",
    built: "ExplainPanel",
    reason: "Already the product thesis. Parameters and ignored inputs, not a prose apology.",
  },
  {
    pattern: "Confidence shown on the field it applies to",
    verdict: "adopted",
    built: "ConfidenceField",
    reason: "A rule under the field, plus the number. Colour alone never carries the meaning.",
  },
  {
    pattern: "Privacy stated in context, not in a policy page",
    verdict: "adopted",
    built: "PrivacyBadge",
    reason: "Stated at the field that processes the data, with region and retention.",
  },
  {
    pattern: "A card that updates itself and says a model did it",
    verdict: "adopted",
    built: "LivingCard",
    reason: "The claim sits below the measurement and above the records it derives from.",
  },
  {
    pattern: "Making an AI control look unlike the others",
    verdict: "adapted",
    built: "SealMark, Button variant=\"inferred\"",
    reason: "A gold hairline and a hollow ring — unsealed. Not a gradient, not a sparkle.",
  },
  {
    pattern: "Tactile micro-interaction on press",
    verdict: "adapted",
    built: "Button",
    reason:
      "Reduced to a colour change on buttons, 120ms, ease-out — no lift, no scale, no press. Never on a table row: forty thousand rows have to hold still.",
  },
  {
    pattern: "Act first, offer undo afterwards",
    verdict: "refused",
    built: "ConfirmPanel, Modal, Toast",
    reason:
      "Every action is confirmed beforehand, stating basis, scope and reversibility. The toast is a receipt with an audit id, never a window to escape through.",
  },
  {
    pattern: "Glassmorphism, backdrop blur",
    verdict: "refused",
    built: "—",
    reason: "A mono value behind frosted glass is unreadable, and the contrast fails unpredictably.",
  },
  {
    pattern: "Gradient edges, glow, pulse, sparkle glyphs",
    verdict: "refused",
    built: "—",
    reason:
      "The least verifiable output cannot be the most decorated one. Cyan-to-violet also belongs to no one.",
  },
  {
    pattern: "A floating dock that reorders itself",
    verdict: "refused",
    built: "AppShell",
    reason:
      "Navigation that hides itself cannot be described in an audit. The rail is fixed, in the order the product declares. Nothing reorders it.",
  },
];

function Decisions() {
  return (
    <Page
      eyebrow="Decision record"
      title="What this system takes from current AI interfaces, and what it refuses."
      lede="The conventions arriving across AI products come with a visual style — glass, gradient edges, pulsing borders, sparkle glyphs — and with a substance: automation has to declare itself, explain itself, and be answerable. This system takes the substance and refuses the style, because a provenance product cannot make its least verifiable output its most decorated one."
    >
      <Section
        eyebrow="The record"
        title="Each line carries its reason."
        lede="A rule you can see the reasoning for is one you can argue with. Every other Foundations page states a rule; this page is why. The verdict names the kind of decision, not its quality — a refusal is a position the system holds, not a fault."
      >
        <DataTable caption="Decisions on current AI interface conventions">
          <TableHead>
            <TableColumn index={true}>Number</TableColumn>
            <TableColumn>Convention</TableColumn>
            <TableColumn>Verdict</TableColumn>
            <TableColumn>Built as</TableColumn>
            <TableColumn>Reason</TableColumn>
          </TableHead>
          <TableBody>
            {decisions.map((row, i) => (
              <TableRow key={row.pattern}>
                <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
                <TableCell>{row.pattern}</TableCell>
                <TableCell>
                  <StatusPill tone={TONE[row.verdict]}>{row.verdict}</StatusPill>
                </TableCell>
                <TableCell mono={true}>{row.built}</TableCell>
                <TableCell>
                  <span className="di-decision-reason">{row.reason}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Section>
    </Page>
  );
}

const meta = { title: "Foundations/Decisions" } satisfies Meta;
export default meta;

export const Record: StoryObj = {
  name: "Record",
  render: () => <Decisions />,
};
