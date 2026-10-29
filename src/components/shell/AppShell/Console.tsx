import { useState, type ReactNode } from "react";
import { ChevronsUpDown, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "../../actions/Button";
import { AppShell, AppShellMain, AppShellBar, AppShellBarEnd, AppShellContent } from "./AppShell";
import { type NavGroup, AppShellRail, AppShellFoot } from "./AppShellRail";
import "./AppShell.css";

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
