import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginScreen } from "./Login";

const meta = {
  title: "Screens/Login",
  component: LoginScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LoginScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};
