import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Panel, PanelMeta } from "../../layout/page/Panel";
import { TextField } from "../../forms/text/TextField";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { TextLink } from "./TextLink";

const meta = {
  title: "Navigation/TextLink",
  component: TextLink,
  tags: ["layer:primitive", "autodocs"],
  args: {
    children: "Open the record",
    quiet: false,
    mono: false,
    plain: false,
    disabled: false,
    type: "button",
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    quiet: { control: "boolean" },
    mono: { control: "boolean" },
    plain: { control: "boolean" },
    trail: { control: "radio", options: [undefined, "arrow", "external"] },
    disabled: { control: "boolean" },
    type: { control: "radio", options: ["button", "submit", "reset"] },
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In a sentence, which is where it has to hold its own: ink, underlined in cornflower, at the size of the line. */
export const InProse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ maxWidth: 420 }}>
      The manifest for this entry was sealed at 09:12:04Z. <TextLink href="#/register/0148">Open the record</TextLink>{" "}
      to see every source it cites, or <TextLink>export the seal</TextLink> for offline verification.
    </p>
  ),
};

/** An action link at a panel's edge: the trailing arrow says it goes on to the full page. */
export const AtABlocksEdge: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Panel title="Recent signals">
        <PanelMeta>
          <TextLink href="#/signals" trail="arrow">
            All signals
          </TextLink>
        </PanelMeta>
        <p>Three signals arrived in the last hour, none of them above medium.</p>
        <p>
          <TextLink href="https://attack.mitre.org/techniques/T1021/002/" trail="external">
            T1021.002 on MITRE ATT&CK
          </TextLink>
        </p>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "All signals" });
    await expect(link.querySelector(".di-textlink-trail")).toHaveAttribute("aria-hidden");
  },
};

/** A button that acts, drawn as a link. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open the record" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/** Quiet, a secondary link under a field: muted, in the reading face, and still underlined. */
export const Quiet: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--di-space-8)", maxWidth: 360 }}>
      <TextField id="textlink-password" label="Password" type="password" />
      <span>
        <TextLink quiet>Forgot password?</TextLink>
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("button", { name: "Forgot password?" });
    await expect(getComputedStyle(link).fontFamily).not.toMatch(/Mono/);
    await expect(getComputedStyle(link).textDecorationLine).toBe("underline");
  },
};

/**
 * In a dense table: ids that open their record are `mono quiet`; a count
 * that filters is `plain`, underlined on hover and focus, because the
 * column already says it is a link.
 */
export const InATable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel title="Open cases" padded={false}>
      <DataTable caption="Open cases" indexed={false}>
        <TableHead>
          <TableColumn>Case</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn align="end">Unassigned</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <TextLink href="#/cases/0148" mono quiet>
                REG-0148
              </TextLink>
            </TableCell>
            <TableCell>Service account used from a new host</TableCell>
            <TableCell align="end">
              <TextLink plain aria-label="3 unassigned">
                3
              </TextLink>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextLink href="#/cases/0151" mono quiet>
                REG-0151
              </TextLink>
            </TableCell>
            <TableCell>Admin share reached from a workstation</TableCell>
            <TableCell align="end">
              <TextLink plain aria-label="1 unassigned">
                1
              </TextLink>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>
    </Panel>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: "Not available" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Not available" })).toBeDisabled();
  },
};

/**
 * With an `href` it is an anchor: it navigates rather than acts, so it
 * opens in a new tab and copies like any other link.
 */
export const Link: Story = {
  args: { children: "Open the record" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => <TextLink href="#/register/0148">{children}</TextLink>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Open the record" });
    await expect(link).toHaveAttribute("href", "#/register/0148");
  },
};

/** A record id that opens its record: in the code face, because a machine wrote it. */
export const MonoLink: Story = {
  args: { children: "REG-0148" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => (
    <TextLink href="#/register/0148" mono>
      {children}
    </TextLink>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "REG-0148" })).toHaveClass("is-mono");
  },
};

/** A router's link component renders the anchor; the text link supplies only its look. */
export const WithRouterLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content -- TextLink renders its text into the router's anchor
    <TextLink render={<a href="#/records/0148" data-router="link" />}>REG-0148</TextLink>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "REG-0148" });
    await expect(link).toHaveClass("di-textlink");
    await expect(link).toHaveAttribute("data-router", "link");
  },
};
