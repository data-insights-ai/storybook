import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX } from "lucide-react";
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateIcon,
  Button,
  DataTable,
  Fact,
  FactList,
  Grid,
  Panel,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Toolbar,
} from "../../index";
import { Doc, DocSection, Example, Rules } from "../guide/Doc";

const rewrites = [
  ["Revolutionary AI that unlocks insights at scale.", "Every answer cites the rows it came from."],
  ["Seamlessly eliminate hallucinations.", "When we cannot cite a source, we say so."],
  ["Oops! Something went wrong.", "The export failed: the target refused the connection. Your data is unchanged."],
  ["No data.", "No source delivered in the last 24 hours. Check the collector."],
  ["Are you sure?", "Delete the organization Northwind? Its 4 workspaces and their data are removed."],
];

const words = [
  ["Rotate key", "Schlüssel rotieren", "Rotar clave"],
  ["Invite people", "Personen einladen", "Invitar a personas"],
  ["Clear filters", "Filter zurücksetzen", "Borrar filtros"],
  ["Last successful delivery", "Letzte erfolgreiche Zustellung", "Última entrega correcta"],
  ["You are the only owner.", "Sie sind der einzige Eigentümer.", "Usted es el único propietario."],
];

function VoicePage() {
  return (
    <Doc
      title="Voice"
      lede="Write like an analyst: short sentences, specific nouns, verbs that promise only what can be shown. When a sentence reaches for emphasis, it cites. Saying “we don’t know” is allowed; a guarantee we cannot audit is not."
    >
      <DocSection title="What we say" lede="What the company stands for, in the words the product and the site use.">
        <Panel title="Positioning" heading={3}>
          <FactList layout="columns">
            <Fact label="Promise">No guesses: every answer can be traced.</Fact>
            <Fact label="Proof">Knowledge graphs, timestamps, evidence that can be replayed.</Fact>
            <Fact label="For">Government, finance, pharma, legal, infrastructure.</Fact>
            <Fact label="Against">Black-box answers and “trust us”.</Fact>
          </FactList>
        </Panel>
      </DocSection>

      <DocSection title="In the product" lede="The interface says what it does, and what happened.">
        <Rules>
          <li>A button names its action as a verb and an object: “Rotate key”, “Delete organization”.</li>
          <li>A state is a word beside its mark: “running”, “paused”, “failed”. Never colour alone.</li>
          <li>An empty list says why it is empty and offers one way out.</li>
          <li>A failure says what failed and what still works. No “Oops”, no apology, no exclamation mark.</li>
          <li>A confirmation states the basis, the scope and whether it can be reversed, before the action.</li>
          <li>Sentence case for titles, labels and buttons. Capitals only in a mono label above a value.</li>
          <li>No hype words (revolutionary, seamless, unlock, leverage), no emoji.</li>
        </Rules>
        <Example title="Rewrites" padded={false}>
          <DataTable caption="Wording to replace" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>Instead of</TableColumn>
              <TableColumn>Write</TableColumn>
            </TableHead>
            <TableBody>
              {rewrites.map(([before, after]) => (
                <TableRow key={before}>
                  <TableCell label="Instead of">{before}</TableCell>
                  <TableCell label="Write">{after}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Example>
      </DocSection>

      <DocSection
        title="German and Spanish"
        lede="Every visible string is a prop; a product passes its own language in. German addresses the reader formally with “Sie”, Spanish with “usted”. German runs about a third longer: a label that fits in English must still fit, or wrap between words."
      >
        <Example title="The same words" padded={false}>
          <DataTable caption="English, German and Spanish wording" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>English</TableColumn>
              <TableColumn>Deutsch</TableColumn>
              <TableColumn>Español</TableColumn>
            </TableHead>
            <TableBody>
              {words.map(([en, de, es]) => (
                <TableRow key={en}>
                  <TableCell label="English">{en}</TableCell>
                  <TableCell label="Deutsch">{de}</TableCell>
                  <TableCell label="Español">{es}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Example>
        <Grid min="320px" gap={16}>
          <div lang="de">
            <Panel title="Quellen" heading={3}>
              <EmptyState
                title="Keine Quelle passt zu diesem Filter."
                body="Das Register enthält 24 Quellen. Keine wurde in den letzten 24 Stunden pausiert."
              >
                <EmptyStateIcon>
                  <SearchX />
                </EmptyStateIcon>
                <EmptyStateAction>
                  <Button variant="secondary" size="sm">
                    Filter zurücksetzen
                  </Button>
                </EmptyStateAction>
              </EmptyState>
            </Panel>
          </div>
          <div lang="de">
            <Example
              title="Lange Bezeichnungen"
              note="German labels wrap between words, never inside one; a button keeps its label on one line."
            >
              <FactList layout="columns">
                <Fact label="Letzte erfolgreiche Zustellung" mono>
                  2026-10-30 09:12
                </Fact>
                <Fact label="Aufbewahrungsfrist" mono>
                  90 Tage
                </Fact>
              </FactList>
              <Toolbar align="end">
                <Button variant="secondary">Abbrechen</Button>
                <Button>Schlüssel rotieren</Button>
              </Toolbar>
            </Example>
          </div>
        </Grid>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Voice",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Voice: StoryObj = { render: () => <VoicePage /> };
