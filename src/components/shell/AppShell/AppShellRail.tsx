import { Children, isValidElement, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import logo from "../../../assets/logo.svg";
import logoInverse from "../../../assets/logo-inverse.svg";
import { cx } from "../../../internal/cx";
import { Badge } from "../../marks/Badge";
import { SealMark } from "../../marks/SealValue";
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
  mobileNavigation,
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
  /** Opt into a compact mobile header and native modal navigation. */
  mobileNavigation?: {
    openLabel: string;
    closeLabel: string;
    /** Actual selected-context identity; do not pass a lease or display label. */
    contextKey?: string;
  };
  children?: ReactNode;
}) {
  const narrow = useSyncExternalStore(subscribeNarrowRail, narrowRail, () => false);
  const mobile = !!mobileNavigation && narrow;
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  useLayoutEffect(() => { setOpen(false); }, [active, workspaceId, mobileNavigation?.contextKey]);
  useLayoutEffect(() => {
    if (!mobile && open) {
      setOpen(false);
      document.getElementById("di-content")?.focus();
    }
  }, [mobile, open]);
  // Pick the named context slot before navigation in DOM order, so visual and
  // keyboard order agree. Other children keep their existing footer placement.
  const context: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === AppShellContext) context.push(child);
    else foot.push(child);
  });
  return (
    <aside className={cx("di-sidebar", mobile && "di-sidebar-mobile")}>
      <div className="di-sidebar-header">
        <div className="di-brand">
          <img className="di-brand-logo di-brand-day" src={logo} alt="datAInsights" />
          <img className="di-brand-logo di-brand-night" src={logoInverse} alt="datAInsights" />
          <div className="di-brand-row">
            <span className="di-brand-product">{workspace}</span>
            <span className="di-instance">{workspaceId}</span>
          </div>
        </div>
        {mobile && (
          <button type="button" className="di-rail-toggle" aria-expanded={open} aria-controls={dialogId} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            <MenuIcon aria-hidden />{mobileNavigation.openLabel}
          </button>
        )}
      </div>
      <RailNavigation mobile={mobile} open={open} close={() => setOpen(false)} id={dialogId} label={navLabel} closeLabel={mobileNavigation?.closeLabel ?? ""}>
        {context}
        <nav className="di-nav" aria-label={navLabel} onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a[href]") && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setOpen(false);
        }}>
          {groups.map((group) => (
            <RailGroup key={group.label} group={group} active={active} sealedMark={sealedMark} />
          ))}
        </nav>
        {foot}
      </RailNavigation>
    </aside>
  );
}

function narrowRail() { return window.matchMedia("(max-width: 900px)").matches; }

function subscribeNarrowRail(changed: () => void) {
  const media = window.matchMedia("(max-width: 900px)");
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
}

/** One copy of the context/footer stays mounted when the mobile dialog closes.
 * Only crossing the desktop breakpoint changes its containing element. */
function RailNavigation({ mobile, open, close, id, label, closeLabel, children }: {
  mobile: boolean; open: boolean; close: () => void; id: string; label: string; closeLabel: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [mobile, open]);
  if (!mobile) return <div className="di-rail-content">{children}</div>;
  return <dialog ref={ref} id={id} className="di-rail-dialog" aria-label={label} onCancel={close} onClose={(event) => { if (!event.currentTarget.open) close(); }}
    onPointerDown={(event) => { pressedBackdrop.current = railBackdrop(event); }}
    onClick={(event) => {
      if (pressedBackdrop.current && railBackdrop(event)) close();
      pressedBackdrop.current = false;
    }}>
    <div className="di-rail-dialog-heading">
      <span>{label}</span>
      <button type="button" className="di-rail-toggle" onClick={close}><X aria-hidden />{closeLabel}</button>
    </div>
    <div className="di-rail-content">{children}</div>
  </dialog>;
}

function railBackdrop(event: { target: EventTarget; currentTarget: HTMLDialogElement; clientX: number; clientY: number }) {
  const bounds = event.currentTarget.getBoundingClientRect();
  return event.target === event.currentTarget && (
    event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom
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
