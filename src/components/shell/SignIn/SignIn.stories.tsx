import type { Meta, StoryObj } from "@storybook/react-vite";
import { LockKeyhole } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { SignIn, SignInVersion } from "./SignIn";
import { TextField } from "../../forms/text/TextField";
import { Tag } from "../../marks/Tag";
import { TextLink } from "../../navigation/TextLink";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../data/table/DataTable";
import { Fact, FactList } from "../../data/records/FactList";
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
    restriction: "Access is restricted to authorised operators.",
    foot: "SSO and 2FA · End-to-end encrypted",
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

/**
 * The look the hosted login copies: the paper ground with one surface card
 * and the navy button in daylight, IBM Plex Sans at 400, the seal before the
 * eyebrow. Switch the theme for the navy ground and the paper-white button.
 */
export const Default: Story = {
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <Tag mono>v4.18.2</Tag>
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
      <Button type="submit" size="lg">
        <LockKeyhole aria-hidden />
        Sign in
      </Button>
    </SignIn>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    // The scripted click focuses the button as if from a keyboard; a pointer press leaves no ring.
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
    const sheet = canvasElement.querySelector(".di-login")!;
    await expect(sheet.getBoundingClientRect().height).toBeGreaterThanOrEqual(window.innerHeight);
    await expect(getComputedStyle(document.documentElement).backgroundColor).toBe(
      getComputedStyle(sheet).backgroundColor,
    );
    const [kicker, first] = [...canvasElement.querySelectorAll(".di-login-foot > li")];
    await expect(first.getBoundingClientRect().top).toBe(kicker.getBoundingClientRect().top);
  },
};

/** A rejected key. The error is on the field that caused it. */
export const Rejected: Story = {
  render: (args) => (
    <SignIn {...args}>
      <SignInVersion>
        <Tag mono>v4.18.2</Tag>
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
      <Button type="submit" size="lg">
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
        <Tag mono>v4.18.2</Tag>
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
      <Button type="submit" size="lg" loading={true}>
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
        <Tag mono>v4.18.2</Tag>
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
      <Button type="submit" size="lg">
        <LockKeyhole aria-hidden />
        Confirm
      </Button>
    </SignIn>
  ),
};

/**
 * After the key: choosing where to go. The card resolves its tokens from the
 * theme around it, so a fact list and a table inside it follow the theme with
 * nothing pinned by hand. The table keeps to the card's content edge like the
 * line above it and the button below it: one left edge for the whole card.
 */
export const WithPanelAndTable: Story = {
  name: "Choosing a workspace",
  args: { title: "Choose a workspace", lede: "Your account opens two workspaces." },
  render: (args) => (
    <SignIn {...args}>
      <FactList layout="pairs">
        <Fact label="Last sign-in">Yesterday, 18:04, from Vienna</Fact>
      </FactList>
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
      <Button type="submit" size="lg">
        Open Production
      </Button>
    </SignIn>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector(".di-login-card") as HTMLElement;
    await expect(getComputedStyle(card).backgroundColor).not.toBe(
      getComputedStyle(canvasElement.querySelector(".di-login")!).backgroundColor,
    );
    await expect(getComputedStyle(card).getPropertyValue("--di-bg-surface")).toBe(
      getComputedStyle(canvasElement).getPropertyValue("--di-bg-surface"),
    );
    const box = (selector: string) => card.querySelector(selector)!.getBoundingClientRect();
    const edge = box(".di-eyebrow").left;
    for (const part of [".di-fact-label", ".di-table-wrap", "thead tr", ".di-btn"])
      await expect(Math.abs(box(part).left - edge)).toBeLessThan(1);
    await expect(Math.abs(box(".di-table-wrap").right - box(".di-btn").right)).toBeLessThan(1);
  },
};

/**
 * After dark: the navy ground (#0A1F44), a navy surface card one step up and
 * the paper-white button, because navy cannot act on navy. This is the dark
 * look of the hosted login.
 */
export const AfterDark: Story = {
  name: "After dark",
  globals: { theme: "dark" },
  render: (args) => Default.render!(args, {} as never),
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Sign in" });
    // The fill eases from the theme of the story before; read it where it lands.
    await Promise.all(button.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
    const fill = getComputedStyle(button).backgroundColor;
    await expect(fill).not.toBe(getComputedStyle(canvasElement.querySelector(".di-login")!).backgroundColor);
    await expect(getComputedStyle(canvasElement.querySelector(".di-login")!).backgroundColor).toBe("rgb(10, 31, 68)");
  },
};

/** German, at a phone's width: the longer words wrap inside the card. */
export const German: Story = {
  args: {
    kicker: "datAInsights",
    eyebrow: "Versiegelter Arbeitsbereich",
    title: "Anmelden",
    lede: "Das Register öffnet sich, sobald Ihr Schlüssel bestätigt ist.",
    restriction: "Der Zugang ist auf berechtigte Bedienerinnen und Bediener beschränkt.",
    foot: "SSO und Zwei-Faktor · Ende-zu-Ende-verschlüsselt",
  },
  render: (args) => (
    <SignIn {...args}>
      <TextField id="login-user-de" label="E-Mail-Adresse oder Benutzername" autoComplete="username" />
      <TextField id="login-password-de" label="Passwort" type="password" autoComplete="current-password">
        <TextLink quiet={true}>Passwort vergessen?</TextLink>
      </TextField>
      <Button type="submit" size="lg">
        <LockKeyhole aria-hidden />
        Anmelden
      </Button>
    </SignIn>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument.documentElement;
    await expect(doc.scrollWidth).toBeLessThanOrEqual(doc.clientWidth);
  },
};
