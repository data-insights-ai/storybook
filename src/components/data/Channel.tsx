import type { ReactNode } from "react";
import "./Channel.css";

/**
 * An endpoint on record: what it is, whether it is running, and the
 * value it resolves to.
 *
 * `title` is text, so it is a prop. Everything else can hold a pill, an
 * icon, a sealed value or a list, so it is a slot: write the slots in
 * this order, the way a `Notice` is written.
 */
export function Channel({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <article className="di-channel">
      <header className="di-channel-head">
        <span className="di-channel-title">{title}</span>
      </header>
      {children}
    </article>
  );
}

/** The state pill, on the title line. */
export function ChannelStatus({ children }: { children: ReactNode }) {
  return <div className="di-channel-status">{children}</div>;
}

/** What the channel resolves to: an address, a hash, a figure. */
export function ChannelValue({ children }: { children: ReactNode }) {
  return <div className="di-channel-value">{children}</div>;
}

/** The terms behind the value, in the mono track. */
export function ChannelSpecs({ children }: { children: ReactNode }) {
  return <div className="di-channel-specs">{children}</div>;
}
