import { Children, isValidElement, useLayoutEffect, useState, type ReactNode } from "react";
import { PageSide } from "../pageSide";
import "./Page.css";

/**
 * One console page: its header, then what the page holds, in the console
 * rhythm. `width` is what the page holds:
 *
 * - `list` and `detail` (a list, a record or settings with sections) share
 *   one frame. Where the page is 1280px or wider it keeps a side column at
 *   the triage rail's width (`--di-rail-width`) on the right and the content
 *   takes the rest, so a table never runs across the whole window. The
 *   column holds the record's `PageAside` and every `Sheet` the page opens
 *   (a row's detail, a create or edit form); otherwise it stays empty. It
 *   starts level with the content, below the header and the page's tabs.
 *   Narrower, the content takes the whole width and a sheet covers it.
 * - `full` is an overview or dashboard: the whole frame, no side column.
 * - `form` is a create flow read down one column (`--di-measure-form`).
 *
 * Header to content is `--di-rhythm-header`, section to section
 * `--di-rhythm-section`. The blocks inside carry no margin of their own.
 */
export function Page({
  width = "list",
  children,
}: {
  width?: "list" | "detail" | "full" | "form";
  /** `PageHeader`, then the page's blocks; in a `list` or `detail` page optionally one `PageAside`. */
  children: ReactNode;
}) {
  const [page, setPage] = useState<HTMLDivElement | null>(null);
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const [side, setSide] = useState<HTMLDivElement | null>(null);
  const framed = width === "list" || width === "detail";
  const wide = useWideFrame(page);
  useContentTop(page, body, wide);
  if (!framed) {
    return (
      <div className="di-page" data-width={width}>
        {children}
      </div>
    );
  }
  /*
   * The aside is picked out of `children` by type. The rest stays wrapped
   * whether the side column shows or not, so a list keeps its scroll and
   * focus when the window changes.
   */
  const aside: ReactNode[] = [];
  const content: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === PageAside) aside.push(child);
    else content.push(child);
  });
  return (
    <div ref={setPage} className="di-page" data-width={width} data-frame={wide ? "side" : undefined}>
      <PageSide.Provider value={wide ? side : null}>
        <div ref={setBody} className="di-page-body">
          {content}
        </div>
      </PageSide.Provider>
      <div ref={setSide} className="di-page-side">
        {aside}
      </div>
    </div>
  );
}

/*
 * The page's own width decides, not the window's: a collapsed navigation
 * gives a laptop the room for the side column. From here the content keeps
 * about 940px beside it.
 */
const SIDE_COLUMN_FROM = 1280;

function useWideFrame(page: HTMLElement | null) {
  const [wide, setWide] = useState(false);
  useLayoutEffect(() => {
    if (!page) return;
    const measure = (width: number) => setWide(width >= SIDE_COLUMN_FROM);
    measure(page.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width));
    observer.observe(page);
    return () => observer.disconnect();
  }, [page]);
  return wide;
}

/*
 * Where the side column starts. On a list page, level with the list: the
 * first table after the list's toolbar (or what stands in its place, an
 * empty state), so the column sits beside the table and not beside the
 * filters. Elsewhere, level with the content: after the header and the
 * tabs, which may be drawn by a component of the product's own (a tabbed
 * page), so they are found in the page rather than among its children.
 *
 * Only elements that never stick are measured, so the result holds while
 * the page scrolls. Once it scrolls, the column sticks where the table's
 * head does: under the app bar and the toolbar.
 */
const ABOVE_CONTENT = ".di-page-head, .di-tabs";

function useContentTop(page: HTMLElement | null, body: HTMLElement | null, wide: boolean) {
  useLayoutEffect(() => {
    if (!page || !body || !wide) return;
    const measure = () => {
      const origin = body.getBoundingClientRect().top;
      const toolbar = body.querySelector<HTMLElement>(".di-list-toolbar");
      const list = toolbar ? listAfter(body, toolbar) : null;
      let top: number;
      if (list) {
        top = list.getBoundingClientRect().top - origin;
      } else {
        const last = Array.from(body.children)
          .filter((el) => el.matches(ABOVE_CONTENT))
          .at(-1);
        top = last
          ? last.getBoundingClientRect().bottom -
            origin +
            parseFloat(getComputedStyle(last).marginBottom) +
            parseFloat(getComputedStyle(body).rowGap)
          : 0;
      }
      page.style.setProperty("--di-page-content-top", `${Math.round(top)}px`);
      if (list && toolbar?.dataset.sticky === "true") {
        page.style.setProperty("--di-page-side-stick", `${toolbar.offsetHeight}px`);
      } else {
        page.style.removeProperty("--di-page-side-stick");
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    for (const el of body.querySelectorAll(`:scope > :is(${ABOVE_CONTENT}), .di-list-toolbar`)) observer.observe(el);
    return () => {
      observer.disconnect();
      page.style.removeProperty("--di-page-content-top");
      page.style.removeProperty("--di-page-side-stick");
    };
  }, [page, body, wide]);
}

/** The list a toolbar filters: the first table after it, or the block that follows it while there is none. */
function listAfter(body: HTMLElement, toolbar: HTMLElement): Element | null {
  const table = Array.from(body.querySelectorAll(".di-table-wrap")).find(
    (el) => !el.closest("dialog") && toolbar.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  return table ?? toolbar.nextElementSibling;
}

/** What accompanies the record (triage, related items, next steps): in the side column, or after the sections where there is none. */
export function PageAside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="di-page-companion" aria-label={label}>
      {children}
    </aside>
  );
}
