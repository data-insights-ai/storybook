import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CoverageMatrix, CoverageMatrixLegend, type CoverageMatrixColumn } from "./CoverageMatrix";

// A public reference set — the enterprise ATT&CK tactics and how many
// techniques each holds — with an invented observation laid over it.
const COLUMNS: CoverageMatrixColumn[] = [
  { code: "TA0043", label: "Reconnaissance", size: 10, marks: [] },
  { code: "TA0042", label: "Resource development", size: 8, marks: [] },
  {
    code: "TA0001",
    label: "Initial access",
    size: 10,
    marks: [{ code: "T1078", label: "Valid Accounts", tone: "warn" }],
  },
  { code: "TA0002", label: "Execution", size: 14, marks: [] },
  { code: "TA0003", label: "Persistence", size: 20, marks: [] },
  { code: "TA0004", label: "Privilege escalation", size: 14, marks: [] },
  { code: "TA0005", label: "Defense evasion", size: 43, marks: [] },
  { code: "TA0006", label: "Credential access", size: 17, marks: [] },
  {
    code: "TA0007",
    label: "Discovery",
    size: 32,
    marks: [
      { code: "T1087.002", label: "Account Discovery: Domain Account", tone: "neutral" },
      { code: "T1018", label: "Remote System Discovery", tone: "neutral" },
    ],
  },
  {
    code: "TA0008",
    label: "Lateral movement",
    size: 9,
    marks: [{ code: "T1021.001", label: "Remote Services: Remote Desktop Protocol", tone: "danger" }],
  },
  { code: "TA0009", label: "Collection", size: 17, marks: [] },
  { code: "TA0011", label: "Command and control", size: 18, marks: [] },
  { code: "TA0010", label: "Exfiltration", size: 9, marks: [] },
  { code: "TA0040", label: "Impact", size: 14, marks: [] },
];

const meta = {
  title: "Charts/Compare/CoverageMatrix",
  component: CoverageMatrix,
  tags: ["layer:primitive", "autodocs"],
  args: {
    label: "Technique matrix",
    columns: COLUMNS,
  },
  argTypes: {
    label: { control: "text" },
    columns: { control: "object" },
  },
} satisfies Meta<typeof CoverageMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every column of the set, the reached ones framed. A filled cell is one
 * item seen; the codes beneath say which, and name themselves on hover.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Technique matrix" })).toBeVisible();
    const discovery = canvas.getByRole("group", { name: "Discovery" });
    await expect(within(discovery).getAllByRole("listitem")).toHaveLength(2);
    await expect(within(discovery).getByText("TA0007 · 32")).toBeVisible();
    // A column nobody reached lists nothing.
    const impact = canvas.getByRole("group", { name: "Impact" });
    await expect(within(impact).queryAllByRole("listitem")).toHaveLength(0);
  },
};

/** The legend beneath it names the tones, so the colour is never the only channel. */
export const WithLegend: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--di-space-16)" }}>
      <CoverageMatrix {...args} />
      <CoverageMatrixLegend
        tones={[
          { tone: "neutral", label: "low" },
          { tone: "warn", label: "medium" },
          { tone: "danger", label: "high" },
        ]}
        emptyLabel="not observed"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("high")).toBeVisible();
    await expect(canvas.getByText("not observed")).toBeVisible();
  },
};

/** Nothing seen: every column stays open and unframed. */
export const NothingReached: Story = {
  args: { columns: COLUMNS.map((column) => ({ ...column, marks: [] })) },
};

/** A code with no name on record is written as it came, with nothing to open. */
export const UnnamedCode: Story = {
  args: {
    columns: [
      {
        code: "TA0008",
        label: "Lateral movement",
        size: 9,
        marks: [{ code: "T1563", label: "", tone: "warn" }],
      },
      { code: "TA0009", label: "Collection", size: 17, marks: [] },
    ],
  },
};

/** Narrower than the set, the matrix scrolls in its own frame, reachable from the keyboard. */
export const Scrolling: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByRole("region", { name: "Technique matrix" });
    await userEvent.tab();
    await waitFor(() => expect(frame).toHaveFocus());
    await expect(frame.scrollWidth).toBeGreaterThan(frame.clientWidth);
  },
};
