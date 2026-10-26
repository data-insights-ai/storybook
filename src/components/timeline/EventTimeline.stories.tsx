import { useMemo, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { EventTimeline, EventTimelineMeta, EventTimelineReadout } from "./EventTimeline";
import { useTimelineView, type TimelineNavigation } from "./navigation/useTimelineView";
import { eventsReadable } from "./scale/resolution";
import type { TimelineLane, TimelineScore, TimelineSpan, TimelineTarget } from "./types";
import {
  boundsOf,
  foldBars,
  foldLanes,
  activity,
  activityLanes,
  rhythm,
  sparse,
  type SampleEvent,
} from "./timeline.sample";

const NOW = Date.UTC(2026, 9, 12, 10, 0, 0);
const HOUR = 3_600_000;

const clock = new Intl.DateTimeFormat("en", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const instant = new Intl.DateTimeFormat("en", {
  timeZone: "UTC",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  hourCycle: "h23",
});
const count = new Intl.NumberFormat("en");

const ACTIVITY = activity(NOW);
const RHYTHM = rhythm(NOW);
const SPARSE = sparse(NOW);

/** A score that climbs with the critical events, recorded once an hour. */
function scoreOf(events: SampleEvent[], bounds: TimelineSpan): TimelineScore {
  const points: TimelineScore["points"] = [];
  let i = 0;
  let weight = 0;
  for (let at = Math.ceil(bounds.start / HOUR) * HOUR; at <= bounds.end; at += HOUR) {
    while (i < events.length && events[i].at < at) {
      weight += events[i].tone === "danger" ? 1 : events[i].tone === "warn" ? 0.4 : 0.1;
      i += 1;
    }
    points.push({ at, value: Math.round(12 + 86 * (1 - Math.exp(-weight / 90))) });
  }
  const then = bounds.end - 24 * HOUR;
  const value = [...points].reverse().find((p) => p.at <= then)?.value ?? 0;
  return {
    label: "Severity score",
    points,
    max: 100,
    warn: 40,
    danger: 60,
    compare: { at: then, value, label: "24 h ago" },
  };
}

type SampleProps = ComponentProps<typeof EventTimeline> & {
  sample: SampleEvent[];
  sampleLanes?: TimelineLane[];
  withScore?: boolean;
  withMarkers?: boolean;
};

/*
 * The caller's side, which a product writes the same way: the view hook, the
 * bars loaded for the view (here folded in the browser), and the events once
 * they can be told apart.
 */
function Sample({ sample, sampleLanes = [], withScore, withMarkers, ...args }: SampleProps) {
  const bounds = useMemo(() => boundsOf(sample), [sample]);
  const [selected, setSelected] = useState<TimelineSpan | null>(null);
  const [hovered, setHovered] = useState<TimelineTarget | null>(null);
  const navigation = useTimelineView({ bounds, selected, onSettle: setSelected });
  const { view, bucketMs, overviewBucketMs } = navigation;

  const width = view.end - view.start;
  const loaded = { start: view.start - width, end: view.end + width };
  const bars = foldBars(sample, loaded, bucketMs);
  const readable = eventsReadable(bars);
  const events = readable
    ? sample.filter((e) => e.at >= loaded.start && e.at < loaded.end)
    : undefined;
  const lanes = readable ? sampleLanes : foldLanes(sampleLanes, sample, loaded, bucketMs);
  const inView = sample.filter((e) => e.at >= view.start && e.at < view.end).length;
  const start = sample[0]?.at ?? NOW;
  const overviewBars = useMemo(
    () => foldBars(sample, bounds, overviewBucketMs),
    [sample, bounds, overviewBucketMs],
  );
  const score = useMemo(
    () => (withScore ? scoreOf(sample, bounds) : undefined),
    [withScore, sample, bounds],
  );

  return (
    <EventTimeline
      {...args}
      navigation={navigation}
      scaleNote={
        readable
          ? "Each line is one event; its length is its magnitude."
          : `Each bar holds the events of ${bucketMs / 1000} s. Its height grows with the square root of the count, so a single event stays visible next to hundreds.`
      }
      bars={bars}
      overviewBars={overviewBars}
      events={events}
      lanes={lanes}
      score={score}
      markers={
        withMarkers
          ? [
              { at: start + HOUR, label: "opened" },
              { at: start + 15.5 * HOUR, label: "under review" },
              { at: start + 31 * HOUR, label: "confirmed" },
            ]
          : []
      }
      onHoverChange={setHovered}
    >
      <EventTimelineMeta>
        <span className="di-mono">
          {clock.format(view.start)} → {clock.format(view.end)}
        </span>
        <span>{count.format(inView)} events</span>
      </EventTimelineMeta>
      <EventTimelineReadout>
        {hovered?.kind === "event" ? (
          <>
            <div className="di-mono">{instant.format(hovered.event.at)}</div>
            <div>{(hovered.event as SampleEvent).text}</div>
          </>
        ) : hovered?.kind === "bar" ? (
          <>
            <div className="di-mono">{clock.format(hovered.bar.start)}</div>
            <div>
              {count.format(hovered.bar.danger)} critical · {count.format(hovered.bar.warn)} warning ·{" "}
              {count.format(hovered.bar.neutral)} routine
            </div>
          </>
        ) : null}
      </EventTimelineReadout>
    </EventTimeline>
  );
}

const meta = {
  title: "Blocks/EventTimeline",
  component: EventTimeline,
  tags: ["autodocs"],
  args: {
    navigation: {} as TimelineNavigation,
    title: "Sequence",
    label: "Event sequence",
    instructions: [
      { keys: ["Drag"], label: "zoom into a span" },
      { keys: ["Click"], label: "look closer, or open an event" },
      { keys: ["⌘/Ctrl + scroll", "Pinch", "+", "−"], label: "zoom" },
      { keys: ["Shift + scroll", "←", "→"], label: "move, or drag the frame above" },
      { keys: ["Double-click"], label: "zoom out" },
      { keys: ["0"], label: "show everything" },
    ],
    loadingLabel: "Loading",
    zoomInLabel: "Zoom in",
    zoomOutLabel: "Zoom out",
    backLabel: "Back to the previous view",
    wholeLabel: "Show everything",
    toneLabels: { danger: "critical", warn: "warning", neutral: "routine" },
    scaleNote: "",
    locale: "en",
    timeZone: "UTC",
    loading: false,
    onHoverChange: fn(),
    onEventPick: fn(),
  },
  argTypes: {
    navigation: { control: false },
    bars: { control: false },
    overviewBars: { control: false },
    events: { control: false },
    lanes: { control: false },
    markers: { control: false },
    score: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof EventTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three days with a spray of hundreds of retries inside minutes. The score runs
 * above on the same clock; the lanes read as a staircase in the order the
 * stages started.
 */
export const Default: Story = {
  render: (args) => (
    <Sample {...args} sample={ACTIVITY} sampleLanes={activityLanes} withScore withMarkers />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const back = await canvas.findByRole("button", { name: "Back to the previous view" });
    await expect(back).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Show everything" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Zoom in" }));
    await waitFor(() => expect(back).toBeEnabled());
    await userEvent.click(back);
    await waitFor(() => expect(back).toBeDisabled());
  },
};

/**
 * A health check every minute for twelve hours: a solid block from afar, a rhythm
 * close up. Zooming in far enough turns the bars into the events themselves.
 */
export const Resolving: Story = {
  render: (args) => (
    <Sample {...args} sample={RHYTHM} sampleLanes={[{ id: "health", label: "Health checks" }]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stage = await canvas.findByRole("group", { name: "Event sequence" });
    await waitFor(() => expect(canvasElement.querySelector(".di-timeline-wave")).not.toBeNull());
    stage.focus();
    for (let i = 0; i < 5; i++) {
      await userEvent.keyboard("+");
    }
    await waitFor(() => expect(canvasElement.querySelector(".di-timeline-events")).not.toBeNull());
  },
};

/** Few enough to draw one by one from the start. Picking one hands it to the caller. */
export const FewEvents: Story = {
  render: (args) => (
    <Sample {...args} sample={SPARSE} sampleLanes={[{ id: "notes", label: "Corrections" }]} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const stage = await canvas.findByRole("group", { name: "Event sequence" });
    await waitFor(() => expect(canvasElement.querySelector(".di-timeline-stem")).not.toBeNull());
    const d = canvasElement.querySelector(".di-timeline-stem")?.getAttribute("d") ?? "";
    const x = Number(/M([\d.]+)/.exec(d)?.[1]);
    const box = stage.getBoundingClientRect();
    const coords = { clientX: box.left + x, clientY: box.top + 60 };
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: stage, coords },
      { keys: "[/MouseLeft]", target: stage, coords },
    ]);
    await expect(args.onEventPick).toHaveBeenCalledOnce();
  },
};

/** Waiting for the first bars: the frame and its controls stand, the plot says it is loading. */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => <Sample {...args} sample={SPARSE} />,
};
