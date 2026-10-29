import { useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Menu, MenuGroup, MenuItem } from "../Menu";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { themeChoices, type ThemeChoice } from "../../shell/ThemeProvider";

export type ThemeLabels = {
  /** Names the choice: the menu and, with the current value, the item. */
  theme: string;
  auto: string;
  light: string;
  dark: string;
};

/** The control's words in the languages the apps speak; pick by the person's language. */
export const themeLabels = {
  en: { theme: "Theme", auto: "Auto", light: "Light", dark: "Dark" },
  de: { theme: "Darstellung", auto: "Automatisch", light: "Hell", dark: "Dunkel" },
  es: { theme: "Tema", auto: "Automático", light: "Claro", dark: "Oscuro" },
} satisfies Record<string, ThemeLabels>;

const icons = { auto: SunMoon, light: Sun, dark: Moon } satisfies Record<ThemeChoice, unknown>;

/**
 * The person's theme in the sidebar's footer, beside their name and sign-out:
 * an item that names the current choice and opens the three. The app keeps
 * the value (`ThemeProvider` shows it) and stores a change as the person's
 * preference.
 */
export function SidebarThemeChoice({
  value,
  onChange,
  labels = themeLabels.en,
}: {
  value: ThemeChoice;
  onChange: (value: ThemeChoice) => void;
  labels?: ThemeLabels;
}) {
  const [open, setOpen] = useState(false);
  const Icon = icons[value];
  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      label={labels.theme}
      align="start"
      trigger={(props) => (
        <SidebarMenuButton label={`${labels.theme}: ${labels[value]}`} menu {...props}>
          <Icon />
        </SidebarMenuButton>
      )}
    >
      <MenuGroup label={labels.theme}>
        {themeChoices.map((choice) => (
          <MenuItem
            key={choice}
            checked={choice === value}
            onSelect={() => {
              setOpen(false);
              onChange(choice);
            }}
          >
            {labels[choice]}
          </MenuItem>
        ))}
      </MenuGroup>
    </Menu>
  );
}
