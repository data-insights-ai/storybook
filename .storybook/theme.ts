import { create } from "storybook/theming";

export type Mode = "light" | "dark";

/** Direction A, as the library's tokens resolve it; the manager cannot read CSS custom properties. */
export const palette = {
  light: {
    chrome: "#E9E8E3",
    ground: "#F3F2EE",
    surface: "#FDFDFB",
    raised: "#FFFFFF",
    hover: "#EAE9E4",
    text: "#0A1F44",
    muted: "#3D4A66",
    subtle: "#556076",
    border: "rgba(10, 31, 68, 0.1)",
    input: "rgba(10, 31, 68, 0.18)",
    select: "#2B6CB0",
    fill: "#0A1F44",
    onFill: "#FFFFFF",
    mark: "./mark.svg",
  },
  dark: {
    chrome: "#071733",
    ground: "#0A1F44",
    surface: "#0F2A57",
    raised: "#133068",
    hover: "#0F2A57",
    text: "#F2F0E6",
    muted: "#C9D2E6",
    subtle: "#A8B6D2",
    border: "rgba(168, 182, 210, 0.16)",
    input: "rgba(168, 182, 210, 0.28)",
    select: "#79AEEA",
    fill: "#F2F0E6",
    onFill: "#0A1F44",
    mark: "./mark-inverse.svg",
  },
} as const;

const fonts = {
  fontBase: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"IBM Plex Mono", ui-monospace, monospace',
};

export function brandTheme(mode: Mode) {
  const c = palette[mode];
  return create({
    base: mode,
    brandTitle: "datAInsights",
    brandUrl: "https://www.data-insights.ai",
    brandImage: c.mark,
    brandTarget: "_blank",
    ...fonts,
    colorPrimary: c.fill,
    colorSecondary: c.select,
    appBg: c.chrome,
    appContentBg: c.surface,
    appPreviewBg: c.ground,
    appHoverBg: c.hover,
    appBorderColor: c.border,
    appBorderRadius: 6,
    textColor: c.text,
    textInverseColor: c.onFill,
    textMutedColor: c.muted,
    barBg: c.ground,
    barTextColor: c.muted,
    barHoverColor: c.text,
    barSelectedColor: c.select,
    buttonBg: c.surface,
    buttonBorder: c.input,
    booleanBg: c.chrome,
    booleanSelectedBg: c.raised,
    inputBg: c.surface,
    inputBorder: c.input,
    inputTextColor: c.text,
    inputBorderRadius: 4,
  });
}

/** The toolbar's theme when someone picked one, otherwise the system's. */
export function resolveMode(global: unknown): Mode {
  if (global === "light" || global === "dark") return global;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
