import type { ReactNode } from "react";
import { Split, SplitBack, SplitList, SplitListHead, SplitListItem, SplitListItems, SplitMain } from "../Split";

/**
 * A list beside its open record.
 *
 * @deprecated Removed in 0.12. Use `<Split variant="list" showing>`: `ListDetailList` is `SplitList`,
 * `ListDetailHead` `SplitListHead`, `ListDetailItems` `SplitListItems`, `ListDetailItem` `SplitListItem`,
 * `ListDetailPane` `SplitMain label`, `ListDetailBack` `SplitBack`.
 */
export function ListDetail({ showing = "list", children }: { showing?: "list" | "detail"; children: ReactNode }) {
  return (
    <Split variant="list" showing={showing}>
      {children}
    </Split>
  );
}

/** @deprecated Removed in 0.12. Use `SplitList`. */
export const ListDetailList = SplitList;

/** @deprecated Removed in 0.12. Use `SplitListHead`. */
export const ListDetailHead = SplitListHead;

/** @deprecated Removed in 0.12. Use `SplitListItems`. */
export const ListDetailItems = SplitListItems;

/** @deprecated Removed in 0.12. Use `SplitListItem`. */
export const ListDetailItem = SplitListItem;

/** @deprecated Removed in 0.12. Use `SplitMain` with a `label`. */
export function ListDetailPane({ label, children }: { label: string; children: ReactNode }) {
  return <SplitMain label={label}>{children}</SplitMain>;
}

/** @deprecated Removed in 0.12. Use `SplitBack`. */
export const ListDetailBack = SplitBack;
