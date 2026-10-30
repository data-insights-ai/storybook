import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConsoleFrame } from "../../.storybook/Console";
import { LoginScreen } from "./Login";

const meta = {
  title: "Screens/Login",
  tags: ["layer:screen"],
  component: LoginScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ConsoleFrame title="Sign in" lang="en">
        <Story />
      </ConsoleFrame>
    ),
  ],
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};
