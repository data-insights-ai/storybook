import { Children, createContext, isValidElement, useContext, useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SeverityMark, type Severity } from "../../marks/status/SeverityMark";
import type { TimelineMarker, TimelineSpan, TimelineTone } from "../types";
import { useWidth } from "../../../internal/useWidth";
import type { TimelineEpisode } from "./episodes";
import "./TimelineSummary.css";

const MIN_PX = 6;
const LABEL_PX = 24;
const LOW_PX = 10;
const HIGH_PX = 28;
const MINUTE = 60_000;
const TONES: TimelineTone[] = ["danger", "warn", "neutral"];
const SEVERITY: Record<TimelineTone, Severity> = { danger: "critical", warn: "medium", neutral: "info" };

const ordinal = (i: number) => String(i + 1).padStart(2, "0");

type Place = {
  active: number | null;
  hovered: number | null;
  hover: (episode: number | null) => void;
  pick?: (episode: number) => void;
};

const SummaryPlace = createContext<Place | null>(null);

/**
 * The same activity an `EventTimeline` draws, told as its few episodes:
 * one strip across the whole record with a block per episode, and below
 * it the episodes in order, each a row the caller writes. For the reader
 * who wants to know what happened, not to look through every event.
 *
 * `episodes` come from `timelineEpisodes`, folded from the same bars and
 * lanes the full timeline is drawn from, or from `timelineEpisodesIn` to
 * count the same episodes again in a filtered set. An episode with nothing
 * in it keeps its ordinal and is not drawn. A block's height grows with the
 * square root of its rate, so a burst stands tall and the steady activity
 * between bursts lies low. It is filled in each tone only where events of
 * that tone fell; where it was quiet only its base line shows, so a long
 * stretch with one severe hour does not read as a severe day. The legend
 * under the strip says this in the caller's words.
 * The strip is a picture for the pointer, read as `label`; the rows are
 * the way through it for the keyboard and a screen reader.
 *
 * Children are `TimelineSummaryMeta` beside the title, then the rows,
 * `TimelineSummaryEpisode` and `TimelineSummaryMarker`, in the order the
 * caller wants them read.
 */
export function TimelineSummary({
  title,
  label,
  listLabel,
  bounds,
  episodes,
  markers = [],
  active = null,
  toneLabels,
  markerLabel,
  scaleNote,
  locale,
  timeZone,
  onEpisodePick,
  children,
}: {
  title: string;
  /** What the strip shows, in words: it is read instead of the picture. */
  label: string;
  /** The accessible name of the rows. */
  listLabel: string;
  bounds: TimelineSpan;
  episodes: TimelineEpisode[];
  markers?: TimelineMarker[];
  /** The position in `episodes` of the one the caller narrowed to. */
  active?: number | null;
  /** The legend's word for each tone a block is coloured in. */
  toneLabels: Record<TimelineTone, string>;
  /** What a flag under the strip stands for, in the legend once there are markers. */
  markerLabel: string;
  /** What a block's height means. */
  scaleNote: string;
  locale: string;
  timeZone: string;
  /** With the episode's position, or `null` when the active one is picked again. */
  onEpisodePick?: (episode: number | null) => void;
  /** `TimelineSummaryMeta`, then `TimelineSummaryEpisode` and `TimelineSummaryMarker` rows. */
  children?: ReactNode;
}) {
  const id = useId();
  const [strip, width] = useWidth<HTMLDivElement>();
  const [hovered, hover] = useState<number | null>(null);
  const edge = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone,
        hourCycle: "h23",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale, timeZone],
  );

  const pick = onEpisodePick ? (episode: number) => onEpisodePick(episode === active ? null : episode) : undefined;
  const place: Place = { active, hovered, hover, pick };

  const blocks = useMemo(() => {
    const spanMs = Math.max(1, bounds.end - bounds.start);
    // Per minute and at least one, so a burst inside a single bucket is not infinitely steep.
    const rateOf = (e: TimelineEpisode) => e.total / Math.max(MINUTE, e.end - e.start);
    const peak = Math.max(Number.MIN_VALUE, ...episodes.map(rateOf));
    let lastLabel = -Infinity;
    const drawn = [];
    for (const [i, episode] of episodes.entries()) {
      const w = Math.max(MIN_PX, ((episode.end - episode.start) / spanMs) * width);
      const left = Math.min(Math.max(0, ((episode.start - bounds.start) / spanMs) * width), width - w);
      const centre = left + w / 2;
      const empty = episode.total === 0;
      const labelled = !empty && centre - lastLabel >= LABEL_PX;
      if (labelled) {
        lastLabel = centre;
      }
      const height = LOW_PX + (HIGH_PX - LOW_PX) * Math.sqrt(rateOf(episode) / peak);
      const duration = Math.max(1, episode.end - episode.start);
      drawn.push({
        left,
        width: w,
        height,
        empty,
        labelled,
        stretches: episode.stretches.map((s) => ({
          tone: s.tone,
          left: `${((s.start - episode.start) / duration) * 100}%`,
          width: `${((s.end - s.start) / duration) * 100}%`,
        })),
        key: `${episode.start}-${i}`,
      });
    }
    return drawn;
  }, [episodes, bounds, width]);

  const slots = Children.toArray(children).filter(isValidElement);
  const meta = slots.find((c) => c.type === TimelineSummaryMeta);
  const rows = slots.filter((c) => c.type !== TimelineSummaryMeta);

  return (
    <section className="di-tsummary" aria-labelledby={`${id}-title`}>
      <div className="di-tsummary-head">
        <span id={`${id}-title`} className="di-tsummary-title">
          {title}
        </span>
        {meta}
      </div>

      <div className="di-tsummary-figure" role="img" aria-label={label}>
        <div ref={strip} className="di-tsummary-strip" aria-hidden>
          <span className="di-tsummary-track" />
          {width > 0
            ? blocks.map((block, i) =>
                block.empty ? null : (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- a pointer shortcut on the drawing; each episode is a button in the rows below
                  <span
                    key={block.key}
                    className={cx(
                      "di-tsummary-block",
                      i === active && "is-active",
                      i === hovered && "is-hovered",
                      pick && "is-pickable",
                    )}
                    style={{ left: block.left, width: block.width }}
                    onPointerEnter={() => hover(i)}
                    onPointerLeave={() => hover(null)}
                    onClick={pick ? () => pick(i) : undefined}
                  >
                    {block.labelled ? <span className="di-tsummary-block-index">{ordinal(i)}</span> : null}
                    <span className="di-tsummary-block-fill" style={{ height: block.height }}>
                      {block.stretches.map((stretch) => (
                        <span
                          key={stretch.left}
                          className={`di-tsummary-stretch is-${stretch.tone}`}
                          style={{ left: stretch.left, width: stretch.width }}
                        />
                      ))}
                    </span>
                  </span>
                ),
              )
            : null}
          {width > 0
            ? markers.map((marker) => {
                const x = ((marker.at - bounds.start) / Math.max(1, bounds.end - bounds.start)) * width;
                return x >= 0 && x <= width ? (
                  <span
                    key={`${marker.at}-${marker.label}`}
                    className="di-tsummary-flag"
                    style={{ left: x }}
                    title={marker.label}
                  />
                ) : null;
              })
            : null}
        </div>
        <div className="di-tsummary-edges" aria-hidden>
          <span>{edge.format(bounds.start)}</span>
          <span>{edge.format(bounds.end)}</span>
        </div>
        <div className="di-tsummary-legend" aria-hidden>
          {TONES.map((tone) => (
            <span key={tone} className="di-tsummary-legend-item">
              <span className={`di-tsummary-swatch is-${tone}`} />
              {toneLabels[tone]}
            </span>
          ))}
          {markers.length > 0 ? (
            <span className="di-tsummary-legend-item">
              <span className="di-tsummary-legend-flag" />
              {markerLabel}
            </span>
          ) : null}
          <span className="di-tsummary-legend-note">{scaleNote}</span>
        </div>
      </div>

      <SummaryPlace.Provider value={place}>
        <ol className="di-tsummary-list" aria-label={listLabel}>
          {rows}
        </ol>
      </SummaryPlace.Provider>
    </section>
  );
}

/** Beside the title: how much there is, and over how long. Announced as it changes. */
export function TimelineSummaryMeta({ children }: { children: ReactNode }) {
  return (
    <div className="di-tsummary-meta" aria-live="polite">
      {children}
    </div>
  );
}

/**
 * One episode as a row: its ordinal, what it was in a line of prose, its
 * severest tone as a `SeverityMark` in a column of its own (in every row,
 * so a row without one is never mistaken for unrated), and the slots
 * `TimelineSummaryTime` and `TimelineSummaryDetail`. A button when the
 * summary takes a pick.
 */
export function TimelineSummaryEpisode({
  episode,
  tone,
  toneLabel,
  title,
  children,
}: {
  /** Its position in the summary's `episodes`, so the row and its block light up together. */
  episode: number;
  tone: TimelineTone;
  toneLabel: string;
  title: string;
  /** `TimelineSummaryTime` and `TimelineSummaryDetail`. */
  children?: ReactNode;
}) {
  const place = useContext(SummaryPlace);
  const active = place?.active === episode;
  const className = cx(
    "di-row",
    "di-tsummary-row",
    active && "is-active di-row-current",
    place?.hovered === episode && "is-hovered",
  );
  const body = (
    <>
      <span className="di-ordinal di-tsummary-index">{ordinal(episode)}</span>
      <span className="di-tsummary-tone">
        <SeverityMark level={SEVERITY[tone]} label={toneLabel} />
      </span>
      <span className="di-tsummary-row-title">{title}</span>
      {children}
    </>
  );
  const follow = {
    onPointerEnter: () => place?.hover(episode),
    onPointerLeave: () => place?.hover(null),
  };
  return (
    <li className="di-tsummary-item">
      {place?.pick ? (
        <button
          type="button"
          className={className}
          aria-pressed={active}
          onClick={() => place.pick?.(episode)}
          onFocus={() => place.hover(episode)}
          onBlur={() => place.hover(null)}
          {...follow}
        >
          {body}
        </button>
      ) : (
        <div className={className} {...follow}>
          {body}
        </div>
      )}
    </li>
  );
}

/** Something that happened to the record between the episodes: opened, assigned, closed. */
export function TimelineSummaryMarker({
  label,
  children,
}: {
  label: string;
  /** `TimelineSummaryTime`. */
  children?: ReactNode;
}) {
  return (
    <li className="di-tsummary-item di-tsummary-note">
      <span className="di-tsummary-note-flag" aria-hidden />
      {children}
      <span className="di-tsummary-note-label">{label}</span>
    </li>
  );
}

/** When a row happened, in the mono track. */
export function TimelineSummaryTime({ children }: { children: ReactNode }) {
  return <span className="di-tsummary-time">{children}</span>;
}

/** What a row holds, measured: a count, a duration, the busiest lane. */
export function TimelineSummaryDetail({ children }: { children: ReactNode }) {
  return <span className="di-tsummary-detail">{children}</span>;
}
