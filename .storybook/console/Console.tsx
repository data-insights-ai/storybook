import { useState, type ReactNode } from "react";
import { ChevronsUpDown, RefreshCw, ShieldCheck } from "lucide-react";
import {
  AppShell,
  AppShellBar,
  AppShellBarEnd,
  AppShellContent,
  AppShellFoot,
  AppShellMain,
  AppShellRail,
  Button,
  type NavGroup,
} from "../../src";
import "./Console.css";

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
export function ConsoleFrame({ title, lang, children }: { title: string; lang: string; children: ReactNode }) {
  return (
    <div className="sb-canvas" lang={lang}>
      <p className="sb-window-title">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <rect x="1" y="1" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 4.5h12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        {title}
      </p>
      <div className="sb-window">{children}</div>
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
          <button type="button" className="sb-operator" aria-label={chrome.accountLabel}>
            <span className="sb-avatar" aria-hidden>
              {chrome.operator.initials}
            </span>
            <span className="sb-operator-text">
              <span className="sb-operator-name">{chrome.operator.name}</span>
              <span className="sb-operator-role">{chrome.operator.role}</span>
            </span>
            <ChevronsUpDown className="sb-operator-caret" aria-hidden />
          </button>
        </AppShellRail>

        <AppShellMain>
          <AppShellBar>
            <p className="sb-crumb">
              {crumb.map((part, index) => (
                <span key={part} className="sb-crumb-part">
                  {index > 0 ? <span className="sb-crumb-sep">/</span> : null}
                  <span className={index === crumb.length - 1 ? "sb-crumb-current" : undefined}>{part}</span>
                </span>
              ))}
            </p>
            <AppShellBarEnd moreLabel="More">
              <button type="button" className="sb-demo" aria-pressed={demo} onClick={() => setDemo((value) => !value)}>
                <span className="sb-demo-dot" aria-hidden />
                {demo ? chrome.demoOn : chrome.demoOff}
              </button>
              <Button variant="ghost" size="dense">
                <RefreshCw aria-hidden />
                {chrome.refresh}
              </Button>
              <span className="sb-sealed">
                <ShieldCheck aria-hidden />
                {chrome.sealed}
              </span>
            </AppShellBarEnd>
          </AppShellBar>
          {demo ? (
            <p className="sb-demo-banner" role="status">
              {chrome.demoBanner}
            </p>
          ) : null}
          <AppShellContent>{children}</AppShellContent>
        </AppShellMain>
      </AppShell>
    </ConsoleFrame>
  );
}
