import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { DateRangePicker, defaultDateRangeLabels } from "./DateRangePicker";
import { type DateRangeValue, parseDateRange, resolveDateRange, serializeDateRange } from "../dateRange";
import { Toolbar } from "../../../actions/Toolbar";
import { SearchField } from "../../text/SearchField";
import { Select } from "../../select/Select";

type Screen = ReturnType<typeof within>;

// Types a day into the segments of a typed date field: day, month, year in en-GB.
const typeDay = async (screen: Screen, label: string, digits: string) => {
  await userEvent.click(within(screen.getByRole("group", { name: label })).getAllByRole("spinbutton")[0]);
  await userEvent.keyboard(digits);
};

// Empties the year, which leaves the day incomplete.
const clearYear = async (screen: Screen, label: string) => {
  await userEvent.click(within(screen.getByRole("group", { name: label })).getAllByRole("spinbutton")[2]);
  await userEvent.keyboard("{Backspace}{Backspace}{Backspace}{Backspace}");
};

const meta = {
  title: "Forms/Dates/DateRangePicker",
  tags: ["layer:form"],
  component: DateRangePicker,
  // The popover stories assert the anchored panel; the phone sheet has its own story below.
  globals: { viewport: { value: "desk", isRotated: false } },
  args: {
    id: "period",
    label: "Period",
    value: {},
    locale: "en-GB",
    weekStartsOn: 1,
    timeZone: "Europe/Vienna",
    allowAny: true,
    allowTimes: true,
    disabled: false,
    labels: defaultDateRangeLabels,
    onChange: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange(next);
          setValue(next);
        }}
      />
    );
  },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Empty is any time; the control says so inside itself. */
export const Default: Story = {};

/** A preset moves with the clock: "Last 7 days" is today and the six days before it. */
export const Preset: Story = { args: { value: { preset: "7d" } } };

/** A token's colour as the browser resolves it here. */
const tokenColour = (from: Element, token: string) => {
  const probe = from.ownerDocument.body.appendChild(from.ownerDocument.createElement("div"));
  probe.style.background = `var(${token})`;
  const colour = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return colour;
};

/** WCAG contrast of two opaque rgb() colours. */
const contrast = (a: string, b: string) => {
  const lum = (colour: string) => {
    const [r, g, b] = (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * A fixed range shows its days in the reader's language; the end is exclusive, so the last day shown is 7 October.
 * Open, the chosen period is marked in the list and the days carry the selection: both ends filled with the primary ink, the
 * days between in the selection tint, edged above and below by a cornflower line that stands at least 3:1 against the
 * popup. It rests open.
 */

export const CustomRange: Story = {
  args: { value: { from: "2026-09-30T22:00:00.000Z", to: "2026-10-07T22:00:00.000Z" } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByRole("option", { name: "Custom range" })).toHaveAttribute("aria-selected", "true");
    const first = page.getAllByRole("button", { name: /1 October 2026/ })[0];
    await expect(first).toHaveAttribute("data-selection-start");
    await expect(getComputedStyle(first).backgroundColor).toBe(tokenColour(first, "--di-choice-on-bg"));
    const between = page.getAllByRole("button", { name: /4 October 2026/ })[0];
    await expect(getComputedStyle(between).backgroundColor).toBe(tokenColour(between, "--di-bg-selected"));
    const edge = tokenColour(between, "--di-select");
    await expect(getComputedStyle(between).boxShadow.split(edge).length - 1).toBe(2);
    const popup = getComputedStyle(between.closest(".di-date-range-popover, .di-date-range-sheet")!).backgroundColor;
    await expect(contrast(edge, popup)).toBeGreaterThanOrEqual(3);
  },
};

export const Disabled: Story = { args: { disabled: true, value: { preset: "7d" } } };

export const IndependentStart: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await typeDay(dialog, "From date", "03102026");
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-16T00:00:00.000Z",
    });
  },
};

export const OpenEnded: Story = {
  args: { allowOpenEnd: true, timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.getByLabelText("Until now")).toBeChecked();
    await typeDay(dialog, "From date", "03102026");
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ from: "2026-10-03T00:00:00.000Z" });
  },
};

/** German, the week starting on Monday, the zone from the product's settings. */
export const German: Story = {
  args: {
    label: "Zeitraum",
    locale: "de-DE",
    weekStartsOn: 1,
    timeZone: "Europe/Berlin",
    value: { from: "2026-10-01T06:30:00.000Z", to: "2026-10-03T16:00:00.000Z" },
    labels: {
      ...defaultDateRangeLabels,
      any: "Beliebiger Zeitraum",
      "24h": "Letzte 24 Stunden",
      "7d": "Letzte 7 Tage",
      "30d": "Letzte 30 Tage",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      custom: "Eigener Zeitraum",
      presets: "Zeiträume",
      dialog: "Zeitraum wählen",
      previous: "Vorheriger Monat",
      next: "Nächster Monat",
      setTimes: "Uhrzeiten festlegen",
      fromTime: "Von",
      toTime: "Bis",
      apply: "Übernehmen",
      cancel: "Abbrechen",
      timeZone: "Zeitzone",
      fromDate: "Erster Tag",
      toDate: "Letzter Tag",
      openEnd: "Bis jetzt",
      reversed: "Der letzte Tag liegt vor dem ersten.",
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Zeitraum:/ }));
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByLabelText("Uhrzeiten festlegen")).toBeChecked();
    await waitFor(() => expect(page.getByRole("button", { name: "Übernehmen" })).toBeVisible());
  },
};

/** In a list's toolbar the control is one field high, beside the search and the filters. */
export const InToolbar: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>({ preset: "30d" });
    return (
      <Toolbar label="Filter the entries" role="search">
        <SearchField id="entries-search" label="Search entries" size="sm" />
        <Select id="entries-status" label="Status" hideLabel mono={false} defaultValue="">
          <option value="">Status: all</option>
          <option value="ok">Delivered</option>
          <option value="failed">Failed</option>
        </Select>
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </Toolbar>
    );
  },
};

/** What a product writes into the URL and reads back, and the instants it sends to the server. */
export const UrlState: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>(parseDateRange(new URLSearchParams("range=7d")));
    const search = serializeDateRange(value);
    const resolved = resolveDateRange(value, new Date(), args.timeZone ?? "UTC");
    return (
      <div style={{ display: "grid", gap: "var(--di-space-12)", justifyItems: "start" }}>
        <DateRangePicker {...args} value={value} onChange={setValue} />
        <code data-testid="search">{JSON.stringify(search)}</code>
        <code data-testid="resolved">{JSON.stringify(resolved)}</code>
      </div>
    );
  },
};

/** Keys only: Enter opens, arrows walk the presets and the days, Enter picks, Esc closes back onto the control. */
export const Keyboard: Story = {
  args: { timeZone: "UTC" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Period: Any time" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const presets = await page.findByRole("listbox", { name: "Periods" });
    await waitFor(() => expect(presets).toBeVisible());
    page.getByRole("option", { name: "Any time" }).focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ preset: "7d" });
    await waitFor(() => expect(page.queryByRole("listbox", { name: "Periods" })).toBeNull());
    await waitFor(() => expect(canvas.getByRole("button", { name: "Period: Last 7 days" })).toHaveFocus());

    await userEvent.keyboard("{Enter}");
    const custom = await page.findByRole("option", { name: "Custom range" });
    custom.focus();
    await userEvent.keyboard("{Enter}");
    const grid = page.getAllByRole("grid")[0];
    await waitFor(() => expect(grid.contains(canvasElement.ownerDocument.activeElement)).toBe(true));
    await userEvent.keyboard("{Enter}{ArrowRight}{ArrowRight}{ArrowRight}{Enter}");
    await userEvent.click(page.getByRole("button", { name: "Apply" }));
    const applied = args.onChange.mock.lastCall?.[0] as DateRangeValue;
    const midnight = new Date();
    midnight.setUTCHours(0, 0, 0, 0);
    await expect(applied.from).toBe(midnight.toISOString());
    await expect(Date.parse(applied.to!) - Date.parse(applied.from!)).toBeGreaterThanOrEqual(4 * 86_400_000);
    await expect(Date.parse(applied.to!) % 86_400_000).toBe(0);
    await waitFor(() => expect(canvas.getByRole("button", { name: /^Period: / })).toHaveFocus());

    await userEvent.keyboard("{Enter}");
    await page.findByRole("listbox", { name: "Periods" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox", { name: "Periods" })).toBeNull());
    await waitFor(() => expect(canvas.getByRole("button", { name: /^Period: / })).toHaveFocus());
  },
};

export const PartialDateKeepsOtherEndpoint: Story = {
  args: {
    allowOpenEnd: true,
    timeZone: "UTC",
    value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" },
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await clearYear(dialog, "From date");
    await expect(dialog.getByRole("group", { name: "Through date" })).toHaveTextContent(/15\D*10\D*2026/);
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    await typeDay(dialog, "From date", "03102026");
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-16T00:00:00.000Z",
    });
  },
};

/** A last day before the first is named under it and cannot be applied; nothing is swapped. */
export const ReversedDates: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await typeDay(dialog, "Through date", "20092026");
    await waitFor(() => expect(dialog.getByText("The last day comes before the first.")).toBeVisible());
    await expect(
      within(dialog.getByRole("group", { name: "Through date" })).getAllByRole("spinbutton")[0],
    ).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    await typeDay(dialog, "Through date", "04102026");
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-01T00:00:00.000Z",
      to: "2026-10-05T00:00:00.000Z",
    });
  },
};

/** An open end with times applies from the first day's time; the end time is not asked for. */
export const OpenEndedWithTime: Story = {
  args: { allowOpenEnd: true, timeZone: "UTC", value: { from: "2026-10-01T09:30:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.getByLabelText("Until now")).toBeChecked();
    await expect(dialog.getByLabelText("Set times")).toBeChecked();
    await expect(dialog.queryByRole("group", { name: "Through date" })).toBeNull();
    await expect(dialog.queryByText("Until")).toBeNull();
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ from: "2026-10-01T09:30:00.000Z" });
  },
};

/** Without `allowOpenEnd` there is no "Until now", and a range needs both days as before. */
export const NoOpenEnd: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.queryByLabelText("Until now")).toBeNull();
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    await typeDay(dialog, "From date", "03102026");
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    await typeDay(dialog, "Through date", "03102026");
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-04T00:00:00.000Z",
    });
  },
};

const phone = {
  parameters: {
    viewport: { options: { phone: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" } } },
  },
  globals: { viewport: { value: "phone", isRotated: false } },
} as const;

const openSheet = async (canvasElement: HTMLElement) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
  const doc = canvasElement.ownerDocument;
  await waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).not.toBeNull());
  return { doc, sheet: doc.querySelector<HTMLElement>(".di-date-range-sheet")!, page: within(doc.body) };
};

/**
 * On a phone (390px) the picker is a bottom sheet: full width, a drag handle, the periods as a list, then the
 * calendar and the typed days, Cancel and Apply pinned to the foot above the home indicator. Focus starts and stays
 * inside; Esc closes and returns to the control.
 */
export const PhoneSheet: Story = {
  ...phone,
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement }) => {
    const { doc, sheet, page } = await openSheet(canvasElement);
    await expect(doc.defaultView!.innerWidth).toBe(390);
    await expect(doc.querySelector(".di-date-range-popover")).toBeNull();
    await waitFor(() => expect(sheet.getBoundingClientRect().width).toBe(390));
    await waitFor(() => expect(Math.round(sheet.getBoundingClientRect().bottom)).toBe(844));
    await expect(sheet.querySelector(".di-date-range-handle")).not.toBeNull();
    const top = (element: Element) => element.getBoundingClientRect().top;
    const presets = page.getByRole("listbox", { name: "Periods" });
    const calendar = page.getAllByRole("grid")[0];
    await expect(top(presets)).toBeLessThan(top(calendar));
    await expect(top(calendar)).toBeLessThan(top(page.getByRole("group", { name: "From date" })));
    await expect(page.getAllByRole("grid")).toHaveLength(1);
    const apply = page.getByRole("button", { name: "Apply" });
    await expect(apply.getBoundingClientRect().bottom).toBeLessThanOrEqual(844);
    await expect(sheet.contains(doc.activeElement)).toBe(true);
    for (let i = 0; i < 30; i++) {
      await userEvent.tab();
      await expect(sheet.contains(doc.activeElement)).toBe(true);
    }
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).toBeNull());
    await waitFor(() => expect(within(canvasElement).getByRole("button", { name: /^Period: / })).toHaveFocus());
  },
};

/** A period in the list applies at once and closes the sheet; typed days apply with Apply. */
export const PhoneChoose: Story = {
  ...phone,
  args: { timeZone: "UTC" },
  play: async ({ canvasElement, args }) => {
    let { doc, page } = await openSheet(canvasElement);
    await userEvent.click(page.getByRole("option", { name: "Last 7 days" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ preset: "7d" });
    await waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).toBeNull());
    ({ doc, page } = await openSheet(canvasElement));
    await typeDay(page, "From date", "03102026");
    await typeDay(page, "Through date", "05102026");
    await userEvent.click(page.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-06T00:00:00.000Z",
    });
    await waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).toBeNull());
  },
};

/** The back button, Cancel and dragging the handle down each close the sheet without a change. */
export const PhoneDismiss: Story = {
  ...phone,
  args: { timeZone: "UTC" },
  play: async ({ canvasElement, args }) => {
    let { doc, sheet, page } = await openSheet(canvasElement);
    const gone = () => waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).toBeNull());
    doc.defaultView!.history.back();
    await gone();

    ({ doc, page } = await openSheet(canvasElement));
    await userEvent.click(page.getByRole("button", { name: "Cancel" }));
    await gone();

    ({ doc, sheet } = await openSheet(canvasElement));
    const grip = sheet.querySelector<HTMLElement>(".di-date-range-grip")!;
    const y = grip.getBoundingClientRect().top + 8;
    fireEvent.pointerDown(grip, { pointerId: 1, clientY: y });
    fireEvent.pointerMove(grip, { pointerId: 1, clientY: y + 40 });
    fireEvent.pointerUp(grip, { pointerId: 1, clientY: y + 40 });
    await expect(doc.querySelector(".di-date-range-sheet")).not.toBeNull();
    fireEvent.pointerDown(grip, { pointerId: 1, clientY: y });
    fireEvent.pointerMove(grip, { pointerId: 1, clientY: y + 200 });
    fireEvent.pointerUp(grip, { pointerId: 1, clientY: y + 200 });
    await gone();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/** At console width the picker stays a popover beside its control, two months wide. */
export const DesktopPopover: Story = {
  parameters: {
    viewport: { options: { desk: { name: "Console (1280)", styles: { width: "1280px", height: "900px" } } } },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const doc = canvasElement.ownerDocument;
    await waitFor(() => expect(doc.querySelector(".di-date-range-popover")).not.toBeNull());
    await expect(doc.querySelector(".di-date-range-sheet")).toBeNull();
    await expect(within(doc.body).getAllByRole("grid")).toHaveLength(2);
    await userEvent.keyboard("{Escape}");
  },
};

/**
 * A product keeps the period in the URL. Choosing waits until the sheet's history entry is gone, so the product's
 * navigation to the new period stays, and back then leaves the page as usual.
 */
export const PhoneChoiceKeepsNavigation: Story = {
  ...phone,
  args: {
    timeZone: "UTC",
    // A router navigates a moment after the change, as TanStack Router does.
    onChange: fn((next: DateRangeValue) => {
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("range", next.preset ?? "custom");
        window.history.pushState(null, "", url);
      });
    }),
  },
  play: async ({ canvasElement }) => {
    const { doc, page } = await openSheet(canvasElement);
    const win = doc.defaultView!;
    await userEvent.click(page.getByRole("option", { name: "Last 30 days" }));
    await waitFor(() => expect(doc.querySelector(".di-date-range-sheet")).toBeNull());
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(new URL(win.location.href).searchParams.get("range")).toBe("30d");
    win.history.back();
    await waitFor(() => expect(new URL(win.location.href).searchParams.get("range")).toBeNull());
  },
};

/** The range calendar by keyboard: its focus starts on the last day; Page Up and Down move by month,
 * Home and End to the month's first and last day, arrows by day and week. */
export const KeyboardCalendar: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const focused = () => canvasElement.ownerDocument.activeElement as HTMLElement;
    canvas.getByRole("button", { name: /^Period: / }).focus();
    await userEvent.keyboard("{Enter}");
    const grid = (await page.findAllByRole("grid"))[0];
    grid.querySelector<HTMLElement>('[tabindex="0"]')!.focus();
    await waitFor(() => expect(focused()).toHaveAccessibleName(/15 October 2026/));
    await userEvent.keyboard("{PageDown}");
    await expect(focused()).toHaveAccessibleName(/15 November 2026/);
    await userEvent.keyboard("{Home}");
    await expect(focused()).toHaveAccessibleName(/1 November 2026/);
    await userEvent.keyboard("{End}");
    await expect(focused()).toHaveAccessibleName(/30 November 2026/);
    await userEvent.keyboard("{ArrowUp}{ArrowLeft}");
    await expect(focused()).toHaveAccessibleName(/22 November 2026/);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox", { name: "Periods" })).toBeNull());
    await waitFor(() => expect(canvas.getByRole("button", { name: /^Period: / })).toHaveFocus());
  },
};
