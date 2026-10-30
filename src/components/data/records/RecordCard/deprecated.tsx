import type { ReactNode } from "react";
import { StatusPill } from "../../../marks/status/StatusPill";
import {
  RecordActions,
  RecordBasis,
  RecordBody,
  RecordCard,
  RecordDetail,
  RecordInsight,
  RecordMark,
  RecordStatus,
  RecordValue,
} from "./RecordCard";

/** @deprecated Use `RecordCard` with `<RecordStatus><StatusPill tone="inferred">`; removed in 0.12.0. */
export function LivingCard({
  title,
  insightLabel,
  className,
  children,
}: {
  title: string;
  insightLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <RecordCard title={title} heading={false} className={className}>
      <RecordStatus>
        <StatusPill tone="inferred">{insightLabel}</StatusPill>
      </RecordStatus>
      {children}
    </RecordCard>
  );
}

/** @deprecated Use `RecordActions`; removed in 0.12.0. */
export const LivingActions = RecordActions;
/** @deprecated Use `RecordBody`; removed in 0.12.0. */
export const LivingBody = RecordBody;
/** @deprecated Use `RecordInsight`; removed in 0.12.0. */
export const LivingInsight = RecordInsight;
/** @deprecated Use `RecordBasis`; removed in 0.12.0. */
export const LivingBasis = RecordBasis;

/** @deprecated Use `RecordCard layout="row" heading={false}`; removed in 0.12.0. */
export function Session({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <RecordCard title={name} layout="row" heading={false}>
      {children}
    </RecordCard>
  );
}

/** @deprecated Use `RecordDetail`; removed in 0.12.0. */
export const SessionDetail = RecordDetail;
/** @deprecated Use `RecordMark`; removed in 0.12.0. */
export const SessionMark = RecordMark;
/** @deprecated Use `RecordStatus`; removed in 0.12.0. */
export const SessionTag = RecordStatus;
/** @deprecated Use `RecordActions`; removed in 0.12.0. */
export const SessionAction = RecordActions;

/** @deprecated Use `RecordCard heading={false}` with `RecordValue` and a `FactList layout="pairs"`; removed in 0.12.0. */
export function Channel({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <RecordCard title={title} heading={false}>
      {children}
    </RecordCard>
  );
}

/** @deprecated Use `RecordStatus`; removed in 0.12.0. */
export const ChannelStatus = RecordStatus;
/** @deprecated Use `RecordValue`; removed in 0.12.0. */
export const ChannelValue = RecordValue;
/** @deprecated Put a `FactList layout="pairs"` in the `RecordCard` directly; removed in 0.12.0. */
export function ChannelSpecs({ children }: { children: ReactNode }) {
  return <div className="di-record-specs">{children}</div>;
}
