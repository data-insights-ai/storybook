import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TextLink } from "../../../text/TextLink";
import { LoadError } from "./LoadError";

const labels = {
  retry: "Try again",
  retryAfter: (seconds: number) => `You can try again in ${seconds} s.`,
  copyReference: "Copy the reference",
  copied: "Copied",
};

const meta = {
  title: "Feedback/Recovery/LoadError",
  component: LoadError,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "The sources could not be read",
    body: "The server did not answer in time. Your data is safe.",
    reference: "req-7f3a99e0c1d2",
    onRetry: fn(),
    labels,
  },
} satisfies Meta<typeof LoadError>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A failure in plain words, a reference for support and a way to try again. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

/** A rate limit: Try again waits out the time the server asked for, and says how long. */
export const RateLimited: Story = {
  args: {
    title: "Too many requests",
    body: "This organization used its requests for the minute.",
    note: "Allowance: 600 requests a minute",
    reference: undefined,
    retryAt: new Date(Date.now() + 30_000),
    children: <TextLink href="#usage">See usage</TextLink>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Try again" })).toBeDisabled();
    await expect(canvas.getByRole("status")).toHaveTextContent(/try again in \d+ s/);
  },
};
