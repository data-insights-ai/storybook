import { useMemo, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { bucketFor } from "../scale";
import { episodesIn, episodesOf, type TimelineEpisode } from "./episodes";
import {
  TimelineSummary,
  TimelineSummaryDetail,
  TimelineSummaryEpisode,
  TimelineSummaryMarker,
  TimelineSummaryMeta,
  TimelineSummaryTime,
} from "./TimelineSummary";
import type { TimelineLane, TimelineMarker, TimelineTone } from "../types";
import { boundsOf, foldBars, foldLanes, activity, activityLanes, rhythm, type SampleEvent } from "../timeline.sample";

const NOW = Date.UTC(2026, 9, 12, 10, 0, 0);
const HOUR = 3_600_000;
const STRIP_PX = 600;

const day = new Intl.DateTimeFormat("en", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
});
const clock = new Intl.DateTimeFormat("en", {
  timeZone: "UTC",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const count = new Intl.NumberFormat("en");
const list = new Intl.ListFormat("en");

const TONE: Record<TimelineTone, string> = {
  danger: "critical",
  warn: "warning",
  neutral: "routine",
};

const ACTIVITY = activity(NOW);
const isCritical = (event: SampleEvent) => event.tone === "danger";
const RHYTHM = rhythm(NOW);

function duration(ms: number) {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  return minutes < 90 ? `${minutes} min` : `${Math.round(minutes / 60)} h`;
}

function when(episode: TimelineEpisode) {
  const end = episode.end - 1;
  const from = `${day.format(episode.start)} ${clock.format(episode.start)}`;
  return day.format(episode.start) === day.format(end)
    ? `${from}–${clock.format(end)}`
    : `${from} – ${day.format(end)} ${clock.format(end)}`;
}

/** The three busiest lanes, read in the order the lanes run. */
function whatHappened(episode: TimelineEpisode) {
  const busiest = new Set([...episode.lanes].sort((a, b) => b.count - a.count).slice(0, 3));
  const named = episode.lanes.filter((l) => busiest.has(l)).map((l) => l.label);
  if (named.length === 0) {
    return "Unclassified activity";
  }
  const more = episode.lanes.length - named.length;
  return more > 0 ? `${list.format(named)} and ${more} more` : list.format(named);
}

type SampleProps = ComponentProps<typeof TimelineSummary> & {
  sample: SampleEvent[];
  sampleLanes: TimelineLane[];
  sampleMarkers?: TimelineMarker[];
  /** Counts the episodes found in all of `sample` again in only these events. */
  sampleFocus?: (event: SampleEvent) => boolean;
};

/*
 * The caller's side, which a product writes the same way: the bars and lanes
 * of the whole record at one coarse width, folded into episodes, and a row
 * per episode with the record's markers placed between them.
 */
function Sample({ sample, sampleLanes, sampleMarkers = [], sampleFocus, onEpisodePick, ...args }: SampleProps) {
  const bounds = useMemo(() => boundsOf(sample), [sample]);
  const episodes = useMemo(() => {
    const bucketMs = bucketFor(bounds.end - bounds.start, STRIP_PX);
    const found = episodesOf(foldBars(sample, bounds, bucketMs), foldLanes(sampleLanes, sample, bounds, bucketMs));
    if (!sampleFocus) {
      return found;
    }
    const focused = sample.filter(sampleFocus);
    return episodesIn(found, foldBars(focused, bounds, bucketMs), foldLanes(sampleLanes, focused, bounds, bucketMs));
  }, [sample, sampleLanes, sampleFocus, bounds]);
  const [active, setActive] = useState<number | null>(null);

  const rows = [
    ...episodes.flatMap((episode, i) => (episode.total > 0 ? [{ at: episode.start, episode, i }] : [])),
    ...sampleMarkers.map((marker) => ({ at: marker.at, marker })),
  ].sort((a, b) => a.at - b.at);
  const total = episodes.reduce((n, e) => n + e.total, 0);

  return (
    <TimelineSummary
      {...args}
      bounds={bounds}
      episodes={episodes}
      markers={sampleMarkers}
      active={active}
      onEpisodePick={(episode) => {
        setActive(episode);
        onEpisodePick?.(episode);
      }}
    >
      <TimelineSummaryMeta>
        <span className="di-quiet">
          {episodes.filter((e) => e.total > 0).length} episodes holding {count.format(total)} events over{" "}
          {duration(bounds.end - bounds.start)}
        </span>
      </TimelineSummaryMeta>
      {rows.map((row) =>
        "episode" in row ? (
          <TimelineSummaryEpisode
            key={`e${row.at}`}
            episode={row.i}
            tone={row.episode.tone}
            toneLabel={TONE[row.episode.tone]}
            title={whatHappened(row.episode)}
          >
            <TimelineSummaryTime>{when(row.episode)}</TimelineSummaryTime>
            <TimelineSummaryDetail>
              {row.episode.kind === "burst" ? "Burst" : "Ongoing activity"} · {count.format(row.episode.total)} events ·{" "}
              {duration(row.episode.end - row.episode.start)}
              {row.episode.danger ? ` · ${count.format(row.episode.danger)} critical` : ""}
            </TimelineSummaryDetail>
          </TimelineSummaryEpisode>
        ) : (
          <TimelineSummaryMarker key={`m${row.at}`} label={row.marker.label}>
            <TimelineSummaryTime>
              {day.format(row.at)} {clock.format(row.at)}
            </TimelineSummaryTime>
          </TimelineSummaryMarker>
        ),
      )}
    </TimelineSummary>
  );
}

const meta = {
  title: "Timeline/TimelineSummary",
  component: TimelineSummary,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "What happened",
    label: "Episodes of activity across the record, each as a block on one strip",
    listLabel: "Episodes and record changes, oldest first",
    bounds: { start: 0, end: 0 },
    episodes: [],
    toneLabels: TONE,
    markerLabel: "change to the record",
    scaleNote:
      "A taller block held more events per minute. Each colour shows where events of that tone fell; the pale ground between them was quiet.",
    locale: "en",
    timeZone: "UTC",
    onEpisodePick: fn(),
  },
  argTypes: {
    bounds: { control: false },
    episodes: { control: false },
    markers: { control: false },
    active: { control: false },
    toneLabels: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof TimelineSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

const start = ACTIVITY[0]?.at ?? NOW;

/**
 * The same three days `EventTimeline` draws, told as the few stretches that
 * matter: the bursts, standing tall, and the ongoing activity between
 * them, with what happened to the record in between. Picking a row
 * narrows to it; picking it again returns to the whole.
 */
export const Default: Story = {
  render: (args) => (
    <Sample
      {...args}
      sample={ACTIVITY}
      sampleLanes={activityLanes}
      sampleMarkers={[
        { at: start + HOUR, label: "opened" },
        { at: start + 15.5 * HOUR, label: "under review" },
        { at: start + 31 * HOUR, label: "confirmed" },
      ]}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole("list", {
      name: "Episodes and record changes, oldest first",
    });
    const [first] = within(list).getAllByRole("button");
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(first);
    await expect(args.onEpisodePick).toHaveBeenLastCalledWith(0);
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(first);
    await expect(args.onEpisodePick).toHaveBeenLastCalledWith(null);
  },
};

/**
 * The same three days with only the critical events: what a reader narrows
 * to when they want the worst part alone. The episodes are the ones
 * found in all events, counted again, so each keeps its number; one with
 * no critical event is left out and its number skipped.
 */
export const CriticalOnly: Story = {
  render: (args) => <Sample {...args} sample={ACTIVITY} sampleLanes={activityLanes} sampleFocus={isCritical} />,
};

/** A health check every minute for twelve hours never goes quiet, so it is one episode. */
export const Steady: Story = {
  render: (args) => <Sample {...args} sample={RHYTHM} sampleLanes={[{ id: "health", label: "Health checks" }]} />,
};
