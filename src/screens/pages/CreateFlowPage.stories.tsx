import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { CreateFlowPageScreen } from "./CreateFlowPage";

const meta = {
  title: "Patterns/Create flow",
  tags: ["layer:screen", "!autodocs"],
  component: CreateFlowPageScreen,
  parameters: { layout: "fullscreen" },
  args: { step: 0, filled: false, failed: false },
  decorators: [
    (Story) => (
      <ProductShell area="organization" active="signin" crumbs={["Example Security GmbH", "Sign-in", "New connection"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof CreateFlowPageScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The first step: the three kinds as cards, one chosen; the steps above say where the reader is. */
export const NewConnection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Choose a type" })).toBeVisible();
    await expect(canvas.getByRole("radio", { name: /OpenID Connect/ })).toBeChecked();
  },
};

/** The details: Next waits until both fields are filled, and the flow starts in the first field. */
export const Details: Story = {
  args: { step: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });
    await userEvent.click(next);
    await expect(canvas.getByRole("heading", { name: "Details" })).toBeVisible();
    await userEvent.type(canvas.getByRole("textbox", { name: "Name" }), "Northwind staff");
    await userEvent.type(canvas.getByRole("textbox", { name: "Issuer URL" }), "https://login.northwind.example");
    await userEvent.click(next);
    await expect(canvas.getByRole("heading", { name: "Review" })).toBeVisible();
    const now = canvasElement.querySelector<HTMLElement>(".di-steps-now")!;
    await expect(now.querySelector(".di-steps-now-position")).toHaveTextContent("3/3");
    await expect(now.querySelector(".di-steps-now-title")).toHaveTextContent("Review");
    if (window.innerWidth <= 600) await expect(now).toBeVisible();
    else await expect(now).not.toBeVisible();
  },
};

/** Create failed: the reason sits above the buttons, nothing typed is lost, and Create can be pressed again. */
export const CreateFailed: Story = {
  name: "Create failed",
  args: { step: 2, filled: true, failed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("did not answer");
    await expect(canvasElement.textContent).toContain("https://login.northwind.example");
    await expect(canvas.getByRole("button", { name: "Create connection" })).toBeEnabled();
  },
};
