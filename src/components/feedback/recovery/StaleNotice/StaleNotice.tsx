import { Button } from "../../../actions/Button";
import { Notice, NoticeAction, NoticeBody, NoticeText } from "../../Notice";

/**
 * A list that is behind what the server holds offers to read it again from
 * its first page. A polite live region, present before the news, announces
 * it; the notice's own words stay out of the accessibility tree so they are
 * not read twice. Reading again moves focus to `focusTarget` (the list's
 * heading), since the button that had it is gone.
 */
export function StaleNotice({
  stale,
  loading = false,
  message,
  actionLabel,
  onRefresh,
  focusTarget,
}: {
  stale: boolean;
  loading?: boolean;
  message: string;
  actionLabel: string;
  onRefresh: () => void;
  focusTarget?: () => HTMLElement | null;
}) {
  const shown = stale && !loading;
  const readAgain = () => {
    onRefresh();
    const target = focusTarget?.();
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus();
  };
  return (
    <>
      <p role="status" className="di-sr">
        {shown ? message : ""}
      </p>
      {shown ? (
        <Notice tone="neutral">
          <NoticeText>
            <NoticeBody>
              <span aria-hidden="true">{message}</span>
            </NoticeBody>
          </NoticeText>
          <NoticeAction>
            <Button variant="secondary" onClick={readAgain}>
              {actionLabel}
            </Button>
          </NoticeAction>
        </Notice>
      ) : null}
    </>
  );
}
