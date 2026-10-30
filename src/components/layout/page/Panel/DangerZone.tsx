import type { ReactNode } from "react";
import { Panel, PanelLead } from "./Panel";

/**
 * The end of a detail page: what cannot be taken back.
 *
 * @deprecated Removed in 0.12.0. Use `<Panel tone="danger" title heading={2}>`
 * with the lede as `PanelLead` and one `DangerAction` per action; it draws
 * the same danger edge on the one surface.
 */
export function DangerZone({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  /** One or more `DangerAction`s. */
  children: ReactNode;
}) {
  return (
    <Panel tone="danger" title={title} heading={2}>
      {lede ? <PanelLead>{lede}</PanelLead> : null}
      {children}
    </Panel>
  );
}
