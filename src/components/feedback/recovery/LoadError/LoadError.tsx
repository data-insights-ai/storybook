import type { ReactNode } from "react";
import { Button } from "../../../actions/Button";
import { CopyValue } from "../../../actions/CopyValue";
import { Toolbar } from "../../../actions/Toolbar";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../../Notice";
import { useSecondsLeft } from "./useSecondsLeft";

export type LoadErrorLabels = {
  retry: string;
  /** The wait a rate limit asks for: seconds, or the time once it is longer than a minute. */
  retryAfter: (seconds: number, at: Date) => string;
  copyReference: string;
  copied: string;
};

/**
 * What a reader sees in place of a list or a page that could not be read: a
 * failure in plain words, not an empty list. Try again waits out a rate
 * limit's `retryAt`, saying how long; a `reference` (the request id) is
 * there to copy for support; `children` holds one more way out, such as a
 * link back or to the usage page.
 */
export function LoadError({
  title,
  body,
  note,
  reference,
  retryAt,
  onRetry,
  labels,
  children,
}: {
  title?: string;
  body: string;
  /** One more line, such as the request allowance a rate limit counts against. */
  note?: string;
  reference?: string;
  retryAt?: Date;
  onRetry?: () => void;
  labels: LoadErrorLabels;
  children?: ReactNode;
}) {
  const left = useSecondsLeft(retryAt);
  return (
    <Notice tone="danger">
      <NoticeIcon />
      <NoticeText>
        {title ? <NoticeTitle>{title}</NoticeTitle> : null}
        <NoticeBody>{body}</NoticeBody>
        {note ? <NoticeBody>{note}</NoticeBody> : null}
        <div role="status">
          {left > 0 && retryAt ? <NoticeBody>{labels.retryAfter(left, retryAt)}</NoticeBody> : null}
        </div>
        {reference ? (
          <NoticeBody>
            <CopyValue value={reference} copyLabel={labels.copyReference} copiedLabel={labels.copied} mono />
          </NoticeBody>
        ) : null}
      </NoticeText>
      {onRetry || children ? (
        <NoticeAction>
          <Toolbar>
            {onRetry ? (
              <Button variant="secondary" onClick={onRetry} disabled={left > 0}>
                {labels.retry}
              </Button>
            ) : null}
            {children}
          </Toolbar>
        </NoticeAction>
      ) : null}
    </Notice>
  );
}
