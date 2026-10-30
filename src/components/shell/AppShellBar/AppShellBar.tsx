import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { Ellipsis } from "lucide-react";
import { takeSlot } from "../../../internal/slots";
import { useOverlayHost } from "../../../internal/useOverlayHost";
import { Button } from "../../actions/Button";
import "./AppShellBar.css";

/**
 * The bar over the page, one row at every width.
 *
 * - **Use it** once, as the first child of `SidebarInset`: the
 *   `SidebarTrigger`, where the reader is (a `Breadcrumb`, or the page's
 *   name), then an `AppShellBarEnd` with the app-wide controls and status.
 * - **Not** for a page's own actions (`PageHeader` and its aside) or for a
 *   list's filters (`Toolbar`).
 *
 * The start holds the trigger and the page's name, which truncates before
 * it wraps. The end never wraps either: when its items do not fit beside a
 * readable name (a phone, a long German status), they fold into one
 * overflow button that opens them in a panel; what sits in `AppShellBarKeep`
 * stays in the bar. The bar is `--di-shell-bar-height` tall in both densities.
 */
export function AppShellBar({ children }: { children: ReactNode }) {
  const [end, rest] = takeSlot(children, AppShellBarEnd);
  return (
    <header className="di-topbar">
      <div className="di-topbar-start">{rest}</div>
      {end}
    </header>
  );
}

/**
 * The bar's end: app-wide controls and status ("Demo data off", a refresh,
 * the sealed state). They fold into one overflow button when the bar is too
 * narrow; `moreLabel` names that button, such as "More" or "Weitere".
 * Controls whose point would be lost in the overflow go in `AppShellBarKeep`.
 */
export function AppShellBarEnd({ moreLabel, children }: { moreLabel: string; children: ReactNode }) {
  const [keep, items] = takeSlot(children, AppShellBarKeep);
  const inline = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const needed = useRef(0);
  const [folded, setFolded] = useState(false);
  const [open, setOpen] = useState(false);
  const { host, update } = useOverlayHost(anchor, open);
  const foldable = items.some((item) => item !== null && item !== undefined && item !== false);

  useLayoutEffect(() => {
    const group = inline.current ?? anchor.current;
    const bar = group?.closest<HTMLElement>(".di-topbar");
    const start = bar?.querySelector<HTMLElement>(":scope > .di-topbar-start");
    const end = group?.parentElement;
    if (!bar || !start || !end) return;
    const measure = () => {
      const style = getComputedStyle(bar);
      const gap = parseFloat(style.columnGap);
      const kept = Array.from(end.children)
        .filter((child) => child !== group)
        .reduce(
          (sum, child) => sum + child.getBoundingClientRect().width + parseFloat(getComputedStyle(end).columnGap),
          0,
        );
      const room =
        bar.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        gap -
        kept -
        parseFloat(style.getPropertyValue("--di-shell-bar-start-min"));
      if (inline.current) needed.current = inline.current.scrollWidth;
      setFolded(needed.current > room);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    if (inline.current) observer.observe(inline.current);
    return () => observer.disconnect();
  }, [folded]);

  const fold = !foldable ? null : !folded ? (
    <div ref={inline} className="di-top-fold">
      {items}
    </div>
  ) : (
    <div ref={anchor} className="di-top-fold">
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (next) update();
          setOpen(next);
        }}
      >
        <Popover.Trigger
          render={
            <Button variant="ghost" size="sm" iconOnly aria-label={moreLabel}>
              <Ellipsis aria-hidden />
            </Button>
          }
        />
        <Popover.Portal container={host.container}>
          <Popover.Positioner
            data-theme={host.theme}
            side="bottom"
            align="end"
            sideOffset={4}
            className="di-topbar-more-positioner"
          >
            <Popover.Popup className="di-topbar-more" aria-label={moreLabel}>
              {items}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );

  return (
    <div className="di-top-actions">
      {fold}
      {keep}
    </div>
  );
}

/**
 * What stays in the bar at every width, after the overflow button: a control
 * whose point is what it shows, such as the notification bell with its
 * unread count, or the account menu. Keep it to one or two controls; status
 * words and refreshes fold.
 */
export function AppShellBarKeep({ children }: { children: ReactNode }) {
  return <div className="di-top-keep">{children}</div>;
}
