import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  Fact,
  FactList,
  Grid,
  MetaLine,
  Panel,
  PanelNote,
  PanelStatus,
  SealValue,
  SearchField,
  Stack,
  StatusPill,
  Step,
  Steps,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Tag,
  TickRule,
  Toolbar,
} from "../../index";
import { Doc, DocSection, Example, Prose, Rules } from "../guide/Doc";

const entries = [
  { name: "edge-gw-01", received: "09:12:04Z", state: "running" },
  { name: "edge-gw-02", received: "08:47:11Z", state: "paused" },
];

type Verdict = "adopted" | "adapted" | "refused";

const tone = { adopted: "ok", adapted: "recorded", refused: "neutral" } as const;

const decisions: { pattern: string; verdict: Verdict; built: string; reason: string }[] = [
  {
    pattern: "Command palette",
    verdict: "adopted",
    built: "CommandBar",
    reason: "A register is meant to be queried: one field to go, search and ask.",
  },
  {
    pattern: "Why a model proposed something",
    verdict: "adopted",
    built: "ProposalPanel",
    reason: "The basis and the ignored inputs, before the action.",
  },
  {
    pattern: "Confidence on the field it applies to",
    verdict: "adopted",
    built: "TextField confidence",
    reason: "A meter under the field and the reading in words.",
  },
  {
    pattern: "A card that updates itself",
    verdict: "adopted",
    built: "RecordCard",
    reason: "The claim sits between the measurement and the records it comes from.",
  },
  {
    pattern: "AI controls that look unlike the others",
    verdict: "adapted",
    built: 'SealMark, Button variant="inferred"',
    reason: "A hollow ring and a hairline. No gradient, no sparkle.",
  },
  {
    pattern: "Act first, undo afterwards",
    verdict: "refused",
    built: "ConfirmDialog, Toast",
    reason: "Revoking or sealing cannot be quietly undone. Confirm before; the toast is a receipt.",
  },
  {
    pattern: "Glass, backdrop blur",
    verdict: "refused",
    built: "None",
    reason: "A mono value behind frosted glass has no measurable contrast.",
  },
  {
    pattern: "Glow, pulse, sparkle glyphs",
    verdict: "refused",
    built: "None",
    reason: "The least verifiable output cannot be the most decorated one.",
  },
  {
    pattern: "Navigation that reorders itself",
    verdict: "refused",
    built: "Sidebar",
    reason: "The sidebar keeps the declared order: a rail when collapsed, a drawer on a phone.",
  },
];

function RegisterPage() {
  return (
    <Doc
      title="Register"
      lede="The surface is a register, not a dashboard: it records a value, says who recorded it, and lets the reader check. These are the rules every component and page follows. The story tests enforce the ones a machine can measure, in both themes, both densities and at both widths."
    >
      <DocSection
        title="Surfaces and lines"
        lede="Depth is a step in tone, not a line. A line appears only where it separates something: the rows of a table, the figures of a row."
      >
        <Example
          title="Collectors"
          padded={false}
          note="The table drops its frame on the surface. The filter is a tonal tag in an unframed toolbar, so there is one outline: the field's."
        >
          <DataTable caption="Collectors and their state" indexed={false}>
            <Toolbar role="search" label="Filter collectors">
              <SearchField id="register-filter" label="Search collectors" placeholder="Search collectors" size="sm" />
              <Tag mono pressed onRemove={() => undefined} removeLabel="Remove the filter state: running">
                state: running
              </Tag>
            </Toolbar>
            <TableHead>
              <TableColumn width="fill">Collector</TableColumn>
              <TableColumn>Received</TableColumn>
              <TableColumn>State</TableColumn>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.name}>
                  <TableCell mono>{entry.name}</TableCell>
                  <TableCell mono>{entry.received}</TableCell>
                  <TableCell>
                    <StatusPill tone={entry.state === "running" ? "ok" : "neutral"}>{entry.state}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Example>
        <Rules>
          <li>
            Never a surface on the same surface. A panel inside a panel takes the inset tone and drops its edge; a table
            on a surface drops its frame.
          </li>
          <li>
            One outline per object: nothing outlined sits inside something outlined within 8px. A selection inside a
            frame is a fill or a raised tone; items in a framed row are framed cells with no track, or unframed in one
            frame.
          </li>
          <li>
            Text and controls keep at least 12px from the inner edge of their surface. Rows, menus and media run to the
            edge on purpose.
          </li>
          <li>Only a detached plane gets a shadow: a menu, a dialog, a toast. No blur behind text.</li>
          <li>
            Footers and secondary zones are a quieter tone than the content. Controls under a list start on its text
            edge, or sit centred as one unit.
          </li>
        </Rules>
      </DocSection>

      <DocSection
        title="One strongest element"
        lede="Each view has one thing the eye lands on first. The header orients: name, status, where you are. It does not compete with the content."
      >
        <Grid min="320px" gap={16}>
          <Panel title="Collector key" heading={3}>
            <PanelStatus>
              <StatusPill tone="warn">expiring</StatusPill>
            </PanelStatus>
            <FactList layout="columns">
              <Fact label="Fingerprint" mono>
                a4f9c21e
              </Fact>
              <Fact label="Expires" mono>
                2026-11-05
              </Fact>
            </FactList>
            <PanelNote>The status sits with the title it qualifies. Only the title is bold.</PanelNote>
          </Panel>
          <Prose>
            <p>
              One bold voice per block: only the title is bold. A lead line, a value or a note is regular; emphasis in
              running text comes from colour or position.
            </p>
            <p>
              One label style per block: mono capitals above values, or sentence-case labels beside them, never both
              side by side.
            </p>
            <p>
              An opened part belongs to its head: the same surface, the same inset, its text on the title's edge, on a
              phone too.
            </p>
          </Prose>
        </Grid>
      </DocSection>

      <DocSection
        title="Focus and selection"
        lede="Focus shows where the keyboard is; selection shows what is chosen. Both are cornflower lines, and neither is a pale fill."
      >
        <Rules>
          <li>A ring shows only on keyboard focus (:focus-visible). After a pointer click there is none.</li>
          <li>A ring is never clipped and never overlaps a neighbour.</li>
          <li>
            Rows in a list, a menu, the sidebar, options and segments get an inset ring. A free-standing control gets an
            outside ring with an offset, and the scroll frame around it leaves room for it.
          </li>
          <li>Focused and selected is one indicator that changes, never two rings.</li>
          <li>The selected thing is a raised neutral tone; cornflower marks it as an edge or a border.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="Marks of provenance"
        lede="A value says how it came to be. The mark never carries the meaning alone; the word beside it does."
      >
        <Grid min="320px" gap={16}>
          <Example title="In a product" note="Drawn in ink, so gold stays with the one object in the view.">
            <Stack gap={8}>
              <SealValue state="sealed" stateLabel="Sealed">
                a4f9c21e
              </SealValue>
              <SealValue state="inferred" stateLabel="Inferred">
                7f3a99e0
              </SealValue>
              <SealValue state="absent" stateLabel="Not on record">
                none
              </SealValue>
            </Stack>
          </Example>
          <div data-brand="">
            <Example
              title="In a brand context"
              note="Sign-in, onboarding, a licence: the same marks in gold, because nothing else there is gold."
            >
              <Stack gap={8}>
                <SealValue state="sealed" stateLabel="Sealed">
                  a4f9c21e
                </SealValue>
                <SealValue state="inferred" stateLabel="Inferred">
                  7f3a99e0
                </SealValue>
              </Stack>
            </Example>
          </div>
        </Grid>
        <Example
          title="Delivery"
          note="A meta line in mono, quieter than the content; the tick rule closes a measurement."
        >
          <MetaLine items={["As of 2026-10-30 09:12", "14 sources", "updates live"]} />
          <TickRule />
        </Example>
        <Rules>
          <li>
            A filled dot: recorded and verifiable. A hollow ring: a model inferred it; nothing vouched for it yet.
          </li>
          <li>The less certain mark is the less decorated one. No gradient, glow or sparkle.</li>
          <li>Timestamps are ISO 8601 in mono. The tick rule is the only ornament, and only beside a measurement.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="A number only where order is information"
        lede="The steps of a process, the rank in an attention list, the phases of a story carry a number. A panel, a dialog, a card or an empty notice does not: a number that orders nothing makes the reader look for a meaning it does not have."
      >
        <Example title="Rotate the collector key">
          <Steps variant="list" tone="ruled" label="Rotate the collector key">
            <Step title="Issue the new key on the collector." />
            <Step title="Seal the first batch signed with it." />
            <Step title="Revoke the old key." />
          </Steps>
        </Example>
      </DocSection>

      <DocSection
        title="Ask, act, record"
        lede="Nothing a model proposes runs before a person agrees. The confirmation states the basis, the scope and whether it can be reversed. What follows is a receipt with the audit id, never an Undo."
      >
        <Example title="Wording" padded={false}>
          <DataTable caption="Confirmation wording" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>Write</TableColumn>
              <TableColumn>Not</TableColumn>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell label="Write">
                  Merge entry 07 into entry 03? Basis: same manifest hash. Scope: 2 entries. Reversible until the next
                  seal.
                </TableCell>
                <TableCell label="Not">Merged 2 entries. Undo</TableCell>
              </TableRow>
              <TableRow>
                <TableCell label="Write">Key revoked. Audit id 4f1c-77ab.</TableCell>
                <TableCell label="Not">Done! You can always undo this.</TableCell>
              </TableRow>
            </TableBody>
          </DataTable>
        </Example>
      </DocSection>

      <DocSection
        title="Taken and refused"
        lede="Current AI interfaces arrive with a style (glass, gradient edges, pulsing borders) and a substance (automation that declares and explains itself). The system takes the substance and refuses the style. Each line has its reason, so it can be argued with."
      >
        <Panel title="Decisions" heading={3} padded={false}>
          <DataTable caption="Decisions on current AI interface conventions" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>Convention</TableColumn>
              <TableColumn>Decision</TableColumn>
              <TableColumn>Built as</TableColumn>
              <TableColumn>Reason</TableColumn>
            </TableHead>
            <TableBody>
              {decisions.map((row) => (
                <TableRow key={row.pattern}>
                  <TableCell label="Convention">{row.pattern}</TableCell>
                  <TableCell label="Decision">
                    <StatusPill tone={tone[row.verdict]}>{row.verdict}</StatusPill>
                  </TableCell>
                  <TableCell label="Built as">{row.built}</TableCell>
                  <TableCell label="Reason">{row.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Panel>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Register",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Register: StoryObj = { render: () => <RegisterPage /> };
