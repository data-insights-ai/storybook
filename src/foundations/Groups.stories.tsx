import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, Panel, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../index";
import { Doc, DocSection, Rules } from "./guide/Doc";

const groups = [
  {
    group: "Actions",
    question: "Let someone do something.",
    components: "Button, Toolbar, Menu, CopyValue",
    note: "Toolbar is one component for a list toolbar, a selection bar, unsaved changes, a form's end and row actions. Menu holds actions, so it is not Navigation.",
  },
  {
    group: "Forms",
    question: "Let someone enter or choose.",
    components:
      "TextField, TextArea, SearchField, QuantityField, FileField, Select, ComboBox, MultiComboBox, ChoiceGroup, Checkbox, Radio, Switch, DateField, TimeField, DateRangePicker, FieldLabel, FieldHint, CreateFlow",
    note: "CreateFlow renders Steps but owns the form state.",
  },
  {
    group: "Tables",
    question: "Show many rows to scan, sort and filter.",
    components: "DataTable, InfiniteTable, NewEntries",
    note: "The table toolbar and the selection bar are Toolbar roles.",
  },
  {
    group: "Records",
    question: "Show one record, or a short list of them.",
    components: "RecordCard, FactList, ProposalPanel, AttentionList, IconTile",
    note: "ProposalPanel is a record a model wrote.",
  },
  {
    group: "Figures",
    question: "Show a number.",
    components: "Figure, FigureRow, Sparkline",
    note: "A sparkline has no axis and is read beside its figure.",
  },
  {
    group: "Text",
    question: "Set text.",
    components: "Eyebrow, MetaLine, TextLink, Kbd, CodeBlock, Highlight, PullQuote, TickRule, Icon",
    note: "A page's or a section's heading is PageHeader (Layout).",
  },
  {
    group: "Status",
    question: "Show the state of a thing, inline.",
    components: "StatusPill, SeverityMark, SealValue, Badge, Tag, LevelMeter",
    note: "Tag names a thing and can be pressed or removed; StatusPill names a state from a closed list. A quota is a LevelMeter.",
  },
  {
    group: "Feedback",
    question: "Say what happened, or what is happening.",
    components: "Notice, Toast, Loading, Progress, RouteProgress, Delayed",
    note: "An empty list is Notice variant empty; “everything is running” is variant line.",
  },
  {
    group: "Charts",
    question: "Plot data on a scale.",
    components: "Chart, TrendChart, Seismograph, Distribution, CoverageMatrix",
    note: "A chart has an axis or a scale. A single value is a figure or a meter.",
  },
  {
    group: "Timelines",
    question: "Events and periods over time.",
    components: "EventTimeline, TimelineSummary, ChainTimeline, PeriodTimeline",
    note: "Each brings its own interaction: zoom, episodes, links between lanes.",
  },
  {
    group: "Layout",
    question: "Arrange a page.",
    components: "Page, PageHeader, Panel, DetailSection, Stack, Grid, Split, Disclosure",
    note: 'Panel covers the danger zone (tone="danger") and the hero (surface="hero").',
  },
  {
    group: "Navigation",
    question: "Move between places.",
    components: "Sidebar, Breadcrumb, Tabs, TabNav, Pagination, Steps, CommandBar",
    note: "Steps shows where a reader is in a bounded flow.",
  },
  {
    group: "Overlays",
    question: "Show something above the page.",
    components: "Dialog, ConfirmDialog, ShortcutHelp, Flyout, Tooltip, TooltipTarget",
    note: "Dialog is side, centre or bottom. A tooltip names a control; it reports nothing.",
  },
  {
    group: "Shell",
    question: "The app frame.",
    components: "AppShellBar, AppShellContent, SignIn, SkipLink, ThemeProvider, DensityProvider",
    note: "The Sidebar is in Navigation, where someone adding a section looks for it.",
  },
];

function GroupsPage() {
  return (
    <Doc
      title="Groups"
      lede="The sidebar is grouped by the question a developer asks when looking for a component: fourteen groups, one folder each."
    >
      <DocSection title="The rule">
        <Rules>
          <li>Each group is one folder under src/components and one Storybook group of the same name.</li>
          <li>
            A component goes where a developer looks first. Where it fits two groups, its docs name the other one.
          </li>
          <li>
            A folder holds at most eight entries. A larger group gets sub-folders, and each is a subgroup in the
            sidebar: Forms (Field, Text, Choice, Select, Dates), Text (Blocks), Layout (Page, Arrange).
          </li>
          <li>The group is not part of the import: export names stay the same wherever a component sits.</li>
          <li>Foundations and Patterns stay sections of their own, outside src/components.</li>
        </Rules>
      </DocSection>
      <DocSection title="The fourteen groups">
        <Panel padded={false}>
          <DataTable caption="Component groups" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>Group</TableColumn>
              <TableColumn>Question</TableColumn>
              <TableColumn>Components</TableColumn>
              <TableColumn>Where it could sit twice</TableColumn>
            </TableHead>
            <TableBody>
              {groups.map((row) => (
                <TableRow key={row.group}>
                  <TableCell label="Group">{row.group}</TableCell>
                  <TableCell label="Question">{row.question}</TableCell>
                  <TableCell label="Components">{row.components}</TableCell>
                  <TableCell label="Where it could sit twice">{row.note}</TableCell>
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
  title: "Foundations/Groups",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Groups: StoryObj = { render: () => <GroupsPage /> };
