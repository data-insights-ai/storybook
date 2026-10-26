import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Gauge, LogOut, UserRound } from "lucide-react";
import { AppShellContent } from "./AppShell";
import { PageHeader, PageHeaderTitle } from "./Heading";
import { Panel } from "./Panel";
import { Sidebar } from "./Sidebar";
import { SidebarInset } from "./SidebarInset";
import { SidebarMenu, SidebarMenuItem } from "./SidebarMenu";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarContent, SidebarFooter } from "./SidebarSections";
import { SidebarThemeChoice, themeLabels } from "./SidebarThemeChoice";
import { ThemeProvider, useTheme, type ThemeChoice } from "./Theme";

function Shown() {
  const { choice, resolved } = useTheme();
  return (
    <Panel>
      <p>
        Chosen: {choice}. Showing: {resolved}.
      </p>
    </Panel>
  );
}

/** The app keeps the choice (the person's preference) and hands it to the provider. */
function Sample({ initial, language }: { initial: ThemeChoice; language: keyof typeof themeLabels }) {
  const [theme, setTheme] = useState<ThemeChoice>(initial);
  return (
    <ThemeProvider value={theme}>
      <SidebarProvider skipLabel="Skip to content">
        <Sidebar label="Navigation" closeLabel="Close navigation">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label="Overview" active>
                  <Gauge />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label="Nora Feld">
                  <UserRound />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarThemeChoice value={theme} onChange={setTheme} labels={themeLabels[language]} />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Sign out">
                  <LogOut />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppShellContent>
            <PageHeader>
              <PageHeaderTitle>Overview</PageHeaderTitle>
            </PageHeader>
            <Shown />
          </AppShellContent>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

const meta = {
  title: "Patterns/Theme",
  component: Sample,
  parameters: { layout: "fullscreen" },
  args: { initial: "auto", language: "en" },
} satisfies Meta<typeof Sample>;

export default meta;
type Story = StoryObj<typeof meta>;

// Storybook's own theme toolbar writes the root once a story mounts, so a
// story reads the root only after a change of its own.
const root = () => document.documentElement.getAttribute("data-theme");

/** Auto follows the device; Light and Dark hold whatever the device says. */
export const Choice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const device = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    await expect(canvas.getByText(`Chosen: auto. Showing: ${device}.`)).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Theme: Auto" }));
    await userEvent.click(within(document.body).getByRole("menuitemradio", { name: "Dark" }));
    await waitFor(() => expect(root()).toBe("dark"));
    await expect(canvas.getByText("Chosen: dark. Showing: dark.")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Theme: Dark" }));
    await expect(within(document.body).getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(within(document.body).getByRole("menuitemradio", { name: "Light" }));
    await waitFor(() => expect(root()).toBe("light"));
  },
};

/** The words come with the control in the apps' three languages. */
export const German: Story = {
  args: { initial: "dark", language: "de" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Chosen: dark. Showing: dark.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Darstellung: Dunkel" }));
    await waitFor(() => expect(within(document.body).getByRole("menuitemradio", { name: "Automatisch" })).toBeVisible());
  },
};
