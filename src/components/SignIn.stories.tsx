import type { Meta, StoryObj } from "@storybook/react-vite";
import { LockKeyhole } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";
import { SignIn } from "./SignIn";
import { TextField } from "./TextField";
import { TextLink } from "./TextLink";

const meta = {
  title: "Blocks/SignIn",
  component: SignIn,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    kicker: "datAInsights",
    version: "v4.18.2",
    eyebrow: "Sealed workspace",
    title: "Sign in",
    lede: "The register opens once the key is verified.",
    restriction: "access restricted to authorised operators",
    foot: "SSO and 2FA · end-to-end encrypted",
    onSubmit: fn(),
    children: null,
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    kicker: { control: "text" },
    version: { control: "text" },
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
  },
};

/** A rejected key. The error is on the field that caused it. */
export const Rejected: Story = {
  render: (args) => (
    <SignIn {...args}>
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
        error="That key was not accepted. Two attempts remain."
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
