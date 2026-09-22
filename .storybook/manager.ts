import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "datAInsights",
    brandUrl: "https://www.data-insights.ai",
    brandImage: "./mark.svg",
    colorPrimary: "#0a1f44",
    colorSecondary: "#7c5f17",
    appBg: "#f7f4ec",
    appContentBg: "#fbf8f1",
    appBorderColor: "#e0dbd1",
    textColor: "#0e1528",
    textMutedColor: "#5a5348",
    barBg: "#fbf8f1",
    barTextColor: "#5a5348",
    barSelectedColor: "#0a1f44",
  }),
});
