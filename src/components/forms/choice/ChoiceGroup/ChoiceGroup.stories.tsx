import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cloud, Database, FileText, Info, Mail, MessageSquare, Server, Shield, Webhook } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Notice, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../../../feedback/Notice";
import { Stack } from "../../../layout/arrangement/Stack";
import { Toolbar, ToolbarEnd } from "../../../layout/arrangement/Toolbar";
import { PageHeader, PageHeaderTitle } from "../../../layout/page/PageHeader";
import { Panel } from "../../../layout/page/Panel";
import { TimeField } from "../../dates/TimeField";
import { SearchField } from "../../text/SearchField";
import { ChoiceGroup, type ChoiceOption } from "./ChoiceGroup";
import { ChoiceCards, SegmentedControl, ToggleGroup } from "./deprecated";

const meta = {
  title: "Forms/Choice/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["layer:form", "autodocs"],
} satisfies Meta<typeof ChoiceGroup>;

export default meta;
type Story = StoryObj;

/** A play ends with nothing focused, so the story rests in the state it names. */
const rest = () => (document.activeElement as HTMLElement | null)?.blur();

const column = (width: number) => ({ maxWidth: width });

const retention: ChoiceOption[] = [
  { value: "30d", label: "30 days", description: "The default for a new workspace." },
  { value: "1y", label: "1 year" },
  { value: "forever", label: "Indefinite", description: "Requires an audit key." },
];

/** A list of radios in a settings panel: one tab stop, arrow keys move and choose. */
export const InAForm: Story = {
  name: "In a form",
  render: function Render() {
    const [value, setValue] = useState("30d");
    return (
      <div style={column(560)}>
        <Panel title="Retention" heading={2}>
          <ChoiceGroup
            legend="Keep events for"
            name="retention"
            options={retention}
            value={value}
            onChange={setValue}
          />
        </Panel>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("radio", { name: "30 days" });
    await expect(canvas.getByRole("group", { name: "Keep events for" })).toBeVisible();
    await expect(first).toBeChecked();
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "1 year" })).toBeChecked();
    rest();
  },
};

/** Several of a list: checkboxes in the same markup, each its own tab stop. */
export const Several: Story = {
  render: function Render() {
    const [value, setValue] = useState(["opened"]);
    return (
      <div style={column(560)}>
        <Panel title="Email me" heading={2}>
          <ChoiceGroup
            legend="Notify on"
            name="notify"
            multiple
            options={[
              { value: "opened", label: "A case is opened" },
              { value: "assigned", label: "A case is assigned to me", description: "Also when someone hands it on." },
              { value: "resolved", label: "A case is resolved" },
            ]}
            value={value}
            onChange={setValue}
          />
        </Panel>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "A case is resolved" }));
    await expect(canvas.getByRole("checkbox", { name: "A case is opened" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "A case is resolved" })).toBeChecked();
    rest();
  },
};

/**
 * Two to four views of the same list in a toolbar. The choice commits as it
 * moves; the place names it, so the legend is for assistive technology only.
 * The row is a field high, so it lines up with the search and the button.
 */
export const InAToolbar: Story = {
  name: "Segments in a toolbar",
  render: function Render() {
    const [value, setValue] = useState("24h");
    return (
      <Toolbar>
        <SearchField label="Search events" placeholder="Search events" />
        <ChoiceGroup
          appearance="segments"
          hideLegend
          legend="Window"
          name="window"
          options={[
            { value: "1h", label: "1h" },
            { value: "24h", label: "24h" },
            { value: "7d", label: "7d" },
            { value: "30d", label: "30d" },
          ]}
          value={value}
          onChange={setValue}
        />
        <ToolbarEnd>
          <Button>Export</Button>
        </ToolbarEnd>
      </Toolbar>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: "24h" })).toBeChecked();
    await userEvent.click(canvas.getByText("7d"));
    await expect(canvas.getByRole("radio", { name: "7d" })).toBeChecked();
    rest();
    const track = canvasElement.querySelector(".di-choice-segments")!.getBoundingClientRect();
    const button = canvas.getByRole("button", { name: "Export" }).getBoundingClientRect();
    await expect(Math.round(track.height)).toBe(Math.round(button.height));
  },
};

const days: ChoiceOption[] = [
  { value: "mon", label: "Mo", name: "Monday" },
  { value: "tue", label: "Tu", name: "Tuesday" },
  { value: "wed", label: "We", name: "Wednesday" },
  { value: "thu", label: "Th", name: "Thursday" },
  { value: "fri", label: "Fr", name: "Friday" },
  { value: "sat", label: "Sa", name: "Saturday" },
  { value: "sun", label: "Su", name: "Sunday" },
];

const tage: ChoiceOption[] = [
  { value: "mon", label: "Mo", name: "Montag" },
  { value: "tue", label: "Di", name: "Dienstag" },
  { value: "wed", label: "Mi", name: "Mittwoch" },
  { value: "thu", label: "Do", name: "Donnerstag" },
  { value: "fri", label: "Fr", name: "Freitag" },
  { value: "sat", label: "Sa", name: "Samstag" },
  { value: "sun", label: "So", name: "Sonntag" },
];

type QuietText = { title: string; days: string; from: string; to: string; hint: string };

function QuietHours({ options, text, locale }: { options: ChoiceOption[]; text: QuietText; locale?: string }) {
  const [value, setValue] = useState(["mon", "tue", "wed", "thu", "fri"]);
  const [from, setFrom] = useState("22:00");
  const [to, setTo] = useState("06:30");
  const time = { flex: "0 1 11rem", minWidth: "9rem" } as const;
  return (
    <div style={{ maxWidth: "36rem" }}>
      <Panel title={text.title}>
        <Stack gap={16}>
          <ChoiceGroup
            appearance="toggles"
            multiple
            legend={text.days}
            name="quiet-days"
            options={options}
            value={value}
            onChange={setValue}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--di-gap-16)" }}>
            <div style={time}>
              <TimeField id="quiet-from" label={text.from} locale={locale} value={from} onChange={setFrom} />
            </div>
            <div style={time}>
              <TimeField id="quiet-to" label={text.to} locale={locale} value={to} onChange={setTo} hint={text.hint} />
            </div>
          </div>
        </Stack>
      </Panel>
    </div>
  );
}

const luminance = (colour: string) => {
  const [r, g, b] = (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map((c) => {
    const v = Number(c) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const ground = (element: Element | null): string => {
  for (let at = element; at; at = at.parentElement) {
    const bg = getComputedStyle(at).backgroundColor;
    if (bg !== "transparent" && !bg.endsWith(", 0)")) return bg;
  }
  return "rgb(255, 255, 255)";
};

/** Equal cells, one outline each; chosen and not chosen apart by at least 3:1 at the edge and 4.5:1 in the text. */
const measureDays = async (canvasElement: HTMLElement) => {
  const cells = [...canvasElement.querySelectorAll<HTMLElement>(".di-choice-toggle")];
  const widths = new Set(cells.map((c) => Math.round(c.getBoundingClientRect().width)));
  await expect([...widths]).toHaveLength(1);
  const behind = ground(cells[0].parentElement);
  for (const cell of cells) {
    const style = getComputedStyle(cell);
    await expect(style.boxShadow).toBe("none");
    const fill = style.backgroundColor;
    await expect(contrast(style.color, fill)).toBeGreaterThanOrEqual(4.5);
    const edge = cell.classList.contains("is-chosen") ? fill : style.borderTopColor;
    await expect(contrast(edge, behind)).toBeGreaterThanOrEqual(3);
  }
  const on = getComputedStyle(cells.find((c) => c.classList.contains("is-chosen"))!).backgroundColor;
  const off = getComputedStyle(cells.find((c) => !c.classList.contains("is-chosen"))!).backgroundColor;
  await expect(contrast(on, off)).toBeGreaterThanOrEqual(3);
  const row = cells[0].parentElement!.getBoundingClientRect();
  const field = canvasElement.querySelector("#quiet-from")!.getBoundingClientRect();
  await expect(Math.round(row.left)).toBe(Math.round(field.left));
  await expect(Math.round(cells[0].getBoundingClientRect().height)).toBe(Math.round(field.height));
};

/**
 * Several days of a week: `toggles`, a row of separate, equal cells in the
 * field frame, each chosen day filled. The days take their own row; the two
 * times of the window sit under them, side by side at a time's width, and
 * stack on a phone.
 */
export const Weekdays: Story = {
  render: () => (
    <QuietHours
      options={days}
      text={{ title: "Quiet hours", days: "Quiet on", from: "From", to: "To", hint: "Ends the next morning." }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Quiet on" })).toBeVisible();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Saturday" }));
    await expect(canvas.getByRole("checkbox", { name: "Saturday" })).toBeChecked();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Saturday" }));
    await expect(canvas.getByRole("checkbox", { name: "Saturday" })).not.toBeChecked();
    rest();
    await measureDays(canvasElement);
  },
};

/** German day names, and the 24-hour clock German writes. */
export const WeekdaysGerman: Story = {
  name: "Weekdays, German",
  render: () => (
    <QuietHours
      options={tage}
      locale="de-DE"
      text={{
        title: "Ruhezeiten",
        days: "Ruhezeit an diesen Tagen",
        from: "Von",
        to: "Bis",
        hint: "Endet am nächsten Morgen.",
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("checkbox", { name: "Sonntag" })).not.toBeChecked();
    await measureDays(canvasElement);
  },
};

/** In a compact region the cells and the time fields shrink together and stay aligned. */
export const WeekdaysCompact: Story = {
  name: "Weekdays, compact",
  render: () => (
    <div data-density="compact">
      <QuietHours
        options={days}
        text={{ title: "Quiet hours", days: "Quiet on", from: "From", to: "To", hint: "Ends the next morning." }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await measureDays(canvasElement);
  },
};

const sources: ChoiceOption[] = [
  {
    value: "defender",
    label: "Microsoft Defender XDR",
    description: "Incidents and alerts as they happen.",
    icon: <Shield />,
  },
  { value: "hub", label: "Azure Event Hub", description: "Streaming API and diagnostic settings.", icon: <Cloud /> },
  { value: "file", label: "File drop", description: "Exports uploaded by hand.", icon: <FileText /> },
];

const planned = {
  label: "Coming later",
  lede: "Planned sources, not available yet.",
  options: [
    { value: "syslog", label: "Syslog", icon: <Server /> },
    { value: "s3", label: "Object storage", icon: <Database /> },
    { value: "mail", label: "Mail gateway", icon: <Mail /> },
    { value: "chat", label: "Chat audit log", icon: <MessageSquare /> },
    { value: "hook", label: "Generic webhook", icon: <Webhook /> },
  ],
};

const guides: Record<string, string> = {
  defender: "Register an app in the tenant, grant it Security Reader, and paste its client id in the next step.",
  hub: "Create a consumer group for this workspace on the hub, then paste its connection string in the next step.",
  file: "Upload one export now; each later file goes through the same drop.",
};

/**
 * The first step of a create flow: the kind to start from as cards, what
 * the chosen kind asks of the reader next in the detail slot, and the kinds
 * that cannot be chosen yet after it. The planned tiles are a list, not
 * radios, so Tab and the arrow keys pass them by.
 */
export const Cards: Story = {
  name: "Cards in a create flow",
  render: function Render() {
    const [value, setValue] = useState("hub");
    return (
      <ChoiceGroup
        appearance="cards"
        legend="Source type"
        name="source"
        options={sources}
        value={value}
        onChange={setValue}
        planned={planned}
      >
        <Notice>
          <NoticeIcon>
            <Info />
          </NoticeIcon>
          <NoticeText>
            <div>
              <NoticeTitle>Before you continue</NoticeTitle>
              <NoticeBody>{guides[value]}</NoticeBody>
            </div>
          </NoticeText>
        </Notice>
      </ChoiceGroup>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", { name: "Coming later" });
    await expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
    await expect(canvas.getByRole("radio", { name: /Event Hub/ })).toBeChecked();
    const guide = canvas.getByText("Before you continue").getBoundingClientRect();
    const card = canvas
      .getByRole("radio", { name: /File drop/ })
      .closest("label")!
      .getBoundingClientRect();
    await expect(guide.top).toBeGreaterThan(card.bottom);
    await expect(list.getBoundingClientRect().top).toBeGreaterThan(guide.bottom);
    await userEvent.click(canvas.getByText("File drop"));
    await expect(canvas.getByText(/Upload one export now/)).toBeVisible();
    rest();
  },
};

/** Cards under group headings; the rest of a description in a tooltip; the legend hidden under a heading that names the choice. */
export const GroupedCards: Story = {
  name: "Grouped cards",
  render: function Render() {
    const [value, setValue] = useState("defender");
    return (
      <Stack gap={16}>
        <PageHeader lede="Where this workspace reads its events from.">
          <PageHeaderTitle level={2}>Choose a source</PageHeaderTitle>
        </PageHeader>
        <ChoiceGroup
          appearance="cards"
          legend="Source type"
          hideLegend
          name="source-grouped"
          options={[
            {
              value: "defender",
              label: "Microsoft Defender XDR",
              description: "Incidents and alerts as they happen.",
              more: "Every Defender product and Sentinel, with each update.",
              group: "Recommended for Microsoft",
            },
            {
              value: "entra",
              label: "Microsoft Entra ID",
              description: "Sign-in and audit logs.",
              group: "Recommended for Microsoft",
            },
            {
              value: "hub",
              label: "Azure Event Hub",
              description: "Streaming API and diagnostic settings.",
              group: "Azure",
            },
            {
              value: "activity",
              label: "Azure activity log",
              description: "Control-plane operations of one subscription.",
              group: "Azure",
            },
            { value: "file", label: "File drop", description: "Exports uploaded by hand.", group: "Other" },
          ]}
          value={value}
          onChange={setValue}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Recommended for Microsoft")).toBeVisible();
    await expect(canvas.getByRole("radio", { name: /Defender/ })).toBeChecked();
  },
};

/**
 * Locked: the whole group (a setting the plan does not include), or one
 * option. The chosen one keeps its edge, so what is set still reads.
 */
export const Disabled: Story = {
  render: () => (
    <Stack gap={24}>
      <ChoiceGroup
        appearance="segments"
        legend="Row density"
        name="density-locked"
        disabled
        options={[
          { value: "comfortable", label: "Comfortable" },
          { value: "compact", label: "Compact" },
        ]}
        value="compact"
        onChange={() => undefined}
      />
      <ChoiceGroup
        appearance="toggles"
        multiple
        legend="Quiet on"
        name="days-locked"
        disabled
        options={days}
        value={["sat", "sun"]}
        onChange={() => undefined}
      />
      <div style={column(560)}>
        <ChoiceGroup
          legend="Keep events for"
          name="retention-one-locked"
          options={retention.map((o) => (o.value === "forever" ? { ...o, disabled: true } : o))}
          value="1y"
          onChange={() => undefined}
        />
      </div>
      <ChoiceGroup
        appearance="cards"
        legend="Source type"
        name="source-locked"
        options={sources.map((o) => (o.value === "file" ? { ...o, disabled: true } : o))}
        value="defender"
        onChange={() => undefined}
      />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: "Compact" })).toBeDisabled();
    await expect(canvas.getByRole("radio", { name: "Indefinite" })).toBeDisabled();
    await expect(canvas.getByRole("radio", { name: "1 year" })).toBeEnabled();
    await expect(canvas.getByRole("radio", { name: /File drop/ })).toBeDisabled();
  },
};

/** German labels run long: segments wrap inside their container, card labels wrap, nothing runs off a phone. */
export const German: Story = {
  render: function Render() {
    const [view, setView] = useState("offen");
    const [kind, setKind] = useState("ereignis");
    const [keep, setKeep] = useState("jahr");
    return (
      <Stack gap={24}>
        <ChoiceGroup
          appearance="segments"
          legend="Anzeige"
          name="anzeige"
          options={[
            { value: "offen", label: "Offene Fälle" },
            { value: "zugewiesen", label: "Mir zugewiesen" },
            { value: "alle", label: "Alle Fälle einschließlich abgeschlossener" },
          ]}
          value={view}
          onChange={setView}
        />
        <div style={column(560)}>
          <ChoiceGroup
            legend="Aufbewahrungsdauer der Ereignisdaten im Arbeitsbereich"
            name="aufbewahrung"
            options={[
              { value: "monat", label: "30 Tage", description: "Die Voreinstellung für einen neuen Arbeitsbereich." },
              { value: "jahr", label: "1 Jahr" },
              {
                value: "immer",
                label: "Unbegrenzt",
                description: "Erfordert einen Prüfschlüssel der Revisionsabteilung.",
              },
            ]}
            value={keep}
            onChange={setKeep}
          />
        </div>
        <ChoiceGroup
          appearance="cards"
          legend="Quelltyp"
          name="quelltyp"
          options={[
            {
              value: "ereignis",
              label: "Azure-Ereignis-Hub mit Diagnoseeinstellungen",
              description: "Streaming-Schnittstelle und Diagnoseeinstellungen des Abonnements.",
              icon: <Cloud />,
            },
            {
              value: "datei",
              label: "Dateiablage",
              description: "Von Hand hochgeladene Exporte.",
              icon: <FileText />,
            },
          ]}
          value={kind}
          onChange={setKind}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(".di-choice-segments")!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth + 1);
  },
};

/**
 * SegmentedControl, ToggleGroup and ChoiceCards are deprecated (removed in
 * 0.12) and render this component: each here draws the same chosen look as
 * the ChoiceGroup calls above.
 */
export const DeprecatedNames: Story = {
  name: "Deprecated names",
  render: function Render() {
    const [view, setView] = useState("open");
    const [quiet, setQuiet] = useState(["sat", "sun"]);
    const [kind, setKind] = useState("hub");
    return (
      <Stack gap={24}>
        <SegmentedControl
          name="old-view"
          legend="Show"
          options={[
            { value: "open", label: "Open" },
            { value: "all", label: "All" },
          ]}
          value={view}
          onChange={setView}
        />
        <ToggleGroup legend="Quiet on" options={days} value={quiet} onChange={setQuiet} />
        <ChoiceCards name="old-kind" legend="Source type" options={sources} value={kind} onChange={setKind} />
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("radio", { name: "Open" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Sunday" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: /Event Hub/ })).toBeChecked();
    const chosen = [...canvasElement.querySelectorAll(".is-chosen")];
    await expect(chosen).toHaveLength(4);
    const fills = new Set(
      chosen.filter((c) => !c.classList.contains("di-choice-card")).map((c) => getComputedStyle(c).backgroundColor),
    );
    await expect(fills.size).toBe(1);
  },
};
