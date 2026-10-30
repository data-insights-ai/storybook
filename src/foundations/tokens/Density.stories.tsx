import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Button } from "../../components/actions/Button";
import { TextField } from "../../components/forms/text/TextField";
import {
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../../components/data/table/DataTable";
import { Toolbar } from "../../components/layout/arrangement/Toolbar";
import { Panel, PanelNote } from "../../components/layout/page/Panel";
import { StatusPill } from "../../components/marks/status/StatusPill";
import { CodeBlock } from "../../components/text/CodeBlock";
import { Page, Rule, Rules, Section } from "../guide/Guide";
import "./foundations.css";

const tokens = [
  { token: "--di-control-h-sm | md | lg", comfortable: "28 / 32 / 36", compact: "24 / 28 / 32" },
  { token: "--di-row-h", comfortable: "40", compact: "32" },
  { token: "--di-option-h", comfortable: "32", compact: "28" },
  { token: "--di-pill-h, --di-kbd-h", comfortable: "20, 18", compact: "18, 16" },
  {
    token: "--di-icon-xs | sm | md | lg | xl",
    comfortable: "12 / 14 / 16 / 20 / 24",
    compact: "12 / 12 / 14 / 16 / 20",
  },
  { token: "--di-inset, --di-inset-group", comfortable: "24, 16", compact: "16, 12" },
  {
    token: "--di-gap-4 | 8 | 12 | 16 | 24 | 32",
    comfortable: "4 / 8 / 12 / 16 / 24 / 32",
    compact: "2 / 6 / 8 / 12 / 16 / 24",
  },
];

const setUp = `import { DensityProvider, ThemeProvider, type Density } from "@data-insights-ai/ui";

// The person's choice lives in their profile, like the theme.
function Root({ profile, save }: { profile: { density: Density }; save: (d: Density) => void }) {
  return (
    <ThemeProvider value={profile.theme}>
      <DensityProvider value={profile.density} onChange={save}>
        <App />
      </DensityProvider>
    </ThemeProvider>
  );
}

// A settings control anywhere below reads and changes it.
const { density, setDensity } = useDensity();`;

function Matrix({ density }: { density: "comfortable" | "compact" }) {
  return (
    <div data-density={density}>
      <Panel label={density} title="Sources">
        <Toolbar>
          <TextField id={`density-${density}`} label="Name" placeholder="edge-gw-01" />
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button variant="secondary">Medium</Button>
          <Button size="lg">
            <Plus /> Large
          </Button>
          <StatusPill tone="ok">running</StatusPill>
        </Toolbar>
        <PanelNote>The field and the medium button share a height.</PanelNote>
      </Panel>
    </div>
  );
}

const meta = { title: "Foundations/Density", tags: ["layer:foundation"] } satisfies Meta;
export default meta;

/** Size and density are two axes: a size is a role, the density is the person's choice of air. */
export const Density: StoryObj = {
  render: () => (
    <Page
      eyebrow="Density"
      title="Two axes: what a control is, and how much air the person wants."
      lede="A component's size (sm, md, lg) is its role in the layout. The density is the person's choice, comfortable or compact, and it scales every size: a large button in compact is smaller than a large button in comfortable, and still the larger of the two beside a medium one."
    >
      <Section
        eyebrow="The matrix"
        title="Every size, in both densities."
        lede="The same toolbar in each density. A field and a medium button share a height in both, so a toolbar stays one line; the steps between the sizes hold."
      >
        <div className="di-density-matrix">
          <Matrix density="comfortable" />
          <Matrix density="compact" />
        </div>
      </Section>

      <Section
        eyebrow="Tokens"
        title="One value per density."
        lede="Comfortable keeps the values the console shipped with, so it is the default and nothing moved when density arrived. Compact is 7/8 of comfortable rounded to an even pixel; a gap or an inset steps one rung down the space ramp. The body stays 14px in both: compact is less air, not smaller text."
      >
        <DataTable caption="Density tokens" indexed={false}>
          <TableHead>
            <TableColumn>Token</TableColumn>
            <TableColumn align="end">Comfortable (px)</TableColumn>
            <TableColumn align="end">Compact (px)</TableColumn>
          </TableHead>
          <TableBody>
            {tokens.map((row) => (
              <TableRow key={row.token}>
                <TableCell mono>{row.token}</TableCell>
                <TableCell mono align="end" label="Comfortable">
                  {row.comfortable}
                </TableCell>
                <TableCell mono align="end" label="Compact">
                  {row.compact}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Section>

      <Section
        eyebrow="In a product"
        title="The person chooses; the profile keeps it."
        lede="`DensityProvider` writes `data-density` on the root before the first paint. The app passes the saved value and stores a new one in `onChange`, exactly as it does for the theme; `useDensity` gives a settings control the value and the setter."
      >
        <CodeBlock label="Setting the density from the profile">{setUp}</CodeBlock>
      </Section>

      <Section
        eyebrow="Rules"
        title="When a region may differ."
        lede="`data-density` works on any element, and everything inside it follows."
      >
        <Rules>
          <Rule>
            A region overrides the person's choice only when its content has a density of its own: a log or a raw event
            list read row by row may be compact inside a comfortable page. A brand page or a sign-in card may be
            comfortable inside a compact app.
          </Rule>
          <Rule>Never to fit content into a space. A table that does not fit scrolls; it does not get compact.</Rule>
          <Rule>
            On a touch screen compact never shrinks a hit area: controls, rows and options keep the comfortable 40px
            target there, whatever was chosen.
          </Rule>
          <Rule>
            Density is never a prop. A component has a `size` for its role and follows the density through its tokens;
            `pnpm lint:tokens` fails on a raw length in component CSS, so a value the density cannot move cannot come
            back.
          </Rule>
        </Rules>
      </Section>
    </Page>
  ),
};
