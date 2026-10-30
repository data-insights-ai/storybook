import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../../../internal/cx";
import "./Disclosure.css";

type Level = 2 | 3 | 4 | 5 | 6;

/**
 * A group that folds away: the WAI-ARIA disclosure, a button with
 * `aria-expanded` controlling the region under it.
 *
 * `toggle` decides what the button is. `head` makes the whole head the
 * button, set inside a heading: the target is the row a reader is looking
 * at (signals by attack phase, a log by day). `chevron` keeps a separate
 * toggle at the head's end, so a `DisclosureLead` can hold a control, such
 * as the checkbox that chooses the whole group; a button cannot contain a
 * checkbox.
 *
 * The head reads, in order: the `title` (or the `DisclosureLead`), a
 * `DisclosureDetail` under it in the mono track, a `DisclosureMeta` at its
 * end (a count, the worst state), and the chevron. Every other child is the
 * body. The group sits a step below the surface that holds it, at one
 * inset all round; it folds open and shut on its own, and folded content
 * is out of reach of the keyboard and the screen reader.
 *
 * Controlled with `open` and `onOpenChange`, or left to itself with
 * `defaultOpen`. Several go in a `DisclosureGroup`.
 */
export function Disclosure({
  id,
  toggle = "chevron",
  title,
  headingLevel = 3,
  open,
  defaultOpen = false,
  onOpenChange,
  toggleLabel,
  children,
  className,
}: {
  /** The body's id stem; generated when left out. */
  id?: string;
  /** `head`: the whole head is the button. `chevron`: a separate toggle, so the lead can hold a control. */
  toggle?: "head" | "chevron";
  /** The group's name. Needed with `toggle="head"`; with `chevron` a `DisclosureLead` may stand in for it. */
  title?: string;
  /** The level the title takes in the page's outline. */
  headingLevel?: Level;
  /** Open, when the caller holds the state. */
  open?: boolean;
  /** Open at first, when the group holds its own state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The chevron's accessible name with `toggle="chevron"`, such as "Show access events". Defaults to the title. */
  toggleLabel?: string;
  /** The body, and optionally `DisclosureLead`, `DisclosureDetail` and `DisclosureMeta`. */
  children?: ReactNode;
  className?: string;
}) {
  const own = useId();
  const stem = id ?? own;
  const group = useContext(Group);
  const [mine, setMine] = useState(defaultOpen);
  const grouped = group !== null && group.single && open === undefined;
  const isOpen = open ?? (grouped ? group.openId === stem : mine);
  // A group that keeps its own state opens the first child that asks for it.
  useLayoutEffect(() => {
    if (grouped && defaultOpen && group.openId === null) group.setOpenId(stem);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the first render asks
  }, []);
  const set = (next: boolean) => {
    if (open === undefined) {
      if (grouped) group.setOpenId(next ? stem : null);
      else setMine(next);
    }
    onOpenChange?.(next);
  };

  const lead: ReactNode[] = [];
  const detail: ReactNode[] = [];
  const metaSlot: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DisclosureLead) lead.push(child);
    else if (isValidElement(child) && child.type === DisclosureDetail) detail.push(child);
    else if (isValidElement(child) && child.type === DisclosureMeta) metaSlot.push(child);
    else body.push(child);
  });
  const bodyId = `${stem}-body`;
  const titleId = `${stem}-title`;
  const Heading = `h${headingLevel}` as const;
  const named = title !== undefined && (toggle === "head" || lead.length === 0);
  const chevron = <ChevronDown className="di-disclosure-chevron" aria-hidden />;
  const titles =
    title === undefined && detail.length === 0 ? null : (
      <span className="di-disclosure-titles">
        {title === undefined ? null : (
          <span id={titleId} className="di-disclosure-title">
            {title}
          </span>
        )}
        {detail}
      </span>
    );

  return (
    <section className={cx("di-disclosure", isOpen && "is-open", className)} data-toggle={toggle}>
      {toggle === "head" ? (
        <Heading className="di-disclosure-heading">
          <button
            type="button"
            className="di-disclosure-head"
            aria-expanded={isOpen}
            aria-controls={bodyId}
            onClick={() => set(!isOpen)}
          >
            {titles}
            {metaSlot}
            {chevron}
          </button>
        </Heading>
      ) : (
        <div className="di-disclosure-head">
          {lead.length > 0 ? (
            lead
          ) : title === undefined ? (
            titles
          ) : (
            <Heading className="di-disclosure-heading">{titles}</Heading>
          )}
          {metaSlot}
          <button
            type="button"
            className="di-disclosure-toggle"
            aria-expanded={isOpen}
            aria-controls={bodyId}
            aria-label={toggleLabel ?? title}
            onClick={() => set(!isOpen)}
          >
            {chevron}
          </button>
        </div>
      )}
      {/* Kept mounted while folded, so the fold runs both ways; CSS takes it out of reach once folded. */}
      <div
        id={bodyId}
        className="di-disclosure-fold"
        role={named ? "region" : undefined}
        aria-labelledby={named ? titleId : undefined}
      >
        <div className="di-disclosure-clip">
          <div className="di-disclosure-body">{body}</div>
        </div>
      </div>
    </section>
  );
}

/** What heads a `toggle="chevron"` group in place of its title: a heading, or the box that chooses all of it. */
export function DisclosureLead({ children }: { children: ReactNode }) {
  return <div className="di-disclosure-lead">{children}</div>;
}

/** Under the title, in the mono track: a code, a time range. */
export function DisclosureDetail({ children }: { children: ReactNode }) {
  return <span className="di-disclosure-detail">{children}</span>;
}

/** At the head's end: how much the group holds and its worst state, such as a `StatusPill` and a count. */
export function DisclosureMeta({ children }: { children: ReactNode }) {
  return <span className="di-disclosure-meta">{children}</span>;
}

const Group = createContext<{ single: boolean; openId: string | null; setOpenId: (id: string | null) => void } | null>(
  null,
);

/**
 * Several `Disclosure`s read as one list, a step apart. With `single`,
 * opening one folds the one that was open; that holds for groups that keep
 * their own state, and a caller holding `open` decides for itself.
 */
export function DisclosureGroup({
  label,
  single = false,
  className,
  children,
}: {
  /** The accessible name of the list, such as "Signals by attack phase". */
  label: string;
  /** At most one open at a time. */
  single?: boolean;
  className?: string;
  /** `Disclosure`s. */
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <Group.Provider value={{ single, openId, setOpenId }}>
      <div role="group" aria-label={label} className={cx("di-disclosure-group", className)}>
        {children}
      </div>
    </Group.Provider>
  );
}
