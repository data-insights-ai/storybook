import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import {
  Button,
  CodeBlock,
  DataTable,
  Panel,
  Stack,
  PanelNote,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from "../../index";
import { Doc, DocSection, Rules } from "../guide/Doc";
import { corner, length, TokenTable } from "../guide/Tokens";

const space = [
  { token: "--di-space-4", use: "A mark to its word: the seal dot, a pill's dot." },
  { token: "--di-space-8", use: "Between two buttons. Inside a standard control." },
  { token: "--di-space-12", use: "A table cell. The least text keeps from the edge of its surface." },
  { token: "--di-space-16", use: "Between blocks inside a panel. The phone gutter." },
  { token: "--di-space-24", use: "A panel's inset. Between panels. Header to content." },
  { token: "--di-space-32", use: "Between the sections of a page." },
  { token: "--di-space-48", use: "The largest step a product screen uses." },
];

const radius = [
  { token: "--di-radius-micro", use: "What takes a value: a field, a search. Also a tag, a menu row, a tooltip." },
  { token: "--di-radius-control", use: "A button, a menu, a segment." },
  { token: "--di-radius-inset", use: "A group inside a surface, a code block." },
  { token: "--di-radius-surface", use: "A panel, a dialog, a record card, the drawer." },
];

const heights = [
  { token: "--di-control-h-sm", use: 'Button size="sm", a pressable Tag, a field in a table toolbar.' },
  { token: "--di-control-h-md", use: "The standard: every field and button unless told otherwise." },
  { token: "--di-control-h-lg", use: "A lone primary action, the command bar's field." },
  { token: "--di-row-h", use: "A table or list row." },
  { token: "--di-target", use: "The least hit area on a touch screen, in either density." },
];

const perDensity = [
  ["--di-control-h-sm | md | lg", "28 / 32 / 36", "24 / 28 / 32"],
  ["--di-row-h", "40", "32"],
  ["--di-option-h", "32", "28"],
  ["--di-pill-h, --di-kbd-h", "20, 18", "18, 16"],
  ["--di-icon-xs | sm | md | lg | xl", "12 / 14 / 16 / 20 / 24", "12 / 12 / 14 / 16 / 20"],
  ["--di-inset, --di-inset-group", "24, 16", "16, 12"],
  ["--di-gap-4 | 8 | 12 | 16 | 24 | 32", "4 / 8 / 12 / 16 / 24 / 32", "2 / 6 / 8 / 12 / 16 / 24"],
];

const motion = [
  { token: "--di-duration", use: "A colour or a state that changes: hover, press, a pill." },
  { token: "--di-duration-slow", use: "Something that moves or opens: a dialog, the drawer, a disclosure." },
  { token: "--di-ease", use: "Ease-out for both. No spring, no bounce, one change at a time." },
];

const setUp = `<ThemeProvider value={profile.theme}>
  <DensityProvider value={profile.density} onChange={saveDensity}>
    <App />
  </DensityProvider>
</ThemeProvider>`;

function Matrix({ density }: { density: "comfortable" | "compact" }) {
  return (
    <div data-density={density}>
      <Panel title={density === "comfortable" ? "Comfortable" : "Compact"} heading={3}>
        <Toolbar fillFirst>
          <TextField id={`scale-${density}`} label="Collector" placeholder="edge-gw-01" />
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button variant="secondary">Medium</Button>
          <Button size="lg">
            <Plus /> Large
          </Button>
        </Toolbar>
        <PanelNote>The field and the medium button share a height.</PanelNote>
      </Panel>
    </div>
  );
}

function ScalePage() {
  return (
    <Doc
      title="Scale"
      lede="Space, radius, height and motion are ramps. A component binds to a step and never measures its own; pnpm lint:tokens fails on a raw length in component CSS. Density scales every step, so the ratios hold in both."
    >
      <DocSection
        title="Space"
        lede="Named by value: --di-space-12 is 12px. A product screen stops at 48; 64 and 96 are for brand pages. Components take the --di-gap-* and --di-inset tokens, which follow the density; the page frame takes --di-space-*."
      >
        <TokenTable title="Space" caption="Space tokens" rows={space} draw={length} />
      </DocSection>

      <DocSection
        title="Density"
        lede="A component's size (sm, md, lg) is its role. The density, comfortable or compact, is the person's choice and scales every size. A large button in compact is smaller than in comfortable, and still the larger one beside a medium."
      >
        <Stack gap={16}>
          <Matrix density="comfortable" />
          <Matrix density="compact" />
        </Stack>
        <Panel title="One value per density" heading={3} padded={false}>
          <DataTable caption="Density tokens" indexed={false} narrow="stack">
            <TableHead>
              <TableColumn width="fill">Token</TableColumn>
              <TableColumn align="end">Comfortable (px)</TableColumn>
              <TableColumn align="end">Compact (px)</TableColumn>
            </TableHead>
            <TableBody>
              {perDensity.map(([token, comfortable, compact]) => (
                <TableRow key={token}>
                  <TableCell label="Token">
                    <span className="di-tokens-mono">{token}</span>
                  </TableCell>
                  <TableCell align="end" label="Comfortable">
                    <span className="di-tokens-mono">{comfortable}</span>
                  </TableCell>
                  <TableCell align="end" label="Compact">
                    <span className="di-tokens-mono">{compact}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Panel>
        <Rules>
          <li>The body stays 14px in both: compact is less air, not smaller text.</li>
          <li>
            DensityProvider writes <code>data-density</code> on the root before the first paint, from the person's
            profile, the way ThemeProvider sets the theme. Any element may set it for its region.
          </li>
          <li>
            A region differs only when its content has a density of its own: a raw event log may be compact in a
            comfortable page. Never to make something fit; a table that does not fit scrolls in its frame.
          </li>
          <li>On a touch screen every control keeps a 40px hit area in either density.</li>
          <li>Density is never a prop.</li>
        </Rules>
        <CodeBlock label="Setting the density from the profile">{setUp}</CodeBlock>
      </DocSection>

      <DocSection
        title="Radius and height"
        lede="The smaller the thing, the tighter the corner: a field is set into its panel, not floating on it. Only a pill is fully round. A field and a medium button share a height, so a toolbar is one line."
      >
        <TokenTable title="Radius" caption="Radius tokens" rows={radius} draw={corner} />
        <TokenTable title="Height" caption="Height tokens" rows={heights} draw={length} />
      </DocSection>

      <DocSection
        title="Motion"
        lede="Something moves because it moved. Two durations and one curve; if it can be a cut, it is a cut. With reduced motion set, nothing slides."
      >
        <TokenTable title="Motion" caption="Motion tokens" rows={motion} />
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Scale",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Scale: StoryObj = { render: () => <ScalePage /> };
