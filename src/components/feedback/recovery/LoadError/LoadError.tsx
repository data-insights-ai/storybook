import type { ReactNode } from "react";
import { Button } from "../../../actions/Button";
import { CopyValue } from "../../../actions/CopyValue";
import { Toolbar } from "../../../actions/Toolbar";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../../Notice";
import { useSecondsLeft } from "./useSecondsLeft";

const waitText = (left: number, at: Date, labels: LoadErrorLabels, locale: string | undefined) =>
  left <= 60
    ? labels.retryAfter(left)
    : labels.retryAt(new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(at));

export type LoadErrorLabels = {
  retry: string;
  /** A wait of a minute or less, counting down: "You can try again in 30 s." */
  retryAfter: (seconds: number) => string;
  /** A longer wait, as the time it ends (an hourly or daily allowance): "You can try again from 8 Nov, 14:00." */
  retryAt: (time: string) => string;
  copyReference: string;
  copied: string;
};

/**
 * What a reader sees in place of a list or a page that could not be read: a
 * failure in plain words, not an empty list. Try again waits out a rate
 * limit's `retryAt`, counting down a minute or less and naming the time a
 * longer wait ends; a `reference` (the request id) is
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
  locale,
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
  /** BCP 47 language tag the end of a longer wait is written in. */
  locale?: string;
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
          {left > 0 && retryAt ? <NoticeBody>{waitText(left, retryAt, labels, locale)}</NoticeBody> : null}
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
