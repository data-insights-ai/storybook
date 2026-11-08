import { useMemo, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Panel } from "../../layout/page/Panel";
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
import type { TimelineLane, TimelineMarker, TimelineSeries } from "../types";
import {
  boundsOf,
  foldBars,
  foldLanes,
  activity,
  activityLanes,
  rhythm,
  sampleSeries,
  type SampleEvent,
} from "../timeline.sample";

const NOW = Date.UTC(2026, 9, 12, 10, 0, 0);
const HOUR = 3_600_000;
const STRIP_PX = 600;

type Words = {
  series: TimelineSeries[];
  unclassified: string;
  more: (n: number) => string;
  burst: string;
  steady: string;
  events: (n: string) => string;
  episodes: (n: number) => string;
  holding: (episodes: string, events: string, over: string) => string;
  minutes: (n: number) => string;
  hours: (n: number) => string;
};

const WORDS: Record<string, Words> = {
  en: {
    series: sampleSeries,
    unclassified: "Unclassified activity",
    more: (n) => `and ${n} more`,
    burst: "Burst",
    steady: "Ongoing activity",
    events: (n) => `${n} events`,
    episodes: (n) => (n === 1 ? "1 episode" : `${n} episodes`),
    holding: (episodes, events, over) => `${episodes} holding ${events} events over ${over}`,
    minutes: (n) => `${n} min`,
    hours: (n) => `${n} h`,
  },
  de: {
    series: [
      { id: "reading", label: "Messwert" },
      { id: "change", label: "Änderung" },
      { id: "check", label: "Prüfung" },
      { id: "retry", label: "Wiederholung" },
      { id: "transfer", label: "Übertragung" },
      { id: "correction", label: "Korrektur" },
    ],
    unclassified: "Nicht zugeordnete Aktivität",
    more: (n) => `und ${n} weitere`,
    burst: "Ausbruch",
    steady: "Laufende Aktivität",
    events: (n) => `${n} Ereignisse`,
    episodes: (n) => (n === 1 ? "1 Abschnitt" : `${n} Abschnitte`),
    holding: (episodes, events, over) => `${episodes} mit ${events} Ereignissen über ${over}`,
    minutes: (n) => `${n} Min.`,
    hours: (n) => `${n} Std.`,
  },
};

const formatsOf = (locale: string) => ({
  words: WORDS[locale] ?? WORDS.en,
  day: new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }),
  clock: new Intl.DateTimeFormat(locale, { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  count: new Intl.NumberFormat(locale),
  list: new Intl.ListFormat(locale),
});
type Formats = ReturnType<typeof formatsOf>;

const ACTIVITY = activity(NOW);
const isRetry = (event: SampleEvent) => event.series === "retry";
const RHYTHM = rhythm(NOW);

function duration(ms: number, { words }: Formats) {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  return minutes < 90 ? words.minutes(minutes) : words.hours(Math.round(minutes / 60));
}

function when(episode: TimelineEpisode, { day, clock }: Formats) {
  const end = episode.end - 1;
  const from = `${day.format(episode.start)} ${clock.format(episode.start)}`;
  return day.format(episode.start) === day.format(end)
    ? `${from}–${clock.format(end)}`
    : `${from}\u00a0– ${day.format(end)} ${clock.format(end)}`;
}

/** The three busiest lanes, read in the order the lanes run. */
function whatHappened(episode: TimelineEpisode, { words, list }: Formats) {
  const busiest = new Set([...episode.lanes].sort((a, b) => b.count - a.count).slice(0, 3));
  const named = episode.lanes.filter((l) => busiest.has(l)).map((l) => l.label);
  if (named.length === 0) {
    return words.unclassified;
  }
  const more = episode.lanes.length - named.length;
  return more > 0 ? `${list.format(named)} ${words.more(more)}` : list.format(named);
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
  const formats = useMemo(() => formatsOf(args.locale), [args.locale]);
  const { words, day, clock, count } = formats;

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
          {words.holding(
            words.episodes(episodes.filter((e) => e.total > 0).length),
            count.format(total),
            duration(bounds.end - bounds.start, formats),
          )}
        </span>
      </TimelineSummaryMeta>
      {rows.map((row) =>
        "episode" in row ? (
          <TimelineSummaryEpisode key={`e${row.at}`} episode={row.i} title={whatHappened(row.episode, formats)}>
            <TimelineSummaryTime>{when(row.episode, formats)}</TimelineSummaryTime>
            <TimelineSummaryDetail>
              {[
                row.episode.kind === "burst" ? words.burst : words.steady,
                words.events(count.format(row.episode.total)),
                duration(row.episode.end - row.episode.start, formats),
              ].join(" · ")}
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

/** The series named in each episode row's key, in the order the row lists them. */
const rowSeries = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll(".di-tsummary-row")].map((row) =>
    [...row.querySelectorAll(".di-tsummary-series .di-chart-key-entry")].map((entry) => entry.textContent),
  );

/** Waits for the strip, then checks every episode row with events names its series in the declared order, in phrasing content, and no record change names any. */
async function seriesNamed(canvasElement: HTMLElement, series: TimelineSeries[]) {
  await waitFor(() => expect(canvasElement.querySelector(".di-tsummary-block")).not.toBeNull());
  const rows = rowSeries(canvasElement);
  await expect(rows.length).toBeGreaterThan(0);
  const labels = series.map((s) => s.label);
  for (const named of rows.filter((r) => r.length > 0)) {
    await expect(named).toEqual(labels.filter((l) => named.includes(l)));
  }
  await expect(canvasElement.querySelector(".di-tsummary-note .di-tsummary-series")).toBeNull();
  // A pickable row is a button, which holds phrasing content only.
  await expect(canvasElement.querySelector("button.di-tsummary-row :is(div, ul, ol, li, p)")).toBeNull();
}

const meta = {
  title: "Timelines/TimelineSummary",
  component: TimelineSummary,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "What happened",
    label: "Episodes of activity across the record, each as a block on one strip",
    listLabel: "Episodes and record changes, oldest first",
    bounds: { start: 0, end: 0 },
    episodes: [],
    series: sampleSeries,
    markerLabel: "change to the record",
    scaleNote:
      "A taller block held more events per minute. Each colour shows where events of that kind fell; where only the base line runs, it was quiet.",
    locale: "en",
    timeZone: "UTC",
    onEpisodePick: fn(),
  },
  // The strip lays its blocks out once it knows its width; the checks after a story measure the drawn strip.
  play: async ({ args, canvasElement }) => seriesNamed(canvasElement, args.series),
  decorators: [
    (Story) => (
      <Panel>
        <Story />
      </Panel>
    ),
  ],
  argTypes: {
    bounds: { control: false },
    episodes: { control: false },
    markers: { control: false },
    active: { control: false },
    series: { control: false },
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
    await seriesNamed(canvasElement, args.series);
    const [first] = within(list).getAllByRole("button");
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(first);
    await expect(args.onEpisodePick).toHaveBeenLastCalledWith(0);
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(first);
    await expect(args.onEpisodePick).toHaveBeenLastCalledWith(null);
    // A pointer click leaves no ring; the test's synthetic click would, so the story ends without focus.
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/**
 * The same three days with only the retries: what a reader narrows to when
 * they want one kind alone. The episodes are the ones found in all events,
 * counted again, so each keeps its number; one with no retry is left out
 * and its number skipped.
 */
export const OneSeries: Story = {
  render: (args) => <Sample {...args} sample={ACTIVITY} sampleLanes={activityLanes} sampleFocus={isRetry} />,
};

/** A health check every minute for twelve hours never goes quiet, so it is one episode. */
export const Steady: Story = {
  render: (args) => <Sample {...args} sample={RHYTHM} sampleLanes={[{ id: "health", label: "Health checks" }]} />,
};

const inIntakeOrExport = (event: SampleEvent) => event.lane === "intake" || event.lane === "export";

/**
 * The same three days narrowed to two stages, Intake and Export: their
 * episodes hold different series, and each row names the ones it holds in
 * the colours of its block.
 */
export const MixedSeries: Story = {
  render: (args) => <Sample {...args} sample={ACTIVITY} sampleLanes={activityLanes} sampleFocus={inIntakeOrExport} />,
  play: async ({ args, canvasElement }) => {
    await seriesNamed(canvasElement, args.series);
    const held = rowSeries(canvasElement).map((named) => named.join("+"));
    await expect(new Set(held).size).toBeGreaterThan(1);
  },
};

const GERMAN_LANES: TimelineLane[] = [
  { id: "config", label: "Konfigurationsänderungen" },
  { id: "intake", label: "Datenannahme" },
  { id: "checks", label: "Plausibilitätsprüfungen" },
  { id: "sync", label: "Replikation" },
  { id: "export", label: "Export an Empfängersysteme" },
];

/** Long German lane names and meta: the rows wrap between words, every row keeps its series at its end. */
export const German: Story = {
  args: {
    title: "Was geschah",
    label: "Aktivitätsabschnitte über den ganzen Datensatz, jeder als Block auf einem Streifen",
    listLabel: "Abschnitte und Änderungen am Datensatz, älteste zuerst",
    series: WORDS.de.series,
    markerLabel: "Änderung am Datensatz",
    scaleNote:
      "Ein höherer Block enthielt mehr Ereignisse pro Minute. Jede Farbe zeigt, wo Ereignisse dieser Art fielen; wo nur die Grundlinie läuft, war es ruhig.",
    locale: "de",
  },
  render: (args) => (
    <Sample
      {...args}
      sample={ACTIVITY}
      sampleLanes={GERMAN_LANES}
      sampleMarkers={[
        { at: start + HOUR, label: "eröffnet" },
        { at: start + 15.5 * HOUR, label: "in Prüfung" },
        { at: start + 31 * HOUR, label: "bestätigt" },
      ]}
    />
  ),
};
