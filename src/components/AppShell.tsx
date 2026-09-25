import { useState, type ReactNode } from "react";
import { ChevronsUpDown, RefreshCw, ShieldCheck } from "lucide-react";
import logoInverse from "../assets/logo-inverse.svg";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { SealMark } from "./Seal";
import "./AppShell.css";

export type NavItem = {
  id: string;
  label: string;
  /** A lucide icon. One family, one weight, no fills. */
  icon?: ReactNode;
  code?: string;
  badge?: string;
  badgeTone?: "neutral" | "alert" | "seal";
  /** The gold dot: this section holds something sealed. */
  sealed?: boolean;
};

export type ConsoleChrome = {
  lang: string;
  workspace: string;
  workspaceId: string;
  operator: { initials: string; name: string; role: string };
  accountLabel: string;
  navLabel: string;
  skipLabel: string;
  groups: { label: string; items: NavItem[] }[];
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
 * The canvas and the window. The dotted ground is what a console sits
 * on in these stories; a product renders the window alone, full-bleed.
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
 * Rail, topbar, workpane. The navy rail is the one place the brand
 * colour fills a surface, and it is fixed: navigation that hides itself
 * cannot be audited.
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
      <a className="di-skip" href="#di-content">
        {chrome.skipLabel}
      </a>
      <aside className="di-sidebar">
        <div className="di-brand">
          <img className="di-brand-logo" src={logoInverse} alt="datAInsights" />
          <div className="di-brand-row">
            <span className="di-brand-product">{chrome.workspace}</span>
            <span className="di-instance">{chrome.workspaceId}</span>
          </div>
        </div>

        <nav className="di-nav" aria-label={chrome.navLabel}>
          {chrome.groups.map((group) => (
            <NavGroup
              key={group.label}
              label={group.label}
              items={group.items}
              active={active}
              sealedMark={chrome.sealedMark}
            />
          ))}
        </nav>

        <div className="di-sidebar-foot">
          <span>{chrome.runtime}</span>
          <span>{chrome.version}</span>
        </div>

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
      </aside>

      <div className="di-main">
        <header className="di-topbar">
          <p className="di-crumb">
            {crumb.map((part, index) => (
              <span key={part} className="di-crumb-part">
                {index > 0 ? <span className="di-crumb-sep">/</span> : null}
                <span className={index === crumb.length - 1 ? "di-crumb-current" : undefined}>{part}</span>
              </span>
            ))}
          </p>
          <div className="di-top-actions">
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
          </div>
        </header>
        {demo ? (
          <p className="di-demo-banner" role="status">
            {chrome.demoBanner}
          </p>
        ) : null}
        <main id="di-content" className="di-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </ConsoleFrame>
  );
}

function NavGroup({
  label,
  items,
  active,
  sealedMark,
}: {
  label: string;
  items: NavItem[];
  active: string;
  sealedMark: string;
}) {
  const labelId = `nav-${label.toLowerCase()}`;
  return (
    <div className="di-nav-group">
      <div className="di-nav-label" id={labelId}>
        {label}
      </div>
      <ul className="di-nav-list" aria-labelledby={labelId}>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="di-nav-btn" aria-current={item.id === active ? "page" : undefined}>
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
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
