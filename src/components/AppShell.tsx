import { Children, isValidElement, useState, type ReactNode } from "react";
import { ChevronsUpDown, RefreshCw, ShieldCheck } from "lucide-react";
import logoInverse from "../assets/logo-inverse.svg";
import { cx } from "../cx";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { SealMark } from "./Seal";
import "./AppShell.css";

export type NavItem = {
  id: string;
  label: string;
  /** Where the item goes. With it the item is a link; without, an inert button. */
  href?: string;
  /** A lucide icon. One family, one weight, no fills. */
  icon?: ReactNode;
  code?: string;
  badge?: string;
  badgeTone?: "neutral" | "alert" | "seal";
  /** The gold dot: this section holds something sealed. */
  sealed?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

export type ConsoleChrome = {
  lang: string;
  workspace: string;
  workspaceId: string;
  operator: { initials: string; name: string; role: string };
  accountLabel: string;
  navLabel: string;
  skipLabel: string;
  groups: NavGroup[];
  demoOff: string;
  demoOn: string;
  demoBanner: string;
  refresh: string;
  sealed: string;
  sealedMark: string;
  runtime: string;
  version: string;
};

/**
 * Rail, topbar, workpane, full-bleed: the shell a product renders.
 *
 * The navy rail is the one place the brand colour fills a surface, and it
 * is fixed: navigation that hides itself cannot be audited. On a narrow
 * screen it moves above the page rather than away.
 *
 * Every part is a slot: `AppShellRail` (with `AppShellFoot` inside it),
 * then `AppShellMain` holding `AppShellBar` and `AppShellContent`. The
 * shell draws no copy of its own; what the bar says is the product's.
 */
export function AppShell({ skipLabel, children }: { skipLabel: string; children: ReactNode }) {
  return (
    <div className="di-shell">
      <a className="di-skip" href="#di-content">
        {skipLabel}
      </a>
      {children}
    </div>
  );
}

/**
 * The navy rail: the mark, the workspace, the sections. Its children sit
 * below the brand in `AppShellContext`, or at the foot in `AppShellFoot`.
 */
export function AppShellRail({
  workspace,
  workspaceId,
  navLabel,
  groups,
  active,
  sealedMark = "",
  children,
}: {
  workspace: string;
  /** The instance, in the mono track beside the workspace. */
  workspaceId: string;
  navLabel: string;
  groups: NavGroup[];
  /** The `id` of the current section. */
  active: string;
  /** What a screen reader hears for an item's seal. Needed once any item is `sealed`. */
  sealedMark?: string;
  children?: ReactNode;
}) {
  // Pick the named context slot before navigation in DOM order, so visual and
  // keyboard order agree. Other children keep their existing footer placement.
  const context: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === AppShellContext) context.push(child);
    else foot.push(child);
  });
  return (
    <aside className="di-sidebar">
      <div className="di-brand">
        <img className="di-brand-logo" src={logoInverse} alt="datAInsights" />
        <div className="di-brand-row">
          <span className="di-brand-product">{workspace}</span>
          <span className="di-instance">{workspaceId}</span>
        </div>
      </div>

      {context}

      <nav className="di-nav" aria-label={navLabel}>
        {groups.map((group) => (
          <RailGroup key={group.label} group={group} active={active} sealedMark={sealedMark} />
        ))}
      </nav>

      {foot}
    </aside>
  );
}

/** Persistent context controls below the brand and before navigation. */
export function AppShellContext({ children }: { children: ReactNode }) {
  return <div className="di-sidebar-context">{children}</div>;
}

/** The rail's foot: the runtime and the version, in the mono track. */
export function AppShellFoot({ children }: { children: ReactNode }) {
  return <div className="di-sidebar-foot">{children}</div>;
}

/** The column beside the rail: the bar over the content. */
export function AppShellMain({ children }: { children: ReactNode }) {
  return <div className="di-main">{children}</div>;
}

/** The topbar: where you are on the left, an `AppShellBarEnd` on the right. */
export function AppShellBar({ children }: { children: ReactNode }) {
  return <header className="di-topbar">{children}</header>;
}

/** The bar's controls, pushed to its right end. */
export function AppShellBarEnd({ children }: { children: ReactNode }) {
  return <div className="di-top-actions">{children}</div>;
}

/**
 * The page. The skip link lands here.
 *
 * `contained` stops widening at 1440px. `full` follows the window, for a
 * console whose registers and charts use every column they are given.
 */
export function AppShellContent({
  width = "contained",
  children,
}: {
  width?: "contained" | "full";
  children: ReactNode;
}) {
  return (
    <main id="di-content" className={cx("di-content", width === "full" && "is-full")} tabIndex={-1}>
      {children}
    </main>
  );
}

/**
 * The canvas and the window. The dotted ground is what a console sits
 * on in these stories; a product renders `AppShell` alone, full-bleed.
 */
export function ConsoleFrame({
  title,
  lang,
  children,
}: {
  title: string;
  lang: string;
  children: ReactNode;
}) {
  return (
    <div className="di-canvas" lang={lang}>
      <p className="di-window-title">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <rect x="1" y="1" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 4.5h12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {title}
      </p>
      <div className="di-window">{children}</div>
    </div>
  );
}

/**
 * The shell inside its window, with the sample chrome the screens share:
 * an operator, a demo-data switch, a refresh and the sealed mark. It is
 * how these stories show a console; a product composes `AppShell` itself.
 */
export function Console({
  title,
  crumb,
  active,
  chrome,
  children,
}: {
  title: string;
  crumb: string[];
  active: string;
  chrome: ConsoleChrome;
  children: ReactNode;
}) {
  const [demo, setDemo] = useState(false);

  return (
    <ConsoleFrame title={title} lang={chrome.lang}>
      <AppShell skipLabel={chrome.skipLabel}>
        <AppShellRail
          workspace={chrome.workspace}
          workspaceId={chrome.workspaceId}
          navLabel={chrome.navLabel}
          groups={chrome.groups}
          active={active}
          sealedMark={chrome.sealedMark}
        >
          <AppShellFoot>
            <span>{chrome.runtime}</span>
            <span>{chrome.version}</span>
          </AppShellFoot>
          <button type="button" className="di-operator" aria-label={chrome.accountLabel}>
            <span className="di-avatar" aria-hidden>
              {chrome.operator.initials}
            </span>
            <span className="di-operator-text">
              <span className="di-operator-name">{chrome.operator.name}</span>
              <span className="di-operator-role">{chrome.operator.role}</span>
            </span>
            <ChevronsUpDown className="di-operator-caret" aria-hidden />
          </button>
        </AppShellRail>

        <AppShellMain>
          <AppShellBar>
            <p className="di-crumb">
              {crumb.map((part, index) => (
                <span key={part} className="di-crumb-part">
                  {index > 0 ? <span className="di-crumb-sep">/</span> : null}
                  <span className={index === crumb.length - 1 ? "di-crumb-current" : undefined}>{part}</span>
                </span>
              ))}
            </p>
            <AppShellBarEnd>
              <button
                type="button"
                className="di-demo"
                aria-pressed={demo}
                onClick={() => setDemo((value) => !value)}
              >
                <span className="di-demo-dot" aria-hidden />
                {demo ? chrome.demoOn : chrome.demoOff}
              </button>
              <Button variant="ghost" size="dense">
                <RefreshCw aria-hidden />
                {chrome.refresh}
              </Button>
              <span className="di-sealed">
                <ShieldCheck aria-hidden />
                {chrome.sealed}
              </span>
            </AppShellBarEnd>
          </AppShellBar>
          {demo ? (
            <p className="di-demo-banner" role="status">
              {chrome.demoBanner}
            </p>
          ) : null}
          <AppShellContent>{children}</AppShellContent>
        </AppShellMain>
      </AppShell>
    </ConsoleFrame>
  );
}

function RailGroup({ group, active, sealedMark }: { group: NavGroup; active: string; sealedMark: string }) {
  const labelId = `nav-${group.label.toLowerCase()}`;
  return (
    <div className="di-nav-group">
      <div className="di-nav-label" id={labelId}>
        {group.label}
      </div>
      <ul className="di-nav-list" aria-labelledby={labelId}>
        {group.items.map((item) => (
          <li key={item.id}>
            <RailItem item={item} current={item.id === active} sealedMark={sealedMark} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RailItem({ item, current, sealedMark }: { item: NavItem; current: boolean; sealedMark: string }) {
  const body = (
    <>
      {item.icon ? <span className="di-nav-icon">{item.icon}</span> : null}
      <span className="di-nav-text">{item.label}</span>
      {item.badge ? (
        <Badge tone={item.badgeTone}>{item.badge}</Badge>
      ) : item.code ? (
        <span className="di-nav-code">{item.code}</span>
      ) : null}
      {item.sealed ? (
        <>
          <SealMark state="sealed" />
          <span className="di-sr">{sealedMark}</span>
        </>
      ) : null}
    </>
  );
  const ariaCurrent = current ? "page" : undefined;

  return item.href !== undefined ? (
    <a className="di-nav-btn" href={item.href} aria-current={ariaCurrent}>
      {body}
    </a>
  ) : (
    <button type="button" className="di-nav-btn" aria-current={ariaCurrent}>
      {body}
    </button>
  );
}
