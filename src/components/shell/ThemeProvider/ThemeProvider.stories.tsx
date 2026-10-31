import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Gauge, LogOut, UserRound } from "lucide-react";
import { AppShellBar } from "../AppShellBar";
import { AppShellContent } from "../AppShellContent";
import { Fact, FactList } from "../../records/FactList";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Panel } from "../../layout/page/Panel";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarThemeChoice,
  SidebarTrigger,
  themeLabels,
} from "../../navigation/Sidebar";
import { ThemeProvider, useTheme, type ThemeChoice } from "./ThemeProvider";

const words = {
  en: {
    skip: "Skip to content",
    navigation: "Navigation",
    close: "Close navigation",
    toggle: "Toggle navigation",
    overview: "Overview",
    signOut: "Sign out",
    appearance: "Appearance",
    choice: "Your choice",
    showing: "Showing",
  },
  de: {
    skip: "Zum Inhalt springen",
    navigation: "Navigation",
    close: "Navigation schließen",
    toggle: "Navigation ein- oder ausblenden",
    overview: "Übersicht",
    signOut: "Abmelden",
    appearance: "Darstellung",
    choice: "Ihre Wahl",
    showing: "Angezeigt",
  },
  es: {
    skip: "Ir al contenido",
    navigation: "Navegación",
    close: "Cerrar la navegación",
    toggle: "Mostrar u ocultar la navegación",
    overview: "Resumen",
    signOut: "Cerrar sesión",
    appearance: "Apariencia",
    choice: "Su elección",
    showing: "Se muestra",
  },
} satisfies Record<keyof typeof themeLabels, Record<string, string>>;

function Shown({ language }: { language: keyof typeof themeLabels }) {
  const { choice, resolved } = useTheme();
  const t = words[language];
  return (
    <Panel title={t.appearance} heading={2}>
      <FactList layout="pairs">
        <Fact label={t.choice}>{choice}</Fact>
        <Fact label={t.showing}>{resolved}</Fact>
      </FactList>
    </Panel>
  );
}

/** The app keeps the choice (the person's preference) and hands it to the provider. */
function Sample({ initial, language }: { initial: ThemeChoice; language: keyof typeof themeLabels }) {
  const [theme, setTheme] = useState<ThemeChoice>(initial);
  const t = words[language];
  return (
    <ThemeProvider value={theme}>
      <SidebarProvider skipLabel={t.skip}>
        <Sidebar label={t.navigation} closeLabel={t.close}>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label={t.overview} active>
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
                <SidebarMenuButton label={t.signOut}>
                  <LogOut />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppShellBar>
            <SidebarTrigger label={t.toggle} />
            <span>{t.overview}</span>
          </AppShellBar>
          <AppShellContent>
            <PageHeader>
              <PageHeaderTitle>{t.overview}</PageHeaderTitle>
            </PageHeader>
            <Shown language={language} />
          </AppShellContent>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

type SampleArgs = ComponentProps<typeof ThemeProvider> & { language: keyof typeof themeLabels };

const meta = {
  title: "Shell/ThemeProvider",
  tags: ["layer:pattern", "autodocs"],
  component: ThemeProvider,
  parameters: { layout: "fullscreen" },
  args: { value: "auto", language: "en", children: null },
  argTypes: { value: { control: "radio", options: ["auto", "light", "dark"] }, children: { control: false } },
  render: ({ value = "auto", language }) => <Sample initial={value} language={language} />,
} satisfies Meta<SampleArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Storybook's own theme toolbar writes the root once a story mounts, so a
// story reads the root only after a change of its own.
const root = () => document.documentElement.getAttribute("data-theme");
const shown = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll("dd"))
    .map((dd) => dd.textContent)
    .join(" ");

/** Auto follows the device; Light and Dark hold whatever the device says. */
export const Choice: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const device = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    await expect(shown(canvasElement)).toBe(`auto ${device}`);

    await userEvent.click(canvas.getByRole("button", { name: "Theme: Auto" }));
    await userEvent.click(within(document.body).getByRole("menuitemradio", { name: "Dark" }));
    await waitFor(() => expect(root()).toBe("dark"));
    await expect(shown(canvasElement)).toBe("dark dark");

    await userEvent.click(canvas.getByRole("button", { name: "Theme: Dark" }));
    await expect(within(document.body).getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.click(within(document.body).getByRole("menuitemradio", { name: "Light" }));
    await waitFor(() => expect(root()).toBe("light"));

    // End on the toolbar's theme, so the accessibility check reads the sheet the run is for.
    if (globals.theme === "dark") {
      await userEvent.click(canvas.getByRole("button", { name: "Theme: Light" }));
      await userEvent.click(within(document.body).getByRole("menuitemradio", { name: "Dark" }));
      await waitFor(() => expect(root()).toBe("dark"));
    }
  },
};

/** The words come with the control in the apps' three languages; the rest of the page is the product's, here in German too. */
export const German: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: { value: "dark", language: "de" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(shown(canvasElement)).toBe("dark dark");
    await expect(canvas.getByRole("heading", { level: 1, name: "Übersicht" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Zum Inhalt springen" })).toBeInTheDocument();
    await expect(canvasElement.textContent).not.toMatch(/Overview|Sign out|Appearance|Your choice/);
    await userEvent.click(canvas.getByRole("button", { name: "Darstellung: Dunkel" }));
    await waitFor(() =>
      expect(within(document.body).getByRole("menuitemradio", { name: "Automatisch" })).toBeVisible(),
    );
  },
};
