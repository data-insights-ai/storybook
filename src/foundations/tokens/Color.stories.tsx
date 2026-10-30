import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
  ChoiceGroup,
  DataTable,
  Fact,
  FactList,
  Grid,
  Highlight,
  Panel,
  PanelLead,
  PanelNote,
  SealValue,
  SeverityMark,
  Stack,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Toolbar,
} from "../../index";
import { Doc, DocSection, Example, Prose, Rules } from "../guide/Doc";
import { fill, ink, TokenTable } from "../guide/Tokens";

const ground = [
  { token: "--di-bg-chrome", use: "The sidebar, one step below the ground. Also --di-bg-strip." },
  { token: "--di-bg-page", use: "The ground of every page." },
  { token: "--di-bg-surface", use: "A panel, a table, a dialog: one step above the ground." },
  { token: "--di-bg-subtle", use: "Inset inside a surface: a group, a table head, a code block." },
  { token: "--di-bg-plane", use: "What is lifted: a menu, a popover, the selected row." },
  { token: "--di-bg-row-hover", use: "A row under the pointer." },
  { token: "--di-bg-readonly", use: "A field that shows a value but does not take one." },
  { token: "--di-bg-disabled", use: "A control that cannot be used now." },
];

const inks = [
  { token: "--di-text", use: "Body text and headings." },
  { token: "--di-text-muted", use: "Secondary text, the mono label above a value." },
  { token: "--di-text-subtle", use: "Meta lines, hints, quiet notes." },
  {
    token: "--di-fill-strong",
    use: "The one filled control: navy by day, paper-white after dark. Its text is --di-text-on-strong.",
  },
];

const one = [
  { token: "--di-one", use: "The one object in a view: an edge, a mark, the pill behind navy words." },
  { token: "--di-one-edge", use: "The edge of the emphasised panel or the first attention item." },
  { token: "--di-mark", use: "The record marks (sealed dot, inferred ring) in an operational view: ink." },
  { token: "--di-seal", use: "The same marks in a brand context: sign-in, onboarding, a licence." },
];

const lines = [
  { token: "--di-bg-selected", use: "A selected row or option: the plane a step above its list, never a tint." },
  { token: "--di-select", use: "Selection: the selected row's edge, a chosen card's border, a link's underline." },
  { token: "--di-focus", use: "The keyboard focus ring." },
  { token: "--di-text-highlight", use: "Text selected with the pointer: the one pale cornflower fill left." },
  { token: "--di-border", use: "Where two equal tones meet." },
  { token: "--di-border-input", use: "The frame of a field." },
  { token: "--di-rule", use: "Between the rows of a table and the figures of a row, nowhere else." },
];

const charts = [
  { token: "--di-chart-series", use: "The recorded series, in ink." },
  { token: "--di-chart-highlight", use: "The one value the eye should land on." },
  { token: "--di-chart-compare", use: "What the series is measured against." },
  { token: "--di-chart-muted", use: "A comparison bar, grey." },
  { token: "--di-chart-band", use: "The range around a median." },
  { token: "--di-chart-warn", use: "A reading past the medium threshold." },
  { token: "--di-chart-danger", use: "A reading past the critical threshold." },
];

const accents = [
  { token: "--di-highlight", use: "Poppy: a marked passage or figure on a brand page (Highlight)." },
  { token: "--di-highlight-tint", use: "The band under a marked passage." },
];

function Selection() {
  const [window, setWindow] = useState("24h");
  const [row, setRow] = useState("edge-gw-02");
  const [source, setSource] = useState("syslog");
  const [days, setDays] = useState<string[]>(["sat", "sun"]);
  return (
    <>
      <Example
        title="A view and a row"
        note="The chosen segment is a raised thumb in ink. The selected row is lifted to the plane with a cornflower edge on its leading side."
        padded={false}
      >
        <DataTable caption="Collectors" indexed={false}>
          <Toolbar label="Window">
            <ChoiceGroup
              appearance="segments"
              hideLegend
              legend="Window"
              name="color-window"
              options={[
                { value: "1h", label: "1h" },
                { value: "24h", label: "24h" },
                { value: "7d", label: "7d" },
              ]}
              value={window}
              onChange={setWindow}
            />
          </Toolbar>
          <TableHead>
            <TableColumn width="fill">Collector</TableColumn>
            <TableColumn>State</TableColumn>
          </TableHead>
          <TableBody>
            {["edge-gw-01", "edge-gw-02", "edge-gw-03"].map((name) => (
              <TableRow key={name} active={row === name} onSelect={() => setRow(name)}>
                <TableCell mono>{name}</TableCell>
                <TableCell>
                  <StatusPill tone="ok">running</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Example>
      <Example
        title="A value"
        note="A chosen card keeps its neutral surface and gets a 2px cornflower line. A chosen toggle is a value, so it takes the primary ink fill."
      >
        <Stack gap={16}>
          <ChoiceGroup
            appearance="cards"
            legend="Source type"
            name="color-source"
            options={[
              { value: "syslog", label: "Syslog", description: "CEF or RFC 5424 over TLS." },
              { value: "hec", label: "Splunk HEC", description: "Events pushed over HTTPS." },
            ]}
            value={source}
            onChange={setSource}
          />
          <ChoiceGroup
            appearance="toggles"
            multiple
            legend="Quiet on"
            name="color-days"
            options={[
              { value: "mon", label: "Mo" },
              { value: "tue", label: "Tu" },
              { value: "wed", label: "We" },
              { value: "thu", label: "Th" },
              { value: "fri", label: "Fr" },
              { value: "sat", label: "Sa" },
              { value: "sun", label: "Su" },
            ]}
            value={days}
            onChange={setDays}
          />
        </Stack>
      </Example>
    </>
  );
}

function ColorPage() {
  return (
    <Doc
      title="Color"
      lede="Paper is the ground and depth is a step in tone. Navy is the ink and the one filled control. Gold marks one object per view. Cornflower is a line: selection and focus. Every value below is read from the token where it is painted, so the dark theme shows its own."
    >
      <DocSection
        title="Ground and depth"
        lede="Chrome, ground, surface, inset and plane are steps of one ramp. A surface never sits on the same surface: a panel inside a panel takes the inset tone and drops its edge."
      >
        <Grid min="320px" gap={16}>
          <Example title="Sources" note="A surface on the ground, an inset group inside it. No line between them.">
            <Panel surface="inset" title="Last delivery">
              <FactList layout="columns">
                <Fact label="Received" mono>
                  09:12:04Z
                </Fact>
                <Fact label="Events" mono>
                  1,842
                </Fact>
              </FactList>
            </Panel>
          </Example>
          <Example
            title="One filled control"
            note="Only the requested action is solid. After dark it turns paper-white."
          >
            <Toolbar align="end">
              <Button variant="ghost">Cancel</Button>
              <Button variant="secondary">Save draft</Button>
              <Button>Rotate key</Button>
            </Toolbar>
          </Example>
        </Grid>
        <TokenTable title="Ground" caption="Ground and depth tokens" rows={ground} draw={fill} />
        <TokenTable title="Ink and action" caption="Ink tokens" rows={inks} draw={ink} />
      </DocSection>

      <DocSection
        title="Gold, the one thing"
        lede="Gold marks one object in a view: the block that matters, the first attention item, the value of a chart the eye should land on. In daylight it is an edge, a mark or a pill behind navy words, never text. After dark gold may be text."
      >
        <Grid min="320px" gap={16}>
          <Panel title="Two sources stopped delivering" heading={3} emphasis>
            <PanelLead>Check the firewall rule on edge-gw-02 before the next upload.</PanelLead>
            <PanelNote>The emphasised panel: a gold edge, the title stays the one bold line.</PanelNote>
          </Panel>
          <Example
            title="Record marks"
            note="In an operational view the sealed dot and the inferred ring are ink, so gold stays with the one object."
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
        </Grid>
        <Rules>
          <li>The seal is gold too, so it is a brand moment only: sign-in, onboarding, a licence or certificate.</li>
          <li>Never two gold objects in one view. A second candidate gets the ink treatment.</li>
        </Rules>
        <TokenTable title="Gold and the marks" caption="Gold tokens" rows={one} draw={fill} />
      </DocSection>

      <DocSection
        title="Selection and focus"
        lede="Cornflower is a line, never a pale fill: the selected row's leading edge, a chosen card's border, a link's underline, the focus ring. The selected thing itself takes a neutral raised tone."
      >
        <Selection />
        <Rules>
          <li>A chosen card, tag or option: its neutral surface and a 2px cornflower line.</li>
          <li>
            Segments: a raised neutral thumb. Toggles and the selected calendar day: the primary ink fill; the days
            inside a range sit on the inset tone.
          </li>
          <li>A selected row: lifted to the plane, with a cornflower edge on its leading side.</li>
          <li>
            Native checkboxes, radios and ranges follow the token through <code>accent-color</code>.
          </li>
          <li>
            Focus and selection on one element are one indicator that changes, never two rings. A ring shows only on
            keyboard focus.
          </li>
        </Rules>
        <TokenTable title="Lines" caption="Selection, focus and line tokens" rows={lines} draw={fill} />
      </DocSection>

      <DocSection
        title="Status and severity"
        lede="A state is a word beside its mark, never colour alone. Warn is its own amber, so it never reads as the one gold. Severity is one scale in every product and chart; after dark medium runs orange so it never reads as gold."
      >
        <Grid min="320px" gap={16}>
          <Example title="Status" note="StatusPill: the word carries the meaning, the dot repeats it.">
            <Toolbar>
              <StatusPill tone="ok">running</StatusPill>
              <StatusPill tone="warn">expiring</StatusPill>
              <StatusPill tone="danger">failed</StatusPill>
              <StatusPill tone="recorded">recorded</StatusPill>
              <StatusPill tone="inferred">inferred</StatusPill>
              <StatusPill tone="neutral">paused</StatusPill>
            </Toolbar>
          </Example>
          <Example title="Severity" note="SeverityMark: a filled mark beside the word, never the text's own colour.">
            <Toolbar>
              <SeverityMark level="critical" label="Critical" />
              <SeverityMark level="high" label="High" />
              <SeverityMark level="medium" label="Medium" />
              <SeverityMark level="low" label="Low" />
              <SeverityMark level="info" label="Info" />
            </Toolbar>
          </Example>
        </Grid>
      </DocSection>

      <DocSection
        title="Charts and accents"
        lede="One series in ink, the one value in gold, a comparison in cornflower or grey. A severity hue appears only where a reading crossed a threshold. Poppy marks a passage on a brand page and nothing else."
      >
        <Prose>
          <p>
            Coverage rose to <Highlight variant="figure">94 %</Highlight> <Highlight>without a new source</Highlight>.
          </p>
        </Prose>
        <TokenTable title="Charts" caption="Chart tokens" rows={charts} draw={fill} />
        <TokenTable title="Poppy" caption="Accent tokens" rows={accents} draw={fill} />
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Color",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Color: StoryObj = { render: () => <ColorPage /> };
