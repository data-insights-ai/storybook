import type { Meta, StoryObj } from "@storybook/react-vite";
import { LockKeyhole } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { SignIn, SignInVersion } from "./SignIn";
import { TextField } from "../../forms/text/TextField";
import { VersionTag } from "../../marks/VersionTag";
import { TextLink } from "../../navigation/TextLink";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { Panel } from "../../layout/page/Panel";
import { StatusPill } from "../../marks/status/StatusPill";

const meta = {
  title: "Shell/SignIn",
  component: SignIn,
  tags: ["layer:block", "autodocs"],
  parameters: { layout: "fullscreen", docs: { story: { inline: false, height: "720px" } } },
  args: {
    kicker: "datAInsights",
    eyebrow: "Sealed workspace",
    title: "Sign in",
    lede: "The register opens once the key is verified.",
    restriction: "access restricted to authorised operators",
    foot: "SSO and 2FA · end-to-end encrypted",
    onSubmit: fn(),
    children: null,
  },
  argTypes: {
    kicker: { control: "text" },
    eyebrow: { control: "text" },
    title: { control: "text" },
    lede: { control: "text" },
    restriction: { control: "text" },
    foot: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Navy sheet, paper card, and the seal where the ordinal would sit. */
export const Default: Story = {
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <VersionTag>v4.18.2</VersionTag>
      </SignInVersion>
      <TextField
        id="login-user"
        label="Email or username"
        autoComplete="username"
        defaultValue="nora.feld@data-insights.ai"
      />
      <TextField id="login-password" label="Password" type="password" autoComplete="current-password">
        <TextLink quiet={true}>Forgot password?</TextLink>
      </TextField>
      <Button type="submit" size="comfort">
        <LockKeyhole aria-hidden />
        Sign in
      </Button>
    </SignIn>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    const sheet = canvasElement.querySelector(".di-login")!;
    await expect(sheet.getBoundingClientRect().height).toBeGreaterThanOrEqual(window.innerHeight);
    await expect(getComputedStyle(document.documentElement).backgroundColor).toBe(getComputedStyle(sheet).backgroundColor);
  },
};

/** A rejected key. The error is on the field that caused it. */
export const Rejected: Story = {
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <VersionTag>v4.18.2</VersionTag>
      </SignInVersion>
      <TextField
        id="login-user-2"
        label="Email or username"
        autoComplete="username"
        defaultValue="nora.feld@data-insights.ai"
      />
      <TextField
        id="login-password-2"
        label="Password"
        type="password"
        autoComplete="current-password"
        hint="That key was not accepted. Two attempts remain."
        hintTone="error"
      >
        <TextLink quiet={true}>Forgot password?</TextLink>
      </TextField>
      <Button type="submit" size="comfort">
        <LockKeyhole aria-hidden />
        Sign in
      </Button>
    </SignIn>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("That key was not accepted. Two attempts remain.")).toBeVisible();
  },
};

/** Verifying. The control says so and cannot be pressed twice. */
export const Verifying: Story = {
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <VersionTag>v4.18.2</VersionTag>
      </SignInVersion>
      <TextField
        id="login-user-3"
        label="Email or username"
        autoComplete="username"
        defaultValue="nora.feld@data-insights.ai"
        disabled={true}
      />
      <TextField
        id="login-password-3"
        label="Password"
        type="password"
        autoComplete="current-password"
        disabled={true}
      />
      <Button type="submit" size="comfort" loading={true}>
        Verifying key
      </Button>
    </SignIn>
  ),
};

/** A second factor, on its own step. */
export const SecondFactor: Story = {
  args: {
    eyebrow: "Second factor",
    title: "Confirm the key",
    lede: "Enter the six digits from the authenticator paired with this workspace.",
  },
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <VersionTag>v4.18.2</VersionTag>
      </SignInVersion>
      <TextField
        id="login-otp"
        label="Six-digit code"
        mono={true}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="000000"
        hint="The code changes every 30 seconds."
      />
      <Button type="submit" size="comfort">
        <LockKeyhole aria-hidden />
        Confirm
      </Button>
    </SignIn>
  ),
};

/**
 * The card is the daylight theme on itself, in both themes, so a panel or a
 * table inside it is daylight too: nothing in it has to be pinned by hand.
 */
export const WithPanelAndTable: Story = {
  name: "With a panel and a table",
  args: { title: "Choose a workspace", lede: "Your account opens two workspaces." },
  render: (args) => (
    <SignIn {...args}>
      <Panel surface="inset" title="Last sign-in">
        Yesterday, 18:04, from Vienna.
      </Panel>
      <DataTable caption="Workspaces" indexed={false}>
        <TableHead>
          <TableColumn>Workspace</TableColumn>
          <TableColumn>State</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Production</TableCell>
            <TableCell>
              <StatusPill tone="ok">Open</StatusPill>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Staging</TableCell>
            <TableCell>
              <StatusPill tone="neutral">Idle</StatusPill>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>
      <Button type="submit" size="comfort">
        Open Production
      </Button>
    </SignIn>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector(".di-login-card") as HTMLElement;
    const daylight = document.createElement("div");
    daylight.dataset.theme = "light";
    document.body.append(daylight);
    const surface = getComputedStyle(daylight).getPropertyValue("--di-bg-surface");
    const ink = getComputedStyle(daylight).color;
    daylight.remove();
    await expect(getComputedStyle(card).getPropertyValue("--di-bg-surface")).toBe(surface);
    await expect(getComputedStyle(within(card).getByText("Staging")).color).toBe(ink);
  },
};
